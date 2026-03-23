import cv2
import numpy as np
from pathlib import Path


class OpenCVInputValidator:
    """
    Input validation using HSV color masking and Laplacian variance blur detection.
    Used as a second gatekeeper after SkinProjectValidator.
    """

    def __init__(self, blur_threshold=150):
        self.blur_threshold = blur_threshold

        # HSV color ranges for skin lesion segmentation
        self.color_ranges = {
            'skin_primary': {
                'lower': np.array([0, 30, 60],   dtype=np.uint8),
                'upper': np.array([20, 150, 255], dtype=np.uint8)
            },
            'skin_secondary': {
                'lower': np.array([0, 0, 40],    dtype=np.uint8),
                'upper': np.array([180, 50, 200], dtype=np.uint8)
            },
            'lesion_dark': {
                'lower': np.array([0, 0, 0],      dtype=np.uint8),
                'upper': np.array([180, 255, 80], dtype=np.uint8)
            }
        }

    def apply_color_masking_hsv(self, image_path):
        try:
            image = cv2.imread(str(image_path))
            if image is None:
                return None, 0, 0

            height, width = image.shape[:2]
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

            skin_mask_primary   = cv2.inRange(hsv, self.color_ranges['skin_primary']['lower'],   self.color_ranges['skin_primary']['upper'])
            skin_mask_secondary = cv2.inRange(hsv, self.color_ranges['skin_secondary']['lower'], self.color_ranges['skin_secondary']['upper'])
            lesion_mask_raw     = cv2.inRange(hsv, self.color_ranges['lesion_dark']['lower'],    self.color_ranges['lesion_dark']['upper'])

            skin_mask   = cv2.bitwise_or(skin_mask_primary, skin_mask_secondary)
            kernel      = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            skin_mask   = cv2.morphologyEx(skin_mask,       cv2.MORPH_OPEN,  kernel)
            skin_mask   = cv2.morphologyEx(skin_mask,       cv2.MORPH_CLOSE, kernel)
            lesion_mask = cv2.morphologyEx(lesion_mask_raw, cv2.MORPH_OPEN,  kernel)
            lesion_mask = cv2.morphologyEx(lesion_mask,     cv2.MORPH_CLOSE, kernel)
            lesion_mask = cv2.bitwise_and(lesion_mask, cv2.bitwise_not(skin_mask))

            total_pixels   = height * width
            skin_pct   = (np.count_nonzero(skin_mask)   / total_pixels) * 100
            lesion_pct = (np.count_nonzero(lesion_mask) / total_pixels) * 100

            return skin_pct, lesion_pct, None

        except Exception as e:
            return 0, 0, str(e)

    def detect_blur_laplacian(self, image_path):
        try:
            image = cv2.imread(str(image_path))
            if image is None:
                return 0, True, "Failed to load image"

            gray      = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            variance  = cv2.Laplacian(gray, cv2.CV_64F).var()
            is_blurry = variance < self.blur_threshold
            return variance, is_blurry, None

        except Exception as e:
            return 0, True, str(e)

    def validate_image(self, image_path):
        """
        Run both blur detection and HSV color masking.
        Returns a dict compatible with the app.py gatekeeper pipeline.
        """
        # Step 1: Blur check
        variance, is_blurry, err = self.detect_blur_laplacian(image_path)
        if err:
            return {"status": "error", "reason": f"Blur check error: {err}"}
        if is_blurry:
            return {
                "status": "rejected",
                "reason": "Blurry image",
                "detail": f"Laplacian variance {variance:.2f} < threshold {self.blur_threshold}",
                "scores": {"blur_variance": round(variance, 2)}
            }

        # Step 2: HSV color masking
        skin_pct, lesion_pct, err = self.apply_color_masking_hsv(image_path)
        if err:
            return {"status": "error", "reason": f"Color masking error: {err}"}

        if lesion_pct < 1.0:
            return {
                "status": "rejected",
                "reason": "Insufficient lesion region",
                "detail": f"Lesion area {lesion_pct:.2f}% is below 1% threshold",
                "scores": {"blur_variance": round(variance, 2), "lesion_pct": round(lesion_pct, 2)}
            }

        if skin_pct < 5.0:
            return {
                "status": "rejected",
                "reason": "Insufficient skin region",
                "detail": f"Skin area {skin_pct:.2f}% is below 5% threshold",
                "scores": {"blur_variance": round(variance, 2), "skin_pct": round(skin_pct, 2)}
            }

        return {
            "status": "accepted",
            "scores": {
                "blur_variance": round(variance, 2),
                "skin_pct":      round(skin_pct, 2),
                "lesion_pct":    round(lesion_pct, 2)
            }
        }