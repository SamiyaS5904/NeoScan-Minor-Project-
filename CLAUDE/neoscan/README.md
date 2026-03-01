# NeoScan — Frontend

Smart Non-Invasive Neonatal Jaundice Screening System  
React frontend for the NeoScan AI bilirubin estimation platform.

---

## Tech Stack

- **React 18** with functional components & hooks
- **React Router v6** for navigation & protected routes
- **Tailwind CSS v3** for styling (glassmorphism, gradients)
- **Axios** for API communication (JWT auth header injection)
- **Chart.js + react-chartjs-2** for trend graphs
- **Browser MediaDevices API** for camera access

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky responsive navbar
│   ├── Footer.jsx          # Site footer
│   ├── ProtectedRoute.jsx  # JWT-protected route wrapper
│   ├── CameraCapture.jsx   # Reusable camera component
│   ├── RiskMeter.jsx       # Canvas-based circular gauge
│   ├── TrendChart.jsx      # 7-day bilirubin trend (Chart.js)
│   └── Spinner.jsx         # Loading spinner
├── context/
│   └── AuthContext.jsx     # JWT auth context & provider
├── hooks/
│   ├── useCamera.js        # MediaDevices camera hook
│   └── usePolling.js       # Async result polling hook
├── pages/
│   ├── LandingPage.jsx     # Marketing homepage
│   ├── AboutPage.jsx       # About NeoScan
│   ├── ResearchPage.jsx    # Clinical validation & charts
│   ├── LoginPage.jsx       # JWT login form
│   ├── RegisterPage.jsx    # Registration form
│   ├── DashboardPage.jsx   # Protected: results & trend
│   ├── CalibrationPage.jsx # Protected: white balance step
│   └── ScanPage.jsx        # Protected: baby image capture
├── utils/
│   └── api.js              # Axios instance + API methods
├── App.jsx                 # Router & route definitions
├── index.js                # Entry point
└── index.css               # Global styles + Tailwind
```

---

## Setup & Run

### 1. Clone / unzip the project

```bash
cd neoscan
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env — set REACT_APP_API_URL to your Flask backend URL
```

### 4. Start development server

```bash
npm start
# Opens at http://localhost:3000
```

### 5. Build for production

```bash
npm run build
```

---

## Flask Backend Integration

The frontend expects these endpoints:

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| POST   | `/login`           | Returns `{ token, user }` on success |
| POST   | `/register`        | Creates user account                 |
| POST   | `/calibrate`       | Accepts `multipart/form-data` image  |
| POST   | `/analyze`         | Accepts `multipart/form-data` image, returns `{ scan_id }` |
| GET    | `/result/<scan_id>` | Returns `{ status, bilirubin, risk_level, confidence }` when ready |

### CORS
Make sure Flask has CORS enabled:
```python
from flask_cors import CORS
CORS(app)
```

### Result polling
The frontend polls `/result/<scan_id>` every 5 seconds until `status === "ready"`.

---

## Features

- ✅ Scroll-based marketing landing page
- ✅ JWT authentication (login, register, protected routes)
- ✅ 3-step workflow: Calibrate → Scan → Results
- ✅ MediaDevices camera with capture, preview, retake
- ✅ Real-time result polling with loading UI
- ✅ Circular risk meter with Canvas API
- ✅ 7-day bilirubin trend chart
- ✅ Report download (text format)
- ✅ Fully responsive (mobile-first)
- ✅ Glassmorphism medical UI design

---

## Disclaimer

NeoScan is an academic research prototype. Not a certified medical device.  
Always consult a qualified healthcare professional for neonatal assessment.
