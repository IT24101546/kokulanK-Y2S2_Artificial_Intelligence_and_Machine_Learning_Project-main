import cv2
import numpy as np
from pathlib import Path


# ── Stage 1: Brightness + Blur + Skin Color Validator ─────────────────────────
class SkinProjectValidator:
    def __init__(self,
                 min_blur_threshold=8.0,    # ✅ UPDATED: was 5.5, now matches notebook
                 max_noise_threshold=800.0, # ✅ NEW: rejects busy backgrounds (QR codes, rulers etc.)
                 low_light_threshold=50,
                 skin_ratio_strict=0.52,
                 skin_ratio_a_channel=0.58,
                 blob_bonus=0.04,
                 min_blob_fraction=0.14):
        self.min_blur_threshold   = min_blur_threshold
        self.max_noise_threshold  = max_noise_threshold
        self.low_light_threshold  = low_light_threshold
        self.skin_ratio_strict    = skin_ratio_strict
        self.skin_ratio_a_channel = skin_ratio_a_channel
        self.blob_bonus           = blob_bonus
        self.min_blob_fraction    = min_blob_fraction

    def standardize_image(self, img):
        # ✅ UPDATED: fixed 600x600 resize for consistent blur scoring across resolutions
        return cv2.resize(img, (600, 600), interpolation=cv2.INTER_AREA)

    def check_brightness(self, img_bgr):
        yuv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YUV)
        avg_y = np.mean(yuv[:,:,0])
        is_ok = 40 < avg_y < 220
        return is_ok, round(avg_y, 2), avg_y < self.low_light_threshold

    def check_blur(self, img_bgr):
        # ✅ UPDATED: single threshold (no low-light split), also checks for noisy/busy images
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        variance = round(cv2.Laplacian(gray, cv2.CV_64F).var(), 2)

        if variance < self.min_blur_threshold:
            return False, variance, "Too Blurry"
        if variance > self.max_noise_threshold:
            return False, variance, "Too Noisy/Busy Background"
        return True, variance, "OK"

    def get_center_mask(self, h, w):
        cy, cx = h // 2, w // 2
        dy, dx = int(h * 0.4), int(w * 0.4)
        mask = np.zeros((h, w), np.uint8)
        mask[cy-dy:cy+dy, cx-dx:cx+dx] = 255
        return mask, (dy * dx * 4)

    def check_is_skin(self, img_bgr):
        h, w = img_bgr.shape[:2]
        center_mask, center_area = self.get_center_mask(h, w)

        ycrcb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
        mask_strict = cv2.inRange(ycrcb, (0, 133, 77), (255, 185, 135))
        mask_strict = cv2.dilate(mask_strict, np.ones((3,3), np.uint8), iterations=1)
        ratio_strict = np.count_nonzero(cv2.bitwise_and(mask_strict, center_mask)) / np.count_nonzero(center_mask)

        lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2Lab)
        mask_a = cv2.inRange(lab[:,:,1], 115, 160)
        mask_a = cv2.dilate(mask_a, np.ones((3,3), np.uint8), iterations=1)
        ratio_a = np.count_nonzero(cv2.bitwise_and(mask_a, center_mask)) / np.count_nonzero(center_mask)

        skin_ok = (ratio_strict >= self.skin_ratio_strict) or (ratio_a >= self.skin_ratio_a_channel)
        reason_detail = f"Strict: {ratio_strict:.3f} | A-chan: {ratio_a:.3f}"

        _, _, lesion_mask = self.isolate_lesion_simple(img_bgr)
        if np.count_nonzero(lesion_mask) > self.min_blob_fraction * center_area:
            if not skin_ok and max(ratio_strict, ratio_a) >= 0.35:
                skin_ok = True
                reason_detail += " | Lesion Bonus Applied"

        MIN_ACCEPTABLE_SKIN = 0.45
        if max(ratio_strict, ratio_a) < MIN_ACCEPTABLE_SKIN:
            skin_ok = False
            reason_detail += f" | Hard floor triggered (< {MIN_ACCEPTABLE_SKIN})"

        return skin_ok, max(ratio_strict, ratio_a), reason_detail, mask_strict

    def isolate_lesion_simple(self, img_bgr):
        lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2Lab)
        blurred = cv2.GaussianBlur(lab[:,:,1], (5,5), 0)
        _, mask = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5,5), np.uint8))
        return None, cv2.bitwise_and(img_bgr, img_bgr, mask=mask), mask

    def process_and_validate(self, image_path):
        img = cv2.imread(str(image_path))
        if img is None:
            return {"status": "error", "reason": "Cannot read image"}

        img = self.standardize_image(img)

        # 1. Brightness check
        bright_ok, b_score, is_low = self.check_brightness(img)
        if not bright_ok:
            return {"status": "rejected", "reason": "Lighting", "score": b_score}

        # 2. Blur + noise check (single call now covers both)
        blur_ok, v_score, blur_reason = self.check_blur(img)
        if not blur_ok:
            return {"status": "rejected", "reason": blur_reason, "score": v_score}

        # 3. Skin detection check
        skin_ok, s_score, detail, _ = self.check_is_skin(img)
        if not skin_ok:
            reason = "Too far away" if s_score < 0.45 else "Not skin"
            return {"status": "rejected", "reason": reason, "score": s_score, "detail": detail}

        return {
            "status": "accepted",
            "scores": {"blur": v_score, "skin": s_score},
            "detail": detail
        }


# ── Stage 2: HSV Color Masking + Lesion Isolation Validator ───────────────────
class OpenCVInputValidator:
    def __init__(self, blur_threshold=150):
        self.blur_threshold = blur_threshold
        self.color_ranges = {
            'skin_primary':   {'lower': np.array([0,  30,  60], dtype=np.uint8), 'upper': np.array([ 20, 150, 255], dtype=np.uint8)},
            'skin_secondary': {'lower': np.array([0,   0,  40], dtype=np.uint8), 'upper': np.array([180,  50, 200], dtype=np.uint8)},
            'lesion_dark':    {'lower': np.array([0,   0,   0], dtype=np.uint8), 'upper': np.array([180, 255,  80], dtype=np.uint8)},
        }

    def apply_color_masking_hsv(self, image_path):
        try:
            image = cv2.imread(str(image_path))
            if image is None: return None, 0, 0, None
            height, width = image.shape[:2]
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            skin_mask = cv2.bitwise_or(
                cv2.inRange(hsv, self.color_ranges['skin_primary']['lower'],   self.color_ranges['skin_primary']['upper']),
                cv2.inRange(hsv, self.color_ranges['skin_secondary']['lower'], self.color_ranges['skin_secondary']['upper'])
            )
            lesion_mask = cv2.inRange(hsv, self.color_ranges['lesion_dark']['lower'], self.color_ranges['lesion_dark']['upper'])
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            skin_mask   = cv2.morphologyEx(cv2.morphologyEx(skin_mask,   cv2.MORPH_OPEN, kernel), cv2.MORPH_CLOSE, kernel)
            lesion_mask = cv2.morphologyEx(cv2.morphologyEx(lesion_mask, cv2.MORPH_OPEN, kernel), cv2.MORPH_CLOSE, kernel)
            lesion_mask = cv2.bitwise_and(lesion_mask, cv2.bitwise_not(skin_mask))
            total_pixels = height * width
            skin_pct   = (np.count_nonzero(skin_mask)   / total_pixels) * 100
            lesion_pct = (np.count_nonzero(lesion_mask) / total_pixels) * 100
            return cv2.bitwise_and(image, image, mask=lesion_mask), skin_pct, lesion_pct, None
        except Exception:
            return None, 0, 0, None

    def detect_blur_laplacian(self, image_path):
        try:
            image = cv2.imread(str(image_path))
            if image is None: return 0, True, "Failed to load image"
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            variance = cv2.Laplacian(gray, cv2.CV_64F).var()
            is_blurry = variance < self.blur_threshold
            return variance, is_blurry, f"{'BLURRY' if is_blurry else 'SHARP'}: Variance={variance:.2f}"
        except Exception as e:
            return 0, True, f"Error: {str(e)}"

    def validate_image(self, image_path):
        variance, is_blurry, _ = self.detect_blur_laplacian(image_path)
        if is_blurry:
            return {"status": "rejected", "reason": f"Blurry image (variance={variance:.2f})", "scores": {}}
        _, skin_pct, lesion_pct, _ = self.apply_color_masking_hsv(image_path)
        if lesion_pct < 1.0:
            return {"status": "rejected", "reason": f"Insufficient lesion region ({lesion_pct:.2f}%)", "scores": {"blur": variance, "skin": skin_pct, "lesion": lesion_pct}}
        if skin_pct < 5.0:
            return {"status": "rejected", "reason": f"Insufficient skin region ({skin_pct:.2f}%)", "scores": {"blur": variance, "skin": skin_pct, "lesion": lesion_pct}}
        return {"status": "accepted", "scores": {"blur": variance, "skin": skin_pct, "lesion": lesion_pct}}