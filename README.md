# NeoScan AI-Minor-Project-
A Smart Non-Invasive System for Neonatal Jaundice Screening Using Image Analysis

NeoScan AI is a Minor Project developed under the Bachelor of Technology (Computer Science Engineering) program. The system aims to provide a **basic, functional, and non-invasive screening solution for neonatal jaundice** using smartphone-based image processing and simple AI/ML techniques.

The project demonstrates how digital healthcare tools can assist in early detection of neonatal jaundice in an accessible and cost-effective manner.

---

## Problem Statement

Neonatal jaundice affects a significant percentage of newborns during their first week of life. In many cases, bilirubin levels peak after hospital discharge, creating a monitoring gap. Traditional testing methods are either:

* **Invasive** (blood-based Total Serum Bilirubin tests), or
* **Expensive** (transcutaneous bilirubinometers)

There is a need for a low-cost, smartphone-based, non-invasive screening system that can assist in early risk identification.

---

## Project Objective

The objective of this minor project is to develop a **basic and functional system for non-invasive neonatal jaundice screening**.

### Specific Objectives

1. To design and develop a basic smart screening system for neonatal jaundice detection.
2. To analyze visual indicators related to neonatal jaundice using fundamental image processing techniques.
3. To classify neonatal jaundice risk using simple decision logic or basic machine learning methods.

---

## Team & Responsibilities

### Frontend Development — Sameer Kumar Rai

* UI/UX design
* Login and baby information forms
* Image capture interface
* One-tap dual image capture (Flash + No Flash)
* Result display interface

### Backend Development — Anjali Kumari

* API development
* Database integration
* Image upload handling
* Data routing between frontend and AI module
* System integration

### AI/ML & Image Processing — Samiya Sehgal

* Image preprocessing using OpenCV
* Lighting normalization and color calibration
* RGB feature extraction
* Simple ML model / rule-based classification
* Risk prediction logic
* Model validation and testing

---

## System Workflow (Minor Project Version)

The system follows a structured pipeline:

### 1. User Interface

* User logs in
* Enters newborn details (Name, Age, Weight, etc.)

### 2. One-Tap Dual Image Capture

The system captures:

* One image with flash
* One image without flash

This helps reduce lighting variations.

### 3. Image & Color Calibration

* Ambient light subtraction (Flash − No Flash)
* Noise reduction
* Basic normalization

Purpose: Improve reliability of extracted color values.

### 4. Image Processing Module

* Region of Interest (skin area) extraction
* RGB channel analysis
* Computation of:

  * Mean R, G, B values
  * Normalized RGB
  * Basic color ratios

These values act as visual indicators correlated with bilirubin levels.

### 5. AI / ML Processing

* Extracted RGB features are passed to the AI module
* Simple regression or rule-based logic processes the data
* Estimated bilirubin indicator is generated

### 6. Risk Classification

The system classifies risk into:

* Low Risk
* Medium Risk
* High Risk

### 7. Result Display

Clear and simple output is displayed to the user.

---

## Technology Stack (Minor Version)

### Frontend

* HTML
* CSS
* JavaScript
* Camera API

### Backend

* Python / Flask (or equivalent backend framework)
* Database integration

### AI & Image Processing

* Python
* OpenCV
* NumPy
* Scikit-learn (basic models)

---

## Minor Project Scope

The minor project focuses on:

* Functional UI
* Controlled dual image capture
* Basic lighting normalization
* RGB feature extraction
* Simple ML or rule-based classification
* End-to-end working prototype

The goal is to demonstrate feasibility and structured system design — not full clinical deployment.

---

## Future Scope (Major Project Vision)

For the major project, NeoScan AI can be extended with:

* Advanced deep learning models (CNN-based analysis)
* Larger clinically validated dataset
* Bhutani Nomogram age-based risk mapping
* Automated skin region detection
* Skin-tone bias correction
* Mobile application deployment
* Cloud-based analytics dashboard
* Hospital integration and real-time monitoring

These enhancements will improve clinical reliability, scalability, and real-world applicability.

---

## Project Significance

NeoScan AI addresses the critical gap between early hospital discharge and peak bilirubin levels in newborns. By combining smartphone imaging and AI-based analysis, the system demonstrates how affordable digital healthcare solutions can support early screening in low-resource environments.

---

## Current Development Goal

Develop a clean, structured, and fully functional prototype that:

* Captures dual images (Flash + No Flash)
* Performs lighting normalization
* Extracts RGB indicators
* Applies simple ML logic
* Displays clear risk classification

---

**NeoScan AI — Bridging Technology and Neonatal Healthcare.**
