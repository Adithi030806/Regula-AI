# Regula-AI Installation Guide

## Prerequisites
- Git
- Node.js and npm
- Python 3.10+ (use the version supported by the project's dependencies)
- A Gemini API key for AI-powered features

## 1. Download the project
```powershell
git clone https://github.com/Adithi030806/Regula-AI.git
cd Regula-AI
```

## 2. Set up the backend
From the repository root:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install fastapi "uvicorn[standard]" python-dotenv google-genai pydantic
```
If the project contains a `requirements.txt`, prefer:
```powershell
pip install -r requirements.txt
```

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
Replace the placeholder with your own key. Do not commit `.env` to GitHub.

Start the backend:
```powershell
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```
Check `http://127.0.0.1:8000/api/health` and open `http://127.0.0.1:8000/docs`.

## 3. Set up the frontend
Open a second terminal in the project root:
```powershell
npm install
npm run dev
```
Open the local URL printed by Vite, commonly `http://localhost:5173`.

## 4. Configure frontend/backend connectivity
The frontend must send API requests to the backend address that is actually running. If both run on the same computer, use `http://127.0.0.1:8000`. If the backend runs on another computer on the same trusted network, use that computer's LAN IP and allow the frontend origin in FastAPI CORS configuration. Do not expose a development server publicly without suitable security controls.

## Troubleshooting
- **Gemini key missing:** verify `.env` exists in the repository root and contains `GEMINI_API_KEY=...`.
- **Module not found:** activate the virtual environment and install project dependencies.
- **Frontend cannot connect:** verify the backend health URL, API base URL, and CORS origins.
- **Port already in use:** use the actual port printed by Vite or stop the conflicting process.
- **PowerShell blocks npm scripts:** try `npm.cmd run dev`.

## Important
Regula-AI produces preliminary research and estimates. Verify applicable standards, QCOs, dates, and certification requirements with official BIS/government sources or a qualified compliance professional.
