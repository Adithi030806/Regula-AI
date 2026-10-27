import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from backend.bis_knowledge_base import BIS_KNOWLEDGE_BASE
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types


# Load environment variables from the project's .env file
load_dotenv()

app = FastAPI(
    title="Regula-AI",
    description="AI assistant for BIS certification and business intelligence",
    version="0.2.0",
)

# Allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request format for product analysis
class ProductAnalysisRequest(BaseModel):
    product_name: str = Field(min_length=2, max_length=150)
    description: str = Field(min_length=5, max_length=2000)
    target_market: str = Field(default="India", max_length=100)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Regula-AI backend is running!"
    }


# Health-check endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "project": "Regula-AI",
        "message": "Backend is ready",
    }


# AI product analysis endpoint
@app.post("/api/analyze-product")
def analyze_product(request: ProductAnalysisRequest):

    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is not configured.",
        )
        # Retrieve relevant product information from the BIS knowledge base
    product_name_lower = request.product_name.lower()
    evidence_status = {
    "standard_identification": "NO_PRODUCT_REFERENCE",
    "product_applicability": "REQUIRES_VERIFICATION",
    "legal_requirement": "REQUIRES_VERIFICATION",
    "source_verification": "NOT_INDEPENDENTLY_CHECKED",
}
    if "kettle" in product_name_lower or "jug" in product_name_lower:
        product_reference = BIS_KNOWLEDGE_BASE["electric_kettle"]
        qco_reference = product_reference["qco_reference"]
        evidence_status = product_reference["evidence_status"]
        knowledge_base_context = f"""
Reference information available in Regula-AI (not independently verified):

Product category:
{product_reference['product_category']}

Product-specific standard:
{product_reference['product_specific_standard']['standard_number']}
- {product_reference['product_specific_standard']['title']}

General electrical safety standard:
{product_reference['general_electrical_safety_standard']['standard_number']}
- Applicability requires verification.

Quality Control Order (QCO) reference:
{qco_reference['order_name']}

Official source:
{qco_reference['source_url']}

QCO applicability status:
{qco_reference['applicability_status']}

Implementation dates listed in the reference:
- Other enterprises: {qco_reference['implementation_dates']['other_enterprises']}
- Small enterprises: {qco_reference['implementation_dates']['small_enterprises']}
- Micro enterprises: {qco_reference['implementation_dates']['micro_enterprises']}

QCO verification notes:
{chr(10).join('- ' + note for note in qco_reference['notes'])}

Product scope:
{', '.join(product_reference['product_scope'])}

Compliance status:
{product_reference['compliance_status']}
Evidence verification status:
- Standard identification: {evidence_status['standard_identification']}
- Product applicability: {evidence_status['product_applicability']}
- Legal requirement: {evidence_status['legal_requirement']}
- Source verification: {evidence_status['source_verification']}
Important:
The legal requirement for certification has not yet been verified.
Do not claim certification is mandatory based on this information alone.
"""
    else:
        knowledge_base_context = (
            "No product-specific entry was found in the current "
            "Regula-AI knowledge base. Do not invent standards "
            "or claim that certification is mandatory. Explain "
            "what information must be verified through official sources."
        )
    prompt = f"""
    MARKET INTELLIGENCE REQUIREMENTS:

In addition to the detailed compliance report above, provide
structured business intelligence for the requested product.

1. MARKET DEMAND:
Explain potential market demand in the specified target market.
Discuss relevant customer needs, demand drivers, competitors,
and market trends where appropriate.
Do not invent market sizes, sales figures, growth rates, or
statistics. Clearly label assumptions and unverified claims.

2. BUSINESS IMPACT:
Explain how potential certification requirements could affect
manufacturing costs, testing expenses, launch timelines,
market access, customer trust, and business risks.
Distinguish confirmed requirements from hypothetical scenarios.

3. GROWTH OPPORTUNITIES:
Identify potential customer segments, sales channels,
product differentiation opportunities, and possible expansion
strategies relevant to the product.
Clearly label business assumptions and recommendations.

4. RECOMMENDED ACTIONS:
Provide a concise, ordered list of practical next steps.
Prioritize compliance verification, technical preparation,
market research, and business planning as appropriate.

Keep compliance guidance separate from commercial assumptions.
Do not imply that market demand, legal requirements, or
business outcomes have been independently verified unless
supporting evidence is actually available.

You are Regula-AI, a preliminary product compliance and
business research assistant for the Indian market.

Analyze this product:

Product name: {request.product_name}
Product description: {request.description}
Target market: {request.target_market}
{knowledge_base_context}
Provide the following sections:

1. PRODUCT OVERVIEW
Explain the product category and its likely applications.

2. POTENTIAL BIS REQUIREMENTS
Explain whether BIS certification might apply.
Do not invent Indian Standard numbers or legal requirements.
Clearly distinguish verified information from possibilities.
If applicability cannot be established, state that clearly.

3. INFORMATION STILL REQUIRED
List the details needed to assess compliance more reliably.

4. SUGGESTED NEXT STEPS
Explain how the manufacturer can verify requirements through
official BIS sources and relevant government notifications.

5. MARKET DEMAND
Discuss factors that may influence demand for this product.
Do not invent market statistics or claim to have verified
market demand without supporting evidence.

6. BUSINESS IMPACT
Discuss potential implications for market access, costs,
customer trust, and business planning.

7. GROWTH OPPORTUNITIES
Suggest possible customer segments, sales channels, and
business opportunities, clearly identifying assumptions.

8. RECOMMENDED ACTION PLAN
Give practical next steps in a logical order.

IMPORTANT SAFEGUARDS:
- This is preliminary AI-generated guidance, not official
  legal advice or BIS approval.
- Never claim certification is mandatory unless the
  applicable requirement has been reliably established.
- Do not invent sources, statistics, or citations.
- Clearly explain uncertainty and recommend official
  verification before business decisions.
- Use the supplied Regula-AI knowledge-base information
  when it matches the product being analyzed.
- Identify the official source supporting each compliance
  claim whenever a source is provided.
- Clearly label requirements as VERIFIED, UNVERIFIED,
  or NOT APPLICABLE only when the evidence supports that status.
- Never treat the existence of an Indian Standard or a BIS
  product manual alone as proof that certification is mandatory.
- Distinguish between three verification levels:
  1. STANDARD IDENTIFIED: An official source confirms that
     the Indian Standard exists.
  2. PRODUCT APPLICABILITY VERIFIED: Reliable evidence
     confirms that the standard applies to this specific
     product and its intended use.
  3. LEGAL REQUIREMENT VERIFIED: An applicable official
     legal order or notification confirms the requirement,
     including its effective date and relevant exceptions.

- Never treat STANDARD IDENTIFIED as proof that the
  standard applies to the product.

- Never treat PRODUCT APPLICABILITY VERIFIED as proof
  that certification is legally mandatory.

- Mark a verification level as VERIFIED only when the
  supplied evidence supports that exact level. Otherwise,
  clearly mark it as UNVERIFIED.

- If the available knowledge base does not contain enough
  evidence, explain what official information is still
  needed instead of guessing.
VERIFICATION CONSISTENCY RULES:

- A standard listed in the knowledge base must not automatically
  be described as independently verified.

- If standard_identification is REFERENCE_AVAILABLE,
  describe the standard as an identified reference, not as
  independently verified.

- If source_verification is NOT_INDEPENDENTLY_CHECKED,
  clearly state that the source has not been independently checked.

- Ensure every compliance claim agrees with the verification
  statuses provided to you.

- Never present a preliminary AI assessment as official BIS
  confirmation or legal advice.
"""

    try:
        client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(timeout=30000),
        )

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
        )

        if not response.text:
            raise HTTPException(
                status_code=502,
                detail="The AI returned an empty response.",
            )
        market_intelligence = {
            "market_demand": None,
            "business_impact": None,
            "growth_opportunities": None,
            "recommended_actions": [],
        }

        market_prompt = f"""
        Analyze the following product for the target market and provide
        practical, evidence-conscious business intelligence.

        Product: {request.product_name}
        Description: {request.description}
        Target market: {request.target_market}

        Return ONLY a valid JSON object with these four keys:

        1. market_demand:
           Explain likely customer needs, target customer segments, competitors,
           relevant market trends, and factors that may influence demand.

           Separate general market observations from product-specific evidence.

           Explain who is most likely to buy this product and why.

           If reliable market data is unavailable, explicitly state that demand,
           market size, and growth rates have not been quantitatively verified.

        2. business_impact:
           Explain how compliance and certification may affect the business.

        Consider:
        - Potential compliance and testing costs
        - Documentation and preparation requirements
        - Product launch timelines
        - Market access and regulatory risks
        - Customer trust and product credibility
        - Possible effects on manufacturing and distribution
        - Potential consequences of delayed compliance

        Clearly distinguish confirmed information from conditional
        scenarios and estimates.

        Do not invent official certification fees or guarantee business results.

        3. growth_opportunities:
           Identify potential opportunities to increase product sales
           and support company growth.

           Consider:
           - New customer segments
           - Retail and online sales channels
           - Business-to-business opportunities
           - Product differentiation
           - Geographic expansion
           - Customer trust and brand positioning
           - Potential partnerships and distribution opportunities
           - Opportunities to compete with existing products

           Explain why each opportunity may be relevant to the product.

           Label opportunities as hypotheses when supporting market evidence
           is unavailable.

        4. recommended_actions:
           Return an ordered JSON array of practical next steps.

           Prioritize the most relevant actions, including:
           - Verifying applicable BIS standards and legal requirements
           - Identifying the intended customer segments
           - Researching competitors
           - Collecting reliable market and pricing data
           - Estimating compliance and testing expenses
           - Evaluating pricing and profit margins
           - Selecting suitable sales channels
           - Planning product positioning and market entry

           Every recommendation should explain what action to take
           and why that action matters.

        Rules:
        - Do not invent market statistics, market sizes, growth rates,
          competitor prices, sales figures, or research citations.
        - Do not present generated assumptions as verified market facts.
        - Do not claim to have browsed the internet or consulted a source
          unless that source was actually accessed.
        - Do not claim that a legal requirement or certification status
          has been verified without supporting official evidence.
        - Treat financial figures as estimates unless supported by reliable
          evidence or explicitly supplied by the user.
        - Keep recommendations specific to the supplied product and target market.
        - If information is missing, state the limitation instead of guessing.
        - Return valid JSON only, without Markdown formatting.
        """

        try:
            market_response = client.models.generate_content(
                model="gemini-3.5-flash-lite",
                contents=market_prompt,
                config={"response_mime_type": "application/json"},
            )

            if market_response.text:
                parsed_market_data = json.loads(market_response.text)

                market_intelligence["market_demand"] = (
                    parsed_market_data.get("market_demand")
                )
                market_intelligence["business_impact"] = (
                    parsed_market_data.get("business_impact")
                )
                market_intelligence["growth_opportunities"] = (
                    parsed_market_data.get("growth_opportunities")
                )
                market_intelligence["recommended_actions"] = (
                    parsed_market_data.get("recommended_actions", [])
                )

        except Exception as exc:
            print(
                f"Market intelligence generation failed: "
                f"{type(exc).__name__}: {exc}"
            )    
        return {
            "product_name": request.product_name,
            "target_market": request.target_market,
            "analysis": response.text,
            "market_intelligence": market_intelligence,
            "verification": {
                "standard_identification": evidence_status["standard_identification"],
                "product_applicability": evidence_status["product_applicability"],
                "legal_requirement": evidence_status["legal_requirement"],
                "source_verification": evidence_status["source_verification"],
            },
            "disclaimer": (
                "This is preliminary AI-generated guidance. "
                "Verify compliance requirements through official "
                "sources before making decisions."
            ),
        }
            
        
    except HTTPException:
        raise

    except Exception as exc:
        print(
            f"Product analysis failed: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "AI analysis failed. Check the backend terminal "
                "for the error details."
            ),
        ) from exc

# -------------------------------------------------------------------
# Review-ready features: compliance checklist and financial scenarios
# -------------------------------------------------------------------

class ComplianceChecklistRequest(BaseModel):
    product_name: str = Field(min_length=2, max_length=150)
    description: str = Field(min_length=5, max_length=2000)
    target_market: str = Field(default="India", max_length=100)


class FinancialScenarioRequest(BaseModel):
    product_name: str = Field(min_length=2, max_length=150)
    selling_price_per_unit: float = Field(gt=0)
    manufacturing_cost_per_unit: float = Field(ge=0)
    expected_monthly_units: int = Field(gt=0)
    monthly_fixed_costs: float = Field(ge=0, description="User-estimated monthly fixed costs")
    one_time_compliance_cost: float = Field(default=0, ge=0, description="Optional user-estimated one-time cost; not a verified BIS fee")


@app.post("/api/compliance-checklist")
def generate_compliance_checklist(request: ComplianceChecklistRequest):
    """Return a practical preliminary checklist without claiming legal approval."""
    name = request.product_name.lower()
    is_kettle = "kettle" in name or "jug" in name

    if is_kettle:
        reference = BIS_KNOWLEDGE_BASE["electric_kettle"]
        standard = reference["product_specific_standard"]["standard_number"]
        source_url = reference["product_specific_standard"]["source_url"]
        evidence = reference["evidence_status"]
        product_specific_tasks = [
            {
                "task": f"Review the reference for {standard}",
                "status": evidence["standard_identification"],
                "next_action": "Check the current official standard details and confirm its relevance to the exact product model.",
                "source": source_url,
            },
            {
                "task": "Confirm product applicability",
                "status": evidence["product_applicability"],
                "next_action": "Compare intended use and technical specifications with the official standard scope.",
                "source": source_url,
            },
            {
                "task": "Confirm whether a mandatory QCO applies",
                "status": evidence["legal_requirement"],
                "next_action": "Check the full current QCO, amendments, exemptions, effective date and enterprise category through official sources.",
                "source": reference["qco_reference"]["source_url"],
            },
        ]
        information_needed = reference["information_needed"]
    else:
        evidence = {
            "standard_identification": "NO_PRODUCT_REFERENCE",
            "product_applicability": "REQUIRES_VERIFICATION",
            "legal_requirement": "REQUIRES_VERIFICATION",
            "source_verification": "NOT_INDEPENDENTLY_CHECKED",
        }
        product_specific_tasks = [{
            "task": "Identify the applicable product standard and regulatory order",
            "status": "NO_PRODUCT_REFERENCE",
            "next_action": "Search official BIS and government notification sources; do not assume a standard or mandatory certification applies.",
            "source": None,
        }]
        information_needed = [
            "Exact product type and intended use",
            "Technical specifications and model details",
            "Rated voltage, power and capacity where relevant",
            "Manufacturer and manufacturing location",
            "Manufacturer enterprise classification where relevant to a QCO",
        ]

    common_tasks = [
        {
            "task": "Collect product technical information",
            "status": "INFORMATION_REQUIRED",
            "next_action": "Provide: " + "; ".join(information_needed),
            "source": None,
        },
        {
            "task": "Check current official requirements",
            "status": "REQUIRES_VERIFICATION",
            "next_action": "Verify applicable standards, QCO scope, amendments, exemptions and dates using official sources or a qualified compliance professional.",
            "source": "https://www.bis.gov.in/",
        },
        {
            "task": "Prepare supporting documentation",
            "status": "PENDING_USER_INPUT",
            "next_action": "Collect the product datasheet, labels, drawings, available test reports and manufacturer details as relevant.",
            "source": None,
        },
    ]

    return {
        "product_name": request.product_name,
        "target_market": request.target_market,
        "checklist": product_specific_tasks + common_tasks,
        "information_needed": information_needed,
        "verification": evidence,
        "disclaimer": "Preliminary checklist only. It does not establish legal applicability, grant certification or replace official verification.",
    }


@app.post("/api/financial-scenario")
def calculate_financial_scenario(request: FinancialScenarioRequest):
    """Calculate transparent scenario estimates from user-supplied assumptions."""
    import math

    price = request.selling_price_per_unit
    unit_cost = request.manufacturing_cost_per_unit
    units = request.expected_monthly_units
    fixed_costs = request.monthly_fixed_costs
    one_time_cost = request.one_time_compliance_cost

    contribution_per_unit = price - unit_cost
    revenue = price * units
    variable_costs = unit_cost * units
    monthly_operating_profit_before_one_time_cost = revenue - variable_costs - fixed_costs
    first_month_profit_after_one_time_cost = monthly_operating_profit_before_one_time_cost - one_time_cost

    if contribution_per_unit > 0:
        monthly_break_even_units = math.ceil(fixed_costs / contribution_per_unit)
        first_month_break_even_units = math.ceil((fixed_costs + one_time_cost) / contribution_per_unit)
    else:
        monthly_break_even_units = None
        first_month_break_even_units = None

    return {
        "product_name": request.product_name,
        "currency": "INR",
        "input_assumptions": {
            "selling_price_per_unit": price,
            "manufacturing_cost_per_unit": unit_cost,
            "expected_monthly_units": units,
            "monthly_fixed_costs": fixed_costs,
            "one_time_compliance_cost": one_time_cost,
        },
        "results": {
            "estimated_monthly_revenue": round(revenue, 2),
            "estimated_monthly_variable_costs": round(variable_costs, 2),
            "contribution_per_unit": round(contribution_per_unit, 2),
            "estimated_monthly_operating_profit_before_one_time_cost": round(monthly_operating_profit_before_one_time_cost, 2),
            "estimated_first_month_profit_after_one_time_cost": round(first_month_profit_after_one_time_cost, 2),
            "estimated_monthly_break_even_units": monthly_break_even_units,
            "estimated_first_month_break_even_units_including_one_time_cost": first_month_break_even_units,
        },
        "interpretation": (
            "The selling price must exceed manufacturing cost per unit to produce a positive contribution margin."
            if contribution_per_unit > 0 else
            "At the supplied inputs, selling price does not exceed manufacturing cost per unit; break-even cannot be reached without changing the assumptions."
        ),
        "disclaimer": "All outputs are estimates based only on user-provided assumptions. The one-time compliance cost is not an official BIS fee, and this calculation does not establish whether certification is legally required.",
    }

