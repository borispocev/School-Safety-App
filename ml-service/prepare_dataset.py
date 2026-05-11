import os
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_PATH = os.path.join(BASE_DIR, "data", "nyc_311_sample.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "reports_training_data.csv")


def normalize_column_names(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [
        column.strip().lower().replace(" ", "_").replace('"', "")
        for column in df.columns
    ]
    return df


def find_column(df: pd.DataFrame, possible_names: list[str]) -> str | None:
    for name in possible_names:
        if name in df.columns:
            return name
    return None


def map_to_schoolsafety_label(text: str) -> str | None:
    value = text.lower()

    # 1. Unsafe crosswalk
    if any(keyword in value for keyword in [
        "blocked crosswalk",
        "crosswalk",
        "pedestrian",
        "unsafe crossing"
    ]):
        return "UNSAFE_CROSSWALK"

    # 2. Poor lighting
    if any(keyword in value for keyword in [
        "street light",
        "streetlight",
        "light out",
        "lighting",
        "luminaire",
        "fixture"
    ]):
        return "POOR_LIGHTING"

    # 3. Missing signage / signalization
    if any(keyword in value for keyword in [
        "street sign",
        "traffic sign",
        "sign dangling",
        "sign missing",
        "sign damaged",
        "traffic signal",
        "stoplight",
        "signal condition",
        "controller"
    ]):
        return "MISSING_SIGNAGE"

    # 4. Speeding / dangerous driving
    if any(keyword in value for keyword in [
        "speeding",
        "drag racing",
        "speed hump",
        "speed bump",
        "fast driving",
        "chronic stoplight violation"
    ]):
        return "SPEEDING"

    # 5. Other safety-related traffic risk
    if any(keyword in value for keyword in [
        "traffic",
        "congestion",
        "gridlock",
        "street condition",
        "hazard",
        "unsafe",
        "roadway"
    ]):
        return "OTHER"

    return None


def prepare_dataset() -> None:
    df = pd.read_csv(RAW_DATA_PATH, low_memory=False)
    df = normalize_column_names(df)

    complaint_col = find_column(df, ["complaint_type"])
    descriptor_col = find_column(df, ["descriptor"])
    location_type_col = find_column(df, ["location_type"])
    incident_address_col = find_column(df, ["incident_address"])
    street_name_col = find_column(df, ["street_name"])

    if complaint_col is None or descriptor_col is None:
        raise ValueError(
            f"Required columns not found. Available columns: {list(df.columns)}"
        )

    text_columns = []
    for col in [complaint_col, descriptor_col, location_type_col, incident_address_col, street_name_col]:
        if col is not None:
            text_columns.append(df[col].fillna("").astype(str))

    combined_text = text_columns[0]
    for part in text_columns[1:]:
        combined_text = combined_text + " " + part

    output = pd.DataFrame()
    output["text"] = combined_text
    output["label"] = output["text"].apply(map_to_schoolsafety_label)

    output = output.dropna(subset=["label"])
    output = output.drop_duplicates()

    output.to_csv(OUTPUT_PATH, index=False)

    print("Prepared dataset saved to:", OUTPUT_PATH)
    print()
    print("Class distribution:")
    print(output["label"].value_counts())


if __name__ == "__main__":
    prepare_dataset()