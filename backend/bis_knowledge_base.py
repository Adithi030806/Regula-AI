"""Regula-AI's preliminary BIS reference data.

This file contains reference information only. It does not establish that a
specific product must be BIS-certified; check current official notifications.
"""

BIS_KNOWLEDGE_BASE = {
    "electric_kettle": {
    "product_category": "Electric kettles and jugs for household and similar use",
        "product_specific_standard": {
            "standard_number": "IS 367:1993",
            "title": "Electric Kettles and Jugs for Household and Similar Use",
            "source_url": "https://www.bis.gov.in/wp-content/uploads/2022/03/Bilingual-PM-367-compressed-1.pdf",
            "source_note": "Official BIS product manual for IS 367:1993. Verify the current standard, amendments, and applicability to the specific product.",
        },
        "general_electrical_safety_standard": {
            "standard_number": "IS 302 (Part 1):2024",
            "title": "Safety of Household and Similar Electrical Appliances — General Requirements",
            "applicability_status": "REQUIRES_VERIFICATION",
            "source_url": "https://www.bis.gov.in/",
        },
        "qco_reference": {
            "order_name": "Safety of Household, Commercial and Similar Electrical Appliances (Quality Control) Order, 2026",
            "source_url": "https://www.bis.gov.in/wp-content/uploads/2026/04/Safety-of-Household-Commercial-and-Similar-Electrical-Appliances-Quality-Control-Order-2026.pdf",
            "source_note": "Official BIS-hosted Quality Control Order dated 6 April 2026 (S.O. 1739(E)). Check subsequent amendments, transition orders, product scope, exemptions, and applicable implementation dates before making a compliance decision.",
            "applicability_status": "REQUIRES_VERIFICATION",
            "implementation_dates": {
                "other_enterprises": "2026-10-01",
                "small_enterprises": "2027-01-01",
                "micro_enterprises": "2027-04-01",
            },
            "notes": [
                "The QCO text, current status, and exact product scope must be checked against the official notification.",
                "Verify any exemptions and the manufacturer's enterprise classification before applying a deadline.",
                "Do not conclude that certification is mandatory for a particular product based only on the standard title or QCO reference.",
            ],
        },
        "evidence_status": {
            "standard_identification": "REFERENCE_AVAILABLE",
            "product_applicability": "REQUIRES_VERIFICATION",
            "legal_requirement": "REQUIRES_VERIFICATION",
            "source_verification": "NOT_INDEPENDENTLY_CHECKED",
        },
        "product_scope": [
            "Electric kettles and jugs intended for household and similar use",
            "Exact scope for a particular model or design requires verification",
        ],
        "compliance_status": "NOT_YET_VERIFIED",
        "information_needed": [
            "Exact product model and intended use",
            "Rated voltage, wattage, capacity, materials, and heating-element design",
            "Manufacturer enterprise category (micro, small, or other)",
            "Confirmation of product scope, exemptions, and current legal requirements from official BIS/QCO sources",
        ],
        "verification_notes": [
            "This is preliminary reference data, not legal advice or BIS approval.",
            "Verify the latest standard, product manual, QCO text, applicability, and deadlines through official sources before making commercial decisions.",
        ],
    }
}

