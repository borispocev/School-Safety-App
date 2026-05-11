import os
import joblib
from fastapi import FastAPI
from pydantic import BaseModel


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "report_classifier.joblib")

TYPE_NAMES = {
    "SPEEDING": "Speeding",
    "UNSAFE_CROSSWALK": "Unsafe Crosswalk",
    "MISSING_SIGNAGE": "Missing Signage",
    "POOR_LIGHTING": "Poor Lighting",
    "OTHER": "Other"
}

HIGH_RISK_KEYWORDS = [
    "students",
    "children",
    "kids",
    "pupils",
    "school entrance",
    "crosswalk",
    "pedestrian",
    "immediate",
    "urgent",
    "danger",
    "dangerous",
    "unsafe",
    "risk",
    "accident",
    "almost hit",
    "hit",
    "injury",
    "injured",
    "threat",
    "driving fast",
    "too fast",
    "speeding",
    "drag racing",
    "do not stop",
    "didn't stop",
    "blocked crosswalk",
    "dark",
    "no lights",
    "street light out",
    "scared",
    "afraid",
    "fear",
    "school yard",
    "schoolyard",
    "proper lighting",
    "waiting in the dark",
    "dark outside",
    "son",
    "daughter",
    "child",
    "children",

    # Macedonian keywords
    "ученици",
    "деца",
    "пешачки",
    "пешачки премин",
    "опасно",
    "опасност",
    "ризик",
    "итно",
    "веднаш",
    "брзо",
    "пребрзо",
    "возат брзо",
    "не застануваат",
    "не застана",
    "безбедно",
    "небезбедно",
    "нема светло",
    "темно",
    "сообраќајка",
    "повреда",
    "исплашен",
    "исплашена",
    "страв",
    "училишен двор",
    "двор",
    "нема осветлување",
    "нема соодветно осветлување",
    "темно надвор",
    "син",
    "ќерка",
    "дете",
    "деца"
]

URGENT_KEYWORDS = [
    "urgent",
    "immediate",
    "accident",
    "hit",
    "injured",
    "almost hit",
    "life threatening",
    "emergency",

    # Macedonian keywords
    "итно",
    "веднаш",
    "сообраќајка",
    "удри",
    "повреден",
    "повреда",
    "животна опасност"
]


class ClassificationRequest(BaseModel):
    title: str | None = ""
    description: str | None = ""
    locationDetails: str | None = ""


class ClassificationResponse(BaseModel):
    predictedTypeCode: str
    predictedTypeName: str
    confidenceScore: float
    suggestedPriority: str
    riskKeywords: list[str]


app = FastAPI(title="SchoolSafety ML Service")

model = joblib.load(MODEL_PATH)


@app.get("/health")
def health():
    return {"status": "ok"}

def apply_domain_correction(predicted_label: str, text: str) -> str:
    value = text.lower()

    unsafe_crosswalk_patterns = [
        "faded crosswalk",
        "crosswalk is faded",
        "crosswalk is nearly faded",
        "crosswalk markings are faded",
        "pedestrian crossing is faded",
        "crosswalk is not visible",
        "crossing is not visible",
        "students cross",
        "cannot cross safely"
    ]

    missing_signage_patterns = [
        "missing sign",
        "no sign",
        "traffic sign is missing",
        "school zone sign",
        "warning sign is missing",
        "sign is damaged"
    ]

    poor_lighting_patterns = [
        "street light out",
        "no lights",
        "poor lighting",
        "very dark",
        "dark at night",
        "lights are not working"
    ]

    speeding_patterns = [
        "speeding",
        "driving too fast",
        "driving really fast",
        "cars are racing",
        "drag racing",
        "high speed"
    ]

    if any(pattern in value for pattern in unsafe_crosswalk_patterns):
        return "UNSAFE_CROSSWALK"

    if any(pattern in value for pattern in missing_signage_patterns):
        return "MISSING_SIGNAGE"

    if any(pattern in value for pattern in poor_lighting_patterns):
        return "POOR_LIGHTING"

    if any(pattern in value for pattern in speeding_patterns):
        return "SPEEDING"

    return predicted_label


@app.post("/classify-report", response_model=ClassificationResponse)
def classify_report(request: ClassificationRequest):
    text = f"{request.title or ''} {request.description or ''} {request.locationDetails or ''}"
    normalized_text = text.lower()

    predicted_label = model.predict([text])[0]
    predicted_label = apply_domain_correction(predicted_label, text)

    confidence_score = 0.0
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba([text])[0]
        confidence_score = float(max(probabilities))

    risk_keywords = detect_risk_keywords(normalized_text)
    suggested_priority = suggest_priority(
        predicted_label,
        confidence_score,
        risk_keywords,
        normalized_text
    )

    return ClassificationResponse(
        predictedTypeCode=predicted_label,
        predictedTypeName=TYPE_NAMES.get(predicted_label, "Other"),
        confidenceScore=round(confidence_score, 4),
        suggestedPriority=suggested_priority,
        riskKeywords=risk_keywords
    )


def detect_risk_keywords(text: str) -> list[str]:
    matched_keywords = []

    for keyword in HIGH_RISK_KEYWORDS:
        if keyword.lower() in text:
            matched_keywords.append(keyword)

    return sorted(set(matched_keywords))


def suggest_priority(
        predicted_type_code: str,
        confidence_score: float,
        risk_keywords: list[str],
        text: str
) -> str:
    urgent_matches = [
        keyword for keyword in URGENT_KEYWORDS
        if keyword.lower() in text
    ]

    if urgent_matches:
        return "URGENT"

    risk_count = len(risk_keywords)

    high_risk_types = {
        "SPEEDING",
        "UNSAFE_CROSSWALK"
    }

    medium_risk_types = {
        "MISSING_SIGNAGE",
        "POOR_LIGHTING"
    }

    if predicted_type_code in high_risk_types and risk_count >= 2:
        return "HIGH"

    if predicted_type_code in high_risk_types:
        return "MEDIUM"

    if predicted_type_code in medium_risk_types and risk_count >= 2:
        return "HIGH"

    if predicted_type_code in medium_risk_types:
        return "MEDIUM"

    if risk_count >= 3:
        return "HIGH"

    if risk_count >= 1:
        return "MEDIUM"

    return "LOW"