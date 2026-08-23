# Drishti DRAA

Drishti (DRAA) is a MERN stack decision-support prototype for disaster response assurance and analytics. It demonstrates scenario selection, resource status updates, capability assessment, and what-if simulation for a district-level emergency response dashboard.

Project theme from the SIH brief: "Scenario-driven Assessment Of Operational Readiness And Deployable Disaster Response Capability."

## Features
- JWT-based login for District Officer/Admin
- Scenario selection for district, disaster type, and severity
- Resource updates for boats, ambulances, responders, routes, shelters, and communication assets
- Effective capability calculation and priority action ranking
- What-if simulation to model impact of priority actions
- Dashboard with summary cards and Recharts visualization
- Intelligence Hub combining real disaster data with operational readiness analytics and hotspot recommendations

## Tech Stack
- Frontend: React + Vite + Bootstrap 5 + Recharts
- Backend: Node.js + Express.js + JWT + MongoDB-ready Mongoose models
- Database: MongoDB Atlas connection string supported via `.env`

## Run locally

Backend:
```bash
cd drishti-draa/backend
npm install
npm run dev
```

Frontend:
```bash
cd drishti-draa/frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open the frontend at http://localhost:5173 and sign in with:
- Email: officer@drishti.gov.in
- Password: officer123

## Environment variables
Create a `.env` file in the backend from `.env.example` and add your MongoDB Atlas URI if you want to use a real database.

## Demo note
This prototype intentionally uses simulated operational data based on public disaster-management references and is designed to complement existing national systems such as NDEM, IDRN, SACHET, and SEOC.
