import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MAIN_DATA_PATH = os.path.join(BASE_DIR, "data", "reports_training_data.csv")
CUSTOM_DATA_PATH = os.path.join(BASE_DIR, "data", "custom_school_safety_examples.csv")

MODEL_DIR = os.path.join(BASE_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "report_classifier.joblib")


def load_training_data() -> pd.DataFrame:
    main_df = pd.read_csv(MAIN_DATA_PATH)

    if os.path.exists(CUSTOM_DATA_PATH):
        custom_df = pd.read_csv(CUSTOM_DATA_PATH)

        main_df = main_df.dropna(subset=["text", "label"]).drop_duplicates()
        custom_df = custom_df.dropna(subset=["text", "label"]).drop_duplicates()

        custom_weight = 10
        weighted_custom_df = pd.concat([custom_df] * custom_weight, ignore_index=True)

        df = pd.concat([main_df, weighted_custom_df], ignore_index=True)
    else:
        df = main_df.dropna(subset=["text", "label"]).drop_duplicates()

    return df


def train_model() -> None:
    df = load_training_data()

    X = df["text"]
    y = df["label"]

    print("Dataset size:", len(df))
    print("Class distribution:")
    print(y.value_counts())
    print()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            lowercase=True,
            ngram_range=(1, 2),
            min_df=1
        )),
        ("classifier", LogisticRegression(
            max_iter=1000,
            class_weight="balanced"
        ))
    ])

    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)

    print("Accuracy:", accuracy_score(y_test, predictions))
    print()
    print(classification_report(y_test, predictions))

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)

    print("Model saved to:", MODEL_PATH)


if __name__ == "__main__":
    train_model()