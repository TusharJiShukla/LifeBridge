# LifeBridge: Organ Donation & Recipient Matching Platform (MERN Stack)

A beginner-friendly, transparent, full-stack MERN application for matching organ donors with recipient patients based on biological ABO blood group compatibility, proximity, urgency, and medical criteria.

---

## 📌 Features

1. **Role-Based Workflows**:
   - **Donors**: Register organ pledges (Kidney, Liver, Heart, Cornea, Lungs, Pancreas) with blood group, age, city, and medical history.
   - **Recipients**: Register organ requirements with urgency level (Normal, High, Critical) and hospital details.
2. **Biological Compatibility Engine**:
   - Strict red blood cell / organ compatibility table (e.g., O- universal donor, AB+ universal recipient).
   - Weighted scoring matrix (0 to 100%) factoring in exact blood match (+50), same city (+30), and patient urgency (+15).
3. **Interactive Live Match Directory**:
   - Search and filter matches dynamically without page reloads.
   - Transparent breakdown badges showing why a score was awarded.
4. **Lightweight Authentication (Option B)**:
   - Simple Email + Password/PIN verification.
   - Session management via React Context & LocalStorage (no complex JWT expiration handling).
   - 1-Click "Demo Donor" and "Demo Patient" buttons for viva presentations.
5. **Personalized Dashboards**:
   - Automatically computes and ranks all live matches for the logged-in user in real-time.
   - Allows users to toggle their status (`Available` / `Pledged` / `Completed` for donors, `Waiting` / `Matched` / `Closed` for recipients).

---

## 🗂️ Project Structure

```
Abhay/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── models/
│   │   ├── Donor.js              # Donor schema + bcrypt hashing
│   │   └── Recipient.js          # Recipient schema + bcrypt hashing
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/register & /api/auth/login
│   │   ├── donorRoutes.js        # /api/donors CRUD & status update
│   │   ├── recipientRoutes.js    # /api/recipients CRUD & status update
│   │   └── matchRoutes.js        # Dynamic matching endpoints & metrics
│   ├── utils/
│   │   └── matchingAlgorithm.js  # Compatibility matrix & weighted scorer
│   ├── .env                      # Database URI & Port configuration
│   ├── package.json
│   ├── seed.js                   # 1-command sample data generator
│   └── server.js                 # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar with role badge
    │   │   └── Footer.jsx        # Footer & academic disclaimer
    │   ├── context/
    │   │   └── AuthContext.jsx   # Client-side session state
    │   ├── pages/
    │   │   ├── Home.jsx          # Hero section + quick match finder
    │   │   ├── Login.jsx         # Role toggle login + demo quick-fill
    │   │   ├── DonorRegister.jsx # Donor pledge registration form
    │   │   ├── RecipientRegister.jsx # Recipient requirement form
    │   │   ├── Matches.jsx       # Public & filtered match directory
    │   │   └── Dashboard.jsx     # Live personalized match dashboard
    │   ├── services/
    │   │   └── api.js            # Centralized API client
    │   ├── App.jsx               # React Router configuration
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 How to Run the Application

### 1. Backend Setup
1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Configure your MongoDB connection in `backend/.env`:
   - If using **local MongoDB**:
     ```env
     PORT=5000
     MONGO_URI=mongodb://127.0.0.1:27017/organ_donation
     ```
   - If using **MongoDB Atlas**:
     ```env
     PORT=5000
     MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/organ_donation?retryWrites=true&w=majority
     ```
3. Populate sample test data (Donors & Patients):
   ```bash
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000.*

---

### 2. Frontend Setup
1. Open a second terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Start the Vite React development server:
   ```bash
   npm run dev
   ```
3. Open your browser at **http://localhost:5173**.

---

## 🧬 Biological Compatibility & Scoring Formula

1. **Organ Match (Strict Requirement)**:
   - Donor organ type must strictly match recipient organ needed.
2. **Blood Group Compatibility Matrix (Strict Requirement)**:
   - `O-`: Can donate to all (Universal Donor).
   - `AB+`: Can receive from all (Universal Recipient).
   - Other pairs follow standard ABO/Rh compatibility rules.
3. **Scoring Factors (0 to 100%)**:
   - **Exact Blood Match**: +50 pts (or +40 pts for compatible ABO cross-match)
   - **Proximity**: Same city (+30 pts) or Same state (+15 pts) to minimize ischemia transit time.
   - **Urgency Factor**: Critical urgency (+15 pts), High urgency (+10 pts).
   - **Donor Health Record**: Clear medical history (+5 pts).

> **Disclaimer**: This application is strictly an educational project demonstrating data structure matching and web architecture. In real medical practice, organ allocation is regulated under statutory transplant authorities with extensive HLA tissue typing and laboratory cross-matching.
