import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor
import joblib
import os

print("1. Loading Dataset...")
# Replace with your dataset path if running elsewhere
df = pd.read_csv(r"d:\MINOR PROJECT G9\ML_Module_NeoScan\final_ml_dataset.csv")

print("2. Generating Feature Engineering Columns...")
# Replicating the exact math used in the backend API
df['R_minus_B'] = df['R'] - df['B']
df['LAB_ratio'] = np.where(df['LAB_B'] != 0, df['LAB_A'] / df['LAB_B'], 0)
df['Age_LABB'] = df['age_days'] * df['LAB_B']

# The exact column order the API expects
feature_cols = [
    'R', 'G', 'B', 'S', 
    'LAB_L', 'LAB_A', 'LAB_B', 
    'age_days', 'gestational_age', 
    'R_minus_B', 'LAB_ratio', 'Age_LABB'
]

X = df[feature_cols]
y = df['bilirubin']

print("3. Splitting Data (80% Train, 20% Test)...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("4. Calculating Sample Weights (CRUCIAL)...")
# FIX FOR UNDERPREDICTION BUG: 
# Since most babies have low bilirubin, the model lazily pulls all predictions down.
# We are drastically increasing the weights for high bilirubin values.
weights = np.ones(len(y_train))
weights = np.where(y_train > 8, 2.0, weights)
weights = np.where(y_train > 12, 5.0, weights)
weights = np.where(y_train > 14, 10.0, weights) # Massive penalty for missing very high values
weights = np.where(y_train > 18, 15.0, weights)

print("5. Scaling Features...")
# Scale X to have mean=0, std=1. We must save this exact scaler.
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("6. Tuning and Training XGBoost Model...")
# A robust grid search to find the perfect balance between depth and regularization
param_grid = {
    'max_depth': [6, 8, 10, 12],     # Allow deeper trees to catch severe jaundice and outliers
    'learning_rate': [0.05, 0.1],
    'n_estimators': [200, 300],      # More estimators to refine the fit
    'reg_lambda': [0.01, 0.1, 0.5],  # Very low regularization so it doesn't suppress extreme values
    'reg_alpha': [0, 0.05]           # L1 Regularization
}

base_model = XGBRegressor(random_state=42, objective='reg:squarederror')
grid_search = GridSearchCV(
    estimator=base_model, 
    param_grid=param_grid, 
    scoring='r2', 
    cv=3, 
    n_jobs=1
)

# Fit using our custom weights!
grid_search.fit(X_train_scaled, y_train, sample_weight=weights)

best_model = grid_search.best_estimator_
print(f"\nTraining Complete! Best Parameters Selected: {grid_search.best_params_}")

# Evaluate
train_score = best_model.score(X_train_scaled, y_train)
test_score = best_model.score(X_test_scaled, y_test)
print(f"Training R2 Score: {train_score:.3f}")
print(f"Testing R2 Score: {test_score:.3f}")

print("\n7. Exporting Final Models to Backend API Directory...")
output_dir = r"d:\MINOR PROJECT G9\Final Evaulation\ml_models"
os.makedirs(output_dir, exist_ok=True)

scaler_path = os.path.join(output_dir, "neoscan_scaler.pkl")
model_path = os.path.join(output_dir, "neoscan_xgboost.pkl")

# Save files
joblib.dump(scaler, scaler_path)
joblib.dump(best_model, model_path)

print(f"SUCCESS! Models saved securely to:")
print(f"- {scaler_path}")
print(f"- {model_path}")
print("\nRestart your Django server to load the new models.")
