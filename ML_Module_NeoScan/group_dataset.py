import pandas as pd

# -------------------------
# LOAD MERGED DATA
# -------------------------
df = pd.read_csv("final_merged_clean.csv")

# -------------------------
# GROUP BY PATIENT
# -------------------------
# 3 images → 1 patient (average)
df_grouped = df.groupby("patient_id").mean(numeric_only=True).reset_index()

# -------------------------
# SAVE
# -------------------------
df_grouped.to_csv("final_ml_dataset.csv", index=False)

print("✅ GROUPING DONE")
print("Total patients:", len(df_grouped))
print(df_grouped.head())