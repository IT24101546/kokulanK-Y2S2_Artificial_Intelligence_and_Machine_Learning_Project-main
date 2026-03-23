import os
import torch
import torch.nn as nn
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from torchvision import models, transforms
from PIL import Image
from skin_logic import SkinProjectValidator

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. Initialization ---
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
class_names = ['BCC', 'BKL', 'MEL', 'NV']

# Two-stage gatekeeper
stage1 = SkinProjectValidator()   # Brightness + blur + skin color check
stage2 = OpenCVInputValidator()    # HSV color masking + lesion isolation check

# --- 2. Load Model ---
model = models.resnet50(weights=None)
num_ftrs = model.fc.in_features
model.fc = nn.Linear(num_ftrs, 4)
model.load_state_dict(torch.load("best_model_v3.pth", map_location=device))
model.eval()
model.to(device)

inference_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.get("/")
def root():
    return {"status": "Skin Lesion Classifier API is running"}

@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    temp_path = f"temp_{image.filename}"

    with open(temp_path, "wb") as buffer:
        buffer.write(await image.read())

    # ── Stage 1: Brightness + blur + skin color (SkinProjectValidator) ──────
    stage1_result = stage1.process_and_validate(temp_path)
    if stage1_result["status"] == "rejected":
        os.remove(temp_path)
        return {
            "status": "rejected",
            "stage": "stage1",
            "reason": stage1_result["reason"],
            "detail": stage1_result.get("detail", "")
        }

    # ── Stage 2: HSV color masking + lesion isolation (OpenCVInputValidator) ─
    stage2_result = stage2.validate_image(temp_path)
    if stage2_result["status"] == "rejected":
        os.remove(temp_path)
        return {
            "status": "rejected",
            "stage": "stage2",
            "reason": stage2_result["reason"],
            "detail": stage2_result.get("detail", "")
        }

    # ── AI Inference (only if both stages pass) ───────────────────────────────
    img = Image.open(temp_path).convert("RGB")
    img_tensor = inference_transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        confidence, predicted_idx = torch.max(probabilities, 0)

    os.remove(temp_path)

    return {
        "status": "accepted",
        "label":      class_names[predicted_idx.item()],
        "confidence": round(confidence.item() * 100, 2),
        "quality_scores": {
            "stage1": stage1_result.get("scores", {}),
            "stage2": stage2_result.get("scores", {})
        }
    }