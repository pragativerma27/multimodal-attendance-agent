# Multimodal Attendance & Engagement Agent 🎓⚡

> **An AI-powered, privacy-preserving classroom intelligence platform that automatically verifies student attendance, analyzes multimodal classroom engagement, processes acoustic telemetry with Web Audio API, and provides intelligent teaching recommendations.**

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2F19-61dafb.svg)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 📌 Project Overview

Traditional attendance rolls and passive lecture formats face critical challenges: roll call consumes valuable instructional time, paper logs invite proxy attendance, and instructors lack objective, real-time insight into whether students are genuinely engaged or experiencing cognitive fatigue.

The **Multimodal Attendance & Engagement Agent** solves this through a non-invasive, privacy-preserving architecture:
1. **Continuous Facial Presence Verification**: Employs real-time computer vision with sustained gaze duration checks (>= 3.0s) to guarantee physical presence and eliminate photo/proxy spoofing.
2. **Duplicate Attendance Protection**: Intelligent compound indexing ensures each student is recorded only once per lecture session.
3. **Multimodal Engagement Telemetry**: Synthesizes 4 behavioral proxies—visual focus ratio, head posture vitality, inactivity latency, and acoustic energy—into a composite **0–100 Attention Index** classified as *High*, *Moderate*, or *Low Engagement*.
4. **Web Audio Acoustic Analyzer**: Real-time 32-band FFT frequency visualizer and decibel (dB) noise floor estimation without voice recording or speech transcription.
5. **Adaptive AI Teaching Recommendations**: A rule-based inference engine that alerts educators when engagement drops, suggests 90-second posture stretch breaks, or prompts interactive "Think-Pair-Share" exercises.
6. **Comprehensive Analytics & Export**: Generates printable PDF academic report cards and CSV attendance exports for institutional administration.

---

## 🏗️ Technology Stack

### Frontend
- **React.js** (Vite build system)
- **Tailwind CSS** (Custom dark navy SaaS theme & glowing gradients)
- **React Router v6** (Protected and dynamic routing)
- **Axios** (JWT Bearer token authorization interceptors)
- **Recharts** (Interactive time-series, bar, area, and donut analytics)
- **Lucide React** (Modern iconography)
- **Canvas Confetti** (Instant celebratory visual confirmation)
- **jsPDF & AutoTable** (Client-side formatted academic PDF generation)

### Backend
- **Node.js & Express.js** (High-throughput RESTful API architecture)
- **MongoDB & Mongoose ODM** (Document validation, timestamps, and relational schemas)
- **JSON Web Tokens (JWT)** & **Bcrypt.js** (Cryptographic password hashing and stateless authorization)
- **Multer** (Profile photo and classroom audio upload pipeline)
- **Morgan** (HTTP request logger)

### AI, Computer Vision & Audio
- **Browser Computer Vision Overlay**: Canvas face mesh coordinates & sustained presence verification loop.
- **Web Audio API**: Client-side `AudioContext` & `AnalyserNode` for live frequency spectrum and dB estimation.
- **Ethical AI Engine**: Rule-based recommendation system with explicit privacy preservation (zero biometric raw video or voice recording storage).

---

## 🚀 Key Features

- 🔐 **Dual Role Authentication**: Admin and Instructor portals with instant single-click demo access.
- 📊 **Executive Dashboard**: Roster metrics, attendance percentages, live engagement charts, and quick-action toolbars.
- 👥 **Student Directory**: Full CRUD management, photo avatar uploads, student ID roll codes, and profile drawers.
- 👁️ **Automated Attendance**: Continuous presence gaze timer, camera integration, duplicate protection, and manual override controls.
- 🎭 **Classroom Engagement Monitor**: Live composite scoring with interactive modulator sliders for educational presentations.
- 🎙️ **Acoustic Spectrogram**: Real-time microphone frequency visualizer and offline audio file evaluation.
- 💡 **AI Advice Engine**: Priority-tiered recommendations (High / Medium / Low) with "Apply" and "Dismiss" states.
- 📈 **Individual Student Analytics**: Personal attendance history and final exam eligibility status.
- 📑 **Report Generation**: Instant CSV download and styled academic PDF transcript export.
- 🧪 **One-Click Demo Seeder**: Ready-to-use sample dataset with 10 diverse students, active session, attendance records, and recommendations.

---

## 📁 Project Folder Structure

```
multimodal-attendance-agent/
│
├── client/                              # React.js Frontend
│   ├── public/                          # Public static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js           # Axios instance with JWT interceptors
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # User state & authentication provider
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx           # App shell wrapper
│   │   │   ├── Sidebar.jsx              # Navigation menu
│   │   │   └── Navbar.jsx               # Header & demo seeder trigger
│   │   ├── components/
│   │   │   ├── StatCard.jsx             # Metric card
│   │   │   ├── FaceWebcamDetector.jsx   # Continuous presence detector & canvas overlay
│   │   │   ├── AudioVisualizer.jsx      # Web Audio frequency spectrum analyzer
│   │   │   ├── RecommendationCard.jsx   # AI advice component
│   │   │   ├── AttendanceStatusBadge.jsx# Status pills
│   │   │   └── PrivacyDisclaimer.jsx    # Ethical AI advisory banner
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Instructor login
│   │   │   ├── Register.jsx             # Admin/Instructor registration
│   │   │   ├── Dashboard.jsx            # Main dashboard overview
│   │   │   ├── StudentManagement.jsx    # Student roster CRUD
│   │   │   ├── AttendanceMonitoring.jsx # Face detection roll call
│   │   │   ├── EngagementMonitoring.jsx # Attention telemetry & charts
│   │   │   ├── AudioAnalysis.jsx        # Acoustic spectrogram & file analyzer
│   │   │   ├── AIRecommendations.jsx    # Pedagogical recommendations
│   │   │   ├── StudentAnalytics.jsx     # Student-wise analytics
│   │   │   ├── Reports.jsx              # PDF & CSV reporting
│   │   │   └── Settings.jsx             # Parameters & threshold tuning
│   │   ├── services/                    # Reusable API service helpers
│   │   ├── hooks/                       # Custom hooks
│   │   ├── App.jsx                      # App route definitions
│   │   └── main.jsx                     # Vite mount point
│   ├── tailwind.config.js               # Tailwind custom color scheme
│   └── package.json
│
├── server/                              # Node.js Express Backend
│   ├── config/
│   │   └── db.js                        # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js            # Login, register, JWT
│   │   ├── studentController.js         # Student CRUD & descriptors
│   │   ├── attendanceController.js      # Continuous presence & duplicate checks
│   │   ├── sessionController.js         # Active classroom sessions
│   │   ├── engagementController.js      # Telemetry & composite score calculation
│   │   ├── recommendationController.js  # Advice cards & status
│   │   ├── audioController.js           # Live audio ingestion & file upload
│   │   └── reportController.js          # Dashboard summary, CSV & seeder
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT protection & role gates
│   │   └── uploadMiddleware.js          # Multer storage configuration
│   ├── models/
│   │   ├── User.js                      # Admin/Teacher credentials
│   │   ├── Student.js                   # Enrolled student profiles
│   │   ├── Attendance.js                # Attendance logs with sustained presence
│   │   ├── ClassroomSession.js          # Active course session metadata
│   │   ├── Engagement.js                # Multimodal telemetry time-series
│   │   └── Recommendation.js            # Pedagogical intervention rules
│   ├── routes/                          # Express REST endpoints
│   ├── services/
│   │   ├── recommendationEngine.js      # Rule-based inference engine
│   │   ├── audioAnalysisService.js      # Spectral volume & VAD heuristics
│   │   └── demoDataSeeder.js            # 10 realistic sample students seeder
│   ├── app.js                           # Express application setup
│   ├── server.js                        # Server entry point
│   ├── .env.example                     # Environment template
│   └── package.json
│
├── .gitignore
├── package.json                         # Root package with concurrently runner
└── README.md
```

---

## ⚙️ Installation & Running the Project

### Prerequisites
Make sure you have installed on your computer:
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed locally, OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud database.

---

### Step 1: Install Dependencies

Open a terminal in the root folder of the project (`multimodal-attendance-agent`) and run:

```bash
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd server
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

*(Alternatively, run `npm run install:all` from the root folder!)*

---

### Step 2: Configure Environment Variables

The server includes a pre-configured `.env` file with default local settings. You can review or edit `server/.env`:

```env
PORT=5000
NODE_ENV=development

# For Local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/multimodal_attendance

# For MongoDB Atlas (Free Cloud Database):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/multimodal_attendance?retryWrites=true&w=majority

JWT_SECRET=multimodal_attendance_super_secret_jwt_key_college_2026
JWT_EXPIRE=30d
```

---

### Step 3: Run the Application

You can launch both the frontend and backend simultaneously using one single command from the root folder:

```bash
npm run dev
```

This starts:
- 🚀 **Backend Server**: `http://localhost:5000`
- 💻 **Frontend Application**: `http://localhost:5173`

*(Alternatively, you can run `npm run dev` inside `server/` in one terminal window, and `npm run dev` inside `client/` in a second terminal window).*

---

### Step 4: Seed Initial Demo Data

To populate the database with **10 realistic college students**, attendance logs, active session, and recommendations, simply run:

```bash
npm run seed
```

*Or click the **"Seed Demo Data"** button directly inside the application header navigation bar!*

---

## 🔑 Default Login Credentials

You can log in directly using the quick demo buttons on the login screen or enter:

| Role | Email | Password |
|---|---|---|
| **Instructor / Teacher** | `teacher@college.edu` | `Teacher@123` |
| **System Administrator** | `admin@college.edu` | `Admin@123` |

---

## 👥 Sample Pre-Seeded Students (10 Demo Students)

| Student ID | Full Name | Roll No | Department | Year / Section | Status |
|---|---|---|---|---|---|
| `CS2026-001` | Aarav Sharma | 01 | Computer Science & Eng. | Year 3 • Sec A | Active (Present) |
| `CS2026-002` | Priya Patel | 02 | Computer Science & Eng. | Year 3 • Sec A | Active (Present) |
| `CS2026-003` | Rohan Gupta | 03 | Computer Science & Eng. | Year 3 • Sec A | Active (Present) |
| `CS2026-004` | Ananya Iyer | 04 | Computer Science & Eng. | Year 3 • Sec A | Active (Present) |
| `CS2026-005` | Vikram Singh | 05 | Computer Science & Eng. | Year 3 • Sec A | Active (Present) |
| `CS2026-006` | Sneha Reddy | 06 | Computer Science & Eng. | Year 3 • Sec A | Active (Present) |
| `CS2026-007` | Rahul Verma | 07 | Computer Science & Eng. | Year 3 • Sec A | Active (Present) |
| `CS2026-008` | Meera Nair | 08 | Computer Science & Eng. | Year 3 • Sec A | Active (Present) |
| `CS2026-009` | Aditya Joshi | 09 | Computer Science & Eng. | Year 3 • Sec A | Active (Absent) |
| `CS2026-010` | Tanvi Kapoor | 10 | Computer Science & Eng. | Year 3 • Sec A | Active (Absent) |

---

## 🔒 Privacy & Ethical Guidelines

> [!IMPORTANT]
> **Data Privacy by Design:**
> 1. Video feeds are analyzed locally in the client browser using HTML5 Canvas. Raw video streams are **never transmitted** or stored on the server.
> 2. Web Audio analysis estimates decibel energy and spectral envelope only. Raw spoken conversations are **never transcribed or recorded**.
> 3. Behavioral signals (head drift, posture shifts) serve solely as operational proxies for instructional pacing and **do not claim to definitively quantify cognitive comprehension or intelligence**.

---

## 🚢 Production Deployment Guide

### 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Database Access** and add a user with read/write privileges.
3. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
4. Copy your connection URI (`mongodb+srv://...`) and paste it as `MONGODB_URI` in your backend environment variables.

### 2. Backend Deployment (Render / Railway)
1. Push your repository to GitHub (`pragativerma27/multimodal-attendance-agent`).
2. Log in to [Render](https://render.com/) and create a new **Web Service**.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Your Secure Random String>`

### 3. Frontend Deployment (Vercel)
1. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your repository `multimodal-attendance-agent`.
3. Set **Root Directory** to `client`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`
5. Click **Deploy**!

---

## 🐙 GitHub Upload Instructions

If you haven't uploaded this repository to your GitHub account yet, follow these simple terminal commands:

1. Open PowerShell / Command Prompt in this folder:
```bash
git init
git add .
git commit -m "feat: initial commit of Multimodal Attendance & Engagement Agent"
git branch -M main
git remote add origin https://github.com/pragativerma27/multimodal-attendance-agent.git
git push -u origin main
```

*(If you haven't installed Git on your machine, download it from [git-scm.com](https://git-scm.com/) and sign in with your GitHub username: `pragativerma27`).*

---

## 📄 License & Academic Attribution
Developed as an advanced academic project by **Pragati Verma** (`pragativerma27`).  
Licensed under the [MIT License](LICENSE).
