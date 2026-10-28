# Regula-AI System Architecture

```text
Business Owner / MSME
        |
        v
React + Vite Frontend
(Product input, feature workflows, results UI)
        |
        | HTTP / JSON requests
        v
FastAPI Backend (Python, port 8000)
(Request validation, endpoint routing, response formatting)
        |                         |
        v                         v
Curated BIS Knowledge Base     Gemini API
(Selected references and       (AI-assisted analysis;
 evidence status)               requires API key)
        |
        v
Structured Response
(Preliminary compliance guidance, checklist, market insights,
 financial estimates, and recommended next steps)
```

## Main endpoints
- `GET /`
- `GET /api/health`
- `POST /api/analyze-product`
- `POST /api/compliance-checklist`
- `POST /api/financial-scenario`

The exact request/response schema should be checked in the running FastAPI Swagger UI at `/docs`.

## Boundaries
- Frontend collects input and presents results.
- Backend validates requests and orchestrates analysis.
- Knowledge-base content supplies selected product references.
- Gemini API provides AI-assisted interpretation when configured.
- Financial outputs should be derived from user-supplied assumptions.

## Safety and evidence
Regula-AI does not issue certification. Product applicability, legal requirements, standards, QCOs, and dates must be verified through official sources. Market insights should not be presented as verified data unless backed by documented evidence.
