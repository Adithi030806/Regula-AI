Regula-AI

AI-assisted BIS compliance guidance and business decision support for
Indian businesses and MSMEs.

Regula-AI brings preliminary product-compliance research together with
market intelligence, financial scenario planning, and growth
recommendations. It is designed to help a business understand what to
investigate before launching or expanding a product in India.

Important: Regula-AI provides preliminary AI-generated guidance,
not legal advice, certification, or an official BIS decision. Always
confirm applicable standards, Quality Control Orders (QCOs), dates,
and certification requirements with official BIS/government sources or
a qualified compliance professional. Market outputs may include
estimates or assumptions and should be validated with reliable data.

Key Features

1. BIS Compliance Guidance

Helps users begin identifying potentially relevant Indian Standards
and compliance questions.

Provides a preliminary checklist of items to investigate.

Highlights where product applicability or legal requirements need
official verification.

2. Market Intelligence

Organizes questions about customer demand, target segments, sales
channels, and potential competitors.

Suggests market opportunities to investigate.

Should be validated against current, reliable market data.

3. Financial Scenario Planner

Users can enter business assumptions such as: - Selling price per unit -
Manufacturing cost per unit - Expected monthly sales volume - Monthly
fixed costs - One-time compliance cost

The API calculates estimates such as monthly revenue, operating profit,
and break-even units based on the supplied assumptions. Results are
planning estimates, not guaranteed outcomes.

4. Growth Recommendations

Provides prioritized next steps connecting compliance preparation,
market research, and financial planning.

Helps users organize questions to investigate before making business
decisions.

Technology Stack

Frontend: React, Vite, JavaScript, CSS

Backend: Python, FastAPI

AI integration: Gemini API

API documentation: FastAPI / Swagger UI

Project Structure

Regula-AI/
├── backend/
│   ├── main.py
│   └── bis_knowledge_base.py
├── src/
│   ├── App.jsx
│   └── App.css
├── public/
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md

The exact frontend file layout may vary as the project evolves.

Requirements

Install the following before running the project:

Node.js and npm

Python 3.10 or a compatible Python version used by the project

A Gemini API key for AI-powered backend features

Setup and Run

1. Clone the repository

git clone https://github.com/Adithi030806/Regula-AI.git
cd Regula-AI

2. Set up the backend

From the repository root, create and activate a virtual environment.

Windows PowerShell:

python -m venv venv
.\venv\Scripts\Activate.ps1
pip install fastapi "uvicorn[standard]" python-dotenv

Install any additional packages imported by backend/main.py if they
are not included above.

Create a .env file in the repository root:

GEMINI_API_KEY=your_gemini_api_key_here

Replace the placeholder with your own key. Never commit or share your
.env file or API key.

Start the API from the repository root:

python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

Useful backend URLs:

Health check: http://127.0.0.1:8000/api/health

Interactive API documentation: http://127.0.0.1:8000/docs

3. Set up the frontend

Open a second terminal in the repository root and install the frontend
dependencies:

npm install

Start the Vite development server:

npm run dev

Open the local URL printed in the terminal, commonly
http://localhost:5173.

On Windows PowerShell, if npm is blocked by an execution policy, try:

npm.cmd run dev

Backend API Endpoints

Method                  Endpoint                      Purpose

GET                   /                           Basic API/root response

GET                   /api/health                 Health check

POST                  /api/analyze-product        Preliminary product
analysis with
compliance and
market/business
insights

POST                  /api/compliance-checklist   Preliminary compliance
checklist

For exact request fields and response schemas, run the backend and open
http://127.0.0.1:8000/docs.

Connecting the Frontend and Backend

The frontend must send requests to the machine and port where the
FastAPI backend is running. localhost always refers to the computer
currently running the browser, not another team member's computer.

If the frontend and backend run on different computers: 1. Connect both
computers to the same trusted network. 2. Start the backend with
--host 0.0.0.0. 3. Configure the frontend API base URL to use the
backend computer's reachable local IP address and port 8000. 4. Ensure
the backend CORS settings allow the frontend's actual origin and port.
5. Test GET /api/health from the frontend computer before testing
analysis features.

Avoid exposing a development server to public networks. For a deployed
version, configure HTTPS, production CORS origins, secret management,
and suitable hosting.

Security and Responsible Use

Keep API keys in environment variables; never place secrets in
frontend code.

Do not commit .env, virtual environments, node_modules, or build
output.

Treat AI responses as preliminary guidance, not official compliance
determinations.

Verify standards, QCO applicability, implementation dates, and legal
requirements through official sources.

Validate market assumptions with current evidence before making
investment or sales decisions.

Financial outputs depend on the numbers entered by the user and are
not guarantees of profit.

Current Scope and Future Improvements

Potential future improvements include: - Separate, fully connected
workflows for compliance, market intelligence, and financial planning -
Stronger source evidence, verification status, and last-checked dates -
More product categories and industry-specific guidance - More reliable
market and competitor data integrations - Downloadable reports and
checklists - Saved projects and progress tracking

These are roadmap ideas and should not be interpreted as features
already implemented.

Team and Contributions

Regula-AI is a project under active development. Update this section
with the team's names, roles, and contribution guidelines if required
for the hackathon submission.

License

No license has been specified yet. Add a LICENSE file before
presenting this project as open source.
