"""
Seva Setu FastAPI Main Entrypoint
REST API for Customers, Workers, and Ministry of Cooperation.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

import uvicorn
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Union, Any, Dict

from pricing import calculate_transparent_fare, calculate_freelance_fare
from dispatch import (
    create_booking,
    worker_respond_to_job,
    verify_start_otp,
    complete_job_with_proof,
    BOOKINGS_DB,
    find_nearest_workers
)
from seed_data import (
    WORKERS,
    COOPERATIVES,
    DISTRICT_ANALYTICS,
    REVIEWS_DB,
    SUBSCRIPTION_PLANS,
    REGIONAL_DEMAND_DETAILED,
    REVENUE_METRICS,
    FREELANCE_JOBS,
    CUSTOMER_COMPLAINTS_DB,
    DEBARRED_CUSTOMERS,
    WORKER_REJECTIONS_LOG
)
from ai_ocr import verify_worker_documents
from ai_assistant import process_customer_ai_message, SERVICES_CATALOG

app = FastAPI(
    title="Seva Setu API (Ministry of Cooperation)",
    description="Decentralized Cooperative Gig Platform with Fair-Wage Transparency & Priority Triage",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Request / Response Models -----------------
class QuoteRequest(BaseModel):
    service_type: str = Field(..., json_schema_extra={"example": "electrician"})
    plan: str = Field(default="hourly", json_schema_extra={"example": "hourly"}) # hourly, daily, weekly, monthly
    customer_lat: float = Field(default=28.6315, json_schema_extra={"example": 28.6315}) # Connaught Place
    customer_lng: float = Field(default=77.2167, json_schema_extra={"example": 77.2167})
    worker_lat: float = Field(default=28.6328, json_schema_extra={"example": 28.6328})
    worker_lng: float = Field(default=77.2197, json_schema_extra={"example": 77.2197})
    is_emergency: bool = False
    is_ngo: bool = False

class BookingCreateRequest(BaseModel):
    customer_name: str = Field(..., json_schema_extra={"example": "Aarav Mehta"})
    customer_lat: Optional[float] = Field(default=28.6315, json_schema_extra={"example": 28.6315})
    customer_lng: Optional[float] = Field(default=77.2167, json_schema_extra={"example": 77.2167})
    service_type: str = Field(..., json_schema_extra={"example": "electrician"})
    plan: Optional[str] = Field(default="hourly", json_schema_extra={"example": "hourly"})
    is_emergency: Optional[bool] = False
    is_ngo: Optional[bool] = False
    booking_date: Optional[str] = Field(default=None, json_schema_extra={"example": "2026-09-07"})
    booking_time: Optional[str] = Field(default=None, json_schema_extra={"example": "10:30 AM"})
    worker_id: Optional[int] = None
    pricing: Optional[dict] = None

class WorkerResponseRequest(BaseModel):
    worker_id: int
    accept: bool # True to accept, False to reject and trigger fallback!

class StartOtpRequest(BaseModel):
    otp: str

class CompleteJobRequest(BaseModel):
    otp: str
    proof_image: Optional[str] = None

class DocumentVerifyRequest(BaseModel):
    worker_name: str
    skill: str
    doc_type: str # "aadhaar" or "trade_certificate"
    image_data: Optional[str] = None

class ReviewCreateRequest(BaseModel):
    customer_name: Optional[str] = None
    user_name: Optional[str] = None
    worker_id: Optional[int] = Field(default=None, json_schema_extra={"example": 101})
    worker_name: Optional[str] = Field(default=None, json_schema_extra={"example": "Rajesh Kumar"})
    service_type: Optional[str] = None
    service: Optional[str] = None
    rating: int = Field(default=5, ge=1, le=5)
    review_type: Optional[str] = None # positive or complaint
    type: Optional[str] = None
    comment: str = Field(..., json_schema_extra={"example": "Great electrical service!"})

class ReviewStatusUpdateRequest(BaseModel):
    status: Optional[str] = Field(default=None, json_schema_extra={"example": "Resolved"}) # Resolved, Under Investigation, Warning Issued, Compensated
    ministry_action: Optional[str] = Field(default="Ministry Action Recorded", json_schema_extra={"example": "Notice Issued to PACS Federation"})

class SubscriptionRequest(BaseModel):
    plan_id: str = Field(..., json_schema_extra={"example": "monthly_pass"})
    customer_name: Optional[str] = Field(default="Aarav Mehta", json_schema_extra={"example": "Aarav Mehta"})
    payment_method: Optional[str] = Field(default="upi", json_schema_extra={"example": "upi"})
    payment_ref: Optional[str] = Field(default="NPCI-COOP-SUBS-9921", json_schema_extra={"example": "NPCI-COOP-SUBS-9921"})

class WorkerLoginRequest(BaseModel):
    phone: str = Field(..., json_schema_extra={"example": "+91 98765 43210"})
    worker_id: Optional[int] = Field(default=None, json_schema_extra={"example": 101})

class WorkerOnboardRequest(BaseModel):
    worker_id: Optional[int] = None
    name: str = Field(default="Rajesh Kumar", json_schema_extra={"example": "Rajesh Kumar"})
    phone: str = Field(default="+91 98765 43210", json_schema_extra={"example": "+91 98765 43210"})
    skill: str = Field(default="electrician", json_schema_extra={"example": "electrician"})
    coop_name: Optional[str] = Field(default="Delhi Central Labour Cooperative")
    aadhaar: Optional[str] = None
    aadhaar_number: Optional[str] = None
    certificate_title: Optional[str] = None
    certificate_name: Optional[str] = None
    certificate_file: Optional[str] = None
    aadhaar_file: Optional[str] = None

class FreelanceJobCreateRequest(BaseModel):
    title: str = Field(..., json_schema_extra={"example": "Evening Smart Meter & Inverter Checkup"})
    skill: str = Field(..., json_schema_extra={"example": "electrician"})
    customer_name: str = Field(..., json_schema_extra={"example": "Kavita Rao"})
    customer_phone: Optional[str] = Field(default="+91 98222 11223", json_schema_extra={"example": "+91 98222 11223"})
    address: Optional[str] = Field(default="B-42, Defence Colony, South Delhi", json_schema_extra={"example": "B-42, Defence Colony, South Delhi"})
    time_slot: Optional[str] = Field(default="18:00 - 20:30 (Post-Shift)", json_schema_extra={"example": "18:00 - 20:30 (Post-Shift)"})
    date: Optional[str] = Field(default="Today (Evening)", json_schema_extra={"example": "Today (Evening)"})
    direct_payout: float = Field(default=450.0, json_schema_extra={"example": 450.0})
    description: Optional[str] = Field(default="Post-shift electrical assistance needed.", json_schema_extra={"example": "Urgent inverter checkup."})

class FreelanceApplyRequest(BaseModel):
    worker_id: int
    worker_name: Optional[str] = None

class WorkerFreelanceSettingsRequest(BaseModel):
    freelance_enabled: Optional[bool] = True
    freelance_slots: Optional[List[str]] = Field(default=["17:00 - 21:00 (Evening)", "Weekend Flexible"])

class WorkerComplaintRequest(BaseModel):
    worker_id: int
    worker_name: Optional[str] = None
    customer_name: str
    customer_phone: Optional[str] = None
    booking_id: Optional[int] = None
    category: str = Field(default="OVERTIME_DELAY") # OVERTIME_DELAY, CUSTOMER_MISBEHAVIOR, FRAUD_OTP_REFUSAL, UNSAFE_ENVIRONMENT
    category_title: Optional[str] = None
    description: str
    delay_hours: Optional[float] = 0.0
    severity: Optional[str] = "HIGH" # LOW, MEDIUM, HIGH, CRITICAL

class CustomerDebarmentActionRequest(BaseModel):
    action: str = Field(default="DEBAR") # DEBAR or REINSTATE
    reason: Optional[str] = Field(default="Ministry Administrative Action")
    services: Optional[List[str]] = Field(default=None) # e.g. ["electrician"] or ["ALL"]

class WorkerDisciplineActionRequest(BaseModel):
    action: str = Field(default="WARN") # FIRE, WARN, REINSTATE, RESET_REJECTIONS
    reason: Optional[str] = Field(default="Ministry Review Action")
    notes: Optional[str] = None

class DispatchRespondRequest(BaseModel):
    booking_id: int
    worker_id: int
    action: str = Field(default="ACCEPT") # ACCEPT, DECLINE, or WITHDRAW
    reason: Optional[str] = None
    notes: Optional[str] = None
    reassigned_worker_id: Optional[int] = None

class AIChatRequest(BaseModel):
    message: str = Field(..., json_schema_extra={"example": "I have water leaking from my pipe"})
    language: Optional[str] = Field(default="auto", json_schema_extra={"example": "en"})
    history: Optional[List[Dict[str, str]]] = Field(default=[], json_schema_extra={"example": []})
    customer_name: Optional[str] = Field(default="Citizen", json_schema_extra={"example": "Citizen"})

# ----------------- API Endpoints -----------------


@app.get("/")
def root():
    return {
        "platform": "Seva Setu (सेवा सेतु)",
        "governing_body": "Ministry of Cooperation, Government of India",
        "vision": "Seva Se Samriddhi",
        "docs": "/docs",
        "status": "online"
    }

# 1. Workers Directory
@app.get("/api/workers", tags=["Workers"])
def list_workers(service: Optional[str] = None):
    if service:
        return [w for w in WORKERS if str(w.get("skill", "")).lower() == service.lower()]
    return WORKERS

# 2. Transparent Pricing Quote
@app.post("/api/pricing/quote", tags=["Pricing"])
def get_price_quote(req: QuoteRequest):
    return calculate_transparent_fare(
        service_type=req.service_type,
        plan=req.plan,
        customer_coords=(req.customer_lat, req.customer_lng),
        worker_coords=(req.worker_lat, req.worker_lng),
        is_emergency=req.is_emergency,
        is_ngo=req.is_ngo
    )

# 3. Create Booking & Broadcast (Rapido Style)
@app.post("/api/bookings/create", tags=["Bookings"])
@app.post("/api/v1/bookings", tags=["Bookings"])
def new_booking(req: BookingCreateRequest):
    result = create_booking(
        customer_name=req.customer_name,
        customer_coords=(req.customer_lat or 28.6315, req.customer_lng or 77.2167),
        service_type=req.service_type,
        plan=req.plan or "hourly",
        is_emergency=bool(req.is_emergency),
        is_ngo=bool(req.is_ngo),
        booking_date=req.booking_date,
        booking_time=req.booking_time
    )
    if not result["success"]:
        if result.get("status") == "CUSTOMER_DEBARRED":
            raise HTTPException(status_code=403, detail=result["message"])
        raise HTTPException(status_code=404, detail=result["message"])
    return result


# 4. Get Booking Details
@app.get("/api/bookings/{booking_id}", tags=["Bookings"])
def get_booking(booking_id: int):
    booking = BOOKINGS_DB.get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

# 5. Worker Accept / Reject / Withdraw (Fallback & Telemetry Trigger)
@app.post("/api/bookings/dispatch/respond", tags=["Workers"])
def dispatch_respond(req: DispatchRespondRequest):
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    action_type = req.action.upper()
    booking: Dict[str, Any]
    existing_booking = BOOKINGS_DB.get(req.booking_id)

    if existing_booking is not None:
        booking = existing_booking
    else:
        new_booking: Dict[str, Any] = {
            "booking_id": req.booking_id,
            "service_type": "electrician",
            "customer_name": "Citizen Customer",
            "status": "ACCEPTED",
            "timeline": []
        }
        BOOKINGS_DB[req.booking_id] = new_booking
        booking = new_booking

    if action_type == "WITHDRAW":
        worker = next((w for w in WORKERS if w["id"] == req.worker_id), None)
        worker_name = worker["name"] if worker else f"Worker #{req.worker_id}"

        if worker:
            worker["withdrawal_count"] = worker.get("withdrawal_count", 0) + 1
            worker["rejection_count"] = worker.get("rejection_count", 0) + 1
            worker["disciplinary_status"] = "UNDER_REVIEW"
            worker.setdefault("disciplinary_history", []).append({
                "action": "LATE_WITHDRAWAL_POST_ACCEPTANCE",
                "reason": req.reason or "Worker emergency / vehicle breakdown after acceptance",
                "notes": req.notes or "Immediate telemetry reassignment executed",
                "timestamp": now_str
            })

        backup_worker = None
        if req.reassigned_worker_id:
            backup_worker = next((w for w in WORKERS if w["id"] == req.reassigned_worker_id), None)
        if not backup_worker:
            cust_lat = float(booking.get("customer_lat", 28.6304))
            cust_lng = float(booking.get("customer_lng", 77.2273))
            service_type_val = str(booking.get("service_type", "electrician"))
            candidates = find_nearest_workers(
                (cust_lat, cust_lng),
                service_type_val,
                exclude_worker_ids=[req.worker_id]
            )
            backup_worker = candidates[0] if candidates else None

        incident_entry = {
            "id": len(WORKER_REJECTIONS_LOG) + 901,
            "worker_id": req.worker_id,
            "worker_name": worker_name,
            "booking_id": req.booking_id,
            "service_type": booking.get("service_type", "general"),
            "timestamp": now_str,
            "type": "POST_ACCEPTANCE_WITHDRAWAL",
            "reason": f"Late Post-Acceptance Withdrawal ({req.reason}): {req.notes or 'Telemetry Reassignment'}",
            "severity": "CRITICAL",
            "reassigned_to": backup_worker["name"] if backup_worker else "Certified Backup",
            "reassigned_worker_id": backup_worker["id"] if backup_worker else None
        }
        WORKER_REJECTIONS_LOG.insert(0, incident_entry)

        booking["assigned_worker"] = backup_worker
        booking["status"] = "ACCEPTED"
        timeline = booking.setdefault("timeline", [])
        if isinstance(timeline, list):
            timeline.append(
                f"🚨 WITHDRAWAL INCIDENT: Worker {worker_name} withdrew ({req.reason}). Reassigned to {backup_worker['name'] if backup_worker else 'Backup'}. Customer SLA preserved."
            )

        return {
            "success": True,
            "status": "FALLBACK_REASSIGNED",
            "message": f"Late withdrawal logged. Reassigned to {backup_worker['name'] if backup_worker else 'backup technician'}.",
            "incident_report": incident_entry,
            "reassigned_worker": backup_worker
        }
    elif action_type == "DECLINE":
        return worker_respond_to_job(booking_id=req.booking_id, worker_id=req.worker_id, accept=False)
    else:
        return worker_respond_to_job(booking_id=req.booking_id, worker_id=req.worker_id, accept=True)

@app.post("/api/bookings/{booking_id}/respond", tags=["Workers"])
def respond_booking(booking_id: int, req: WorkerResponseRequest):
    result = worker_respond_to_job(booking_id=booking_id, worker_id=req.worker_id, accept=req.accept)
    return result

# 6. Verify START_OTP
@app.post("/api/bookings/{booking_id}/start-otp", tags=["Bookings"])
def submit_start_otp(booking_id: int, req: StartOtpRequest):
    result = verify_start_otp(booking_id=booking_id, entered_otp=req.otp)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

# 7. Complete Job with Proof & END_OTP
@app.post("/api/bookings/{booking_id}/complete", tags=["Bookings"])
def finalize_booking(booking_id: int, req: CompleteJobRequest):
    result = complete_job_with_proof(booking_id=booking_id, entered_otp=req.otp, proof_image=req.proof_image)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

# 8. AI Document Verification (Gemini 1.5 Flash)
@app.post("/api/workers/verify-credentials", tags=["AI Verification"])
def verify_document(req: DocumentVerifyRequest):
    return verify_worker_documents(
        worker_name=req.worker_name,
        skill=req.skill,
        doc_type=req.doc_type,
        image_base64_or_path=req.image_data or ""
    )

# 8b. Multilingual AI Chatbot Assistant & Auto Sub-Service Selection (Seva Mitra)
@app.post("/api/ai/chat", tags=["AI Assistant"])
def ai_assistant_chat(req: AIChatRequest):
    """
    Multilingual conversational AI endpoint for citizens.
    Automatically detects user problem (via speech-to-text or typed text in any language),
    determines the matching cooperative service trade (e.g. plumber, electrician),
    and selects the exact sub-service(s) (e.g. tap_pipe_leakage, fan_installation) with fair transparent pricing.
    """
    return process_customer_ai_message(
        message=req.message,
        language=req.language or "auto",
        history=req.history or [],
        customer_name=req.customer_name or "Citizen"
    )

@app.get("/api/ai/catalog", tags=["AI Assistant"])
def get_ai_catalog():
    """
    Returns full catalog of cooperative trades and sub-services.
    """
    return {
        "success": True,
        "services": list(SERVICES_CATALOG.keys()),
        "catalog": SERVICES_CATALOG
    }

# 9. Ministry of Cooperation Analytics
@app.get("/api/ministry/analytics", tags=["Ministry Dashboard"])
def get_ministry_analytics():
    total_workers = len(WORKERS)
    verified_workers = len([w for w in WORKERS if w["is_verified"]])
    completed_bookings = [b for b in BOOKINGS_DB.values() if b["status"] == "COMPLETED"]
    
    total_wages_disbursed = sum(float(w.get("total_earned", 0.0)) for w in WORKERS)
    coop_welfare_fund = round(total_wages_disbursed * 0.035, 2)
    
    # Calculate estimated citizen savings compared to private commercial aggregators
    commercial_gap = round(total_wages_disbursed * 0.38, 2)

    return {
        "active_cooperatives": len(COOPERATIVES),
        "cooperatives": COOPERATIVES,
        "total_workers": total_workers,
        "verified_workers": verified_workers,
        "total_wages_disbursed": total_wages_disbursed,
        "coop_welfare_fund_accumulated": coop_welfare_fund,
        "citizen_savings_vs_aggregators": commercial_gap,
        "district_analytics": DISTRICT_ANALYTICS,
        "active_bookings_count": len(BOOKINGS_DB),
        "recent_bookings": list(BOOKINGS_DB.values())[-5:],
        "total_reviews": len(REVIEWS_DB),
        "avg_rating": round(sum(float(r.get("rating", 5.0)) for r in REVIEWS_DB) / len(REVIEWS_DB), 1) if REVIEWS_DB else 5.0
    }

# 10. Citizen Reviews & Grievances Desk
@app.get("/api/reviews", tags=["Reviews"])
def get_reviews(review_type: Optional[str] = None, worker_id: Optional[int] = None):
    results = REVIEWS_DB
    if review_type and review_type != "all":
        results = [r for r in results if str(r.get("review_type") or r.get("type") or "").lower() == review_type.lower()]
    if worker_id:
        results = [r for r in results if r.get("worker_id") == worker_id]
    return {
        "success": True,
        "count": len(results),
        "reviews": results,
        "stats": {
            "total_reviews": len(REVIEWS_DB),
            "average_rating": round(sum(float(r.get("rating", 5.0)) for r in REVIEWS_DB) / max(len(REVIEWS_DB), 1), 1)
        }
    }

@app.post("/api/reviews", tags=["Reviews"])
def submit_review(req: ReviewCreateRequest):
    existing_ids = [int(r["id"]) for r in REVIEWS_DB if str(r.get("id", "")).isdigit()]
    new_id = max(existing_ids, default=0) + 1
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    cust_name = req.customer_name or req.user_name or "Verified Citizen"
    serv_type = req.service_type or req.service or "electrician"
    rev_type = req.review_type or req.type or ("positive" if req.rating >= 4 else "complaint")
    
    review_item = {
        "id": new_id,
        "customer_name": cust_name,
        "user_name": cust_name,
        "worker_id": req.worker_id or 101,
        "worker_name": req.worker_name or "Cooperative Technician",
        "service_type": serv_type,
        "service": serv_type,
        "service_title": f"{serv_type.capitalize()} Service",
        "rating": req.rating,
        "review_type": rev_type,
        "type": rev_type,
        "comment": req.comment,
        "timestamp": now_str,
        "status": "Resolved" if rev_type == "positive" else "Under Investigation",
        "ministry_action": "Commendation Logged" if rev_type == "positive" else "Grievance Ticket Created"
    }
    REVIEWS_DB.insert(0, review_item)
    return {"success": True, "message": "Review submitted successfully", "review": review_item}

@app.patch("/api/ministry/reviews/{review_id}/status", tags=["Ministry Dashboard"])
def update_review_status(
    review_id: str,
    req: Optional[ReviewStatusUpdateRequest] = Body(None),
    status: Optional[str] = Query(None)
):
    target_status = None
    target_action = None
    if req and req.status:
        target_status = req.status
        target_action = req.ministry_action
    elif status:
        target_status = status

    if not target_status:
        raise HTTPException(status_code=400, detail="Status must be provided in body or query param")

    clean_id = review_id.strip()
    id_numeric = None
    import re
    num_match = re.search(r"\d+", clean_id)
    if num_match:
        id_numeric = int(num_match.group(0))

    for r in REVIEWS_DB:
        r_id_str = str(r.get("id", "")).strip()
        if (clean_id == r_id_str or 
            (id_numeric is not None and str(r.get("id")) == str(id_numeric)) or
            clean_id.endswith(r_id_str)):
            r["status"] = target_status
            r["ministry_action"] = target_action or f"Status changed to {target_status}"
            return {"success": True, "message": "Grievance status updated", "review": r}

    raise HTTPException(status_code=404, detail="Review not found")

# 11. Subscription Passes & Special Offers
@app.get("/api/subscriptions/plans", tags=["Subscriptions"])
def list_subscription_plans():
    return {
        "success": True,
        "plans": SUBSCRIPTION_PLANS
    }

@app.post("/api/subscriptions/subscribe", tags=["Subscriptions"])
def activate_subscription(req: SubscriptionRequest):
    selected_plan = next((p for p in SUBSCRIPTION_PLANS if p["id"] == req.plan_id), None)
    if not selected_plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    
    # Generated customized discount coupons
    offers = [
        {
            "code": "SAMRIDDHI25",
            "title": f"25% Off All Bookings ({selected_plan['name']})",
            "description": "Exclusive subscriber discount on all cooperative services",
            "valid_until": "30 Days",
            "discount_percent": selected_plan["discount_percent"]
        },
        {
            "code": "TRIAGEFREE",
            "title": "Zero Emergency Surcharge",
            "description": "Waived priority surcharge on emergency repairs",
            "valid_until": "Always Active"
        },
        {
            "code": "COOPCARE100",
            "title": "₹100 Passbook Credit",
            "description": "Instant cooperative welfare cashback for health and safety checkups",
            "valid_until": "Valid This Month"
        }
    ]
    
    return {
        "success": True,
        "message": f"Successfully subscribed to {selected_plan['name']}!",
        "customer_name": req.customer_name,
        "plan": selected_plan,
        "subscription": selected_plan,
        "payment_ref": req.payment_ref or "NPCI-ESCROW-PAID",
        "generated_offers": offers,
        "offers": offers,
        "is_subscriber": True
    }

@app.get("/api/subscriptions/offers", tags=["Subscriptions"])
def get_subscriber_offers():
    return {
        "success": True,
        "offers": [
            {
                "code": "SAMRIDDHI25",
                "title": "25% Off All Bookings (Subscriber Exclusive)",
                "description": "Auto-applied on all PAC-certified home services",
                "badge": "Active Pass"
            },
            {
                "code": "TRIAGEFREE",
                "title": "Zero Emergency Surcharge",
                "description": "100% discount on urgent dispatch fees",
                "badge": "VIP Perk"
            },
            {
                "code": "COOPCARE100",
                "title": "₹100 First Monthly Checkup Voucher",
                "description": "Redeemable for electrical inspection or sanitary check",
                "badge": "Welcome Gift"
            }
        ]
    }

# 12. Regional Demand Intelligence & Visual Analytics
@app.get("/api/ministry/regional-demand", tags=["Ministry Dashboard"])
def get_regional_demand(service_type: Optional[str] = None):
    all_districts = REGIONAL_DEMAND_DETAILED
    
    if service_type and service_type != "all":
        # Calculate specific metrics for requested service
        total_req = sum(d.get("trade_requirements", {}).get(service_type, {}).get("required", 0) for d in all_districts)
        total_act = sum(d.get("trade_requirements", {}).get(service_type, {}).get("active", 0) for d in all_districts)
        total_def = sum(d.get("trade_requirements", {}).get(service_type, {}).get("deficit", 0) for d in all_districts)
        total_orders = sum(d.get("trade_requirements", {}).get(service_type, {}).get("monthly_orders", 0) for d in all_districts)
        
        # District with highest deficit for this trade
        highest_deficit_dist = max(
            all_districts,
            key=lambda d: d.get("trade_requirements", {}).get(service_type, {}).get("deficit", 0)
        )["district"]
        
        return {
            "success": True,
            "selected_service": service_type,
            "districts": all_districts,
            "summary": {
                "service_name": service_type,
                "total_required": total_req,
                "total_active": total_act,
                "total_deficit": total_def,
                "total_monthly_demand": total_orders,
                "highest_shortage_district": highest_deficit_dist,
                "high_demand_districts": [d["district"] for d in all_districts if d["shortage"]]
            }
        }

    # Consolidated report for all services
    total_req_all = sum(d.get("required_workers", 50) for d in all_districts)
    total_act_all = sum(d.get("active_workers", 40) for d in all_districts)
    
    return {
        "success": True,
        "selected_service": "all",
        "districts": all_districts,
        "summary": {
            "service_name": "all",
            "total_required": total_req_all,
            "total_active": total_act_all,
            "total_deficit": max(0, total_req_all - total_act_all),
            "high_demand_districts": [d["district"] for d in all_districts if d["shortage"]],
            "total_monthly_demand": sum(int(d.get("monthly_orders", 0)) for d in all_districts),
            "top_deficit_trade": "electrician"
        }
    }

# 13. App Revenue & Cooperative Welfare Audit
@app.get("/api/ministry/revenue", tags=["Ministry Dashboard"])
def get_revenue_analytics():
    return {
        "success": True,
        "metrics": REVENUE_METRICS,
        "revenue_breakdown": [
            {"category": "Direct Worker DBT (Take-Home)", "amount": REVENUE_METRICS["direct_worker_wages"], "percent": 90.0},
            {"category": "Cooperative Welfare & Pension Fund (3.5%)", "amount": REVENUE_METRICS["welfare_fund_collected"], "percent": 3.5},
            {"category": "Citizen Subscriptions & Passes", "amount": REVENUE_METRICS["subscription_revenue"], "percent": 6.5}
        ]
    }

# 13B. Regional Growth Analytics (Deployments, Requests, Revenue & Welfare)
REGIONAL_GROWTH_METRICS = {
    "all": {
        "region_name": "Consolidated National Capital Region (NCR)",
        "horizons": {
            "6m": {
                "labels": ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
                "deployments": [1240, 1580, 2040, 2690, 3450, 4280],
                "requests": [1380, 1750, 2260, 2980, 3810, 4650],
                "revenue": [372000, 474000, 612000, 807000, 1035000, 1428500],
                "welfare": [13020, 16590, 21420, 28245, 36225, 49997],
                "velocity": "+245.2% 6-Mo Surge",
                "kpis": {
                    "deployments": "4,280 Active",
                    "deployments_sub": "+24.1% MoM Surge",
                    "requests": "4,650 Requests",
                    "requests_sub": "92.0% Fulfilment Ratio",
                    "revenue": "₹14.28 Lakhs",
                    "revenue_sub": "100% Direct Worker DBT",
                    "welfare": "₹50,000 Pool",
                    "welfare_sub": "3.5% Social Security Cess"
                }
            },
            "30d": {
                "labels": ["Week 1 (Aug 24)", "Week 2 (Aug 31)", "Week 3 (Sep 07)", "Week 4 (Sep 14)"],
                "deployments": [820, 960, 1140, 1360],
                "requests": [890, 1050, 1250, 1460],
                "revenue": [246000, 288000, 342000, 408000],
                "welfare": [8610, 10080, 11970, 14280],
                "velocity": "+65.8% 30-Day Growth",
                "kpis": {
                    "deployments": "1,360 Deployed",
                    "deployments_sub": "+19.3% vs Prev Week",
                    "requests": "1,460 Requests",
                    "requests_sub": "93.1% Service Fulfilment",
                    "revenue": "₹4.08 Lakhs",
                    "revenue_sub": "Zero Middleman Extraction",
                    "welfare": "₹14,280 Pool",
                    "welfare_sub": "Health & Accidental Cess"
                }
            },
            "ytd": {
                "labels": ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
                "deployments": [3100, 4800, 7200, 10400, 15100, 21500],
                "requests": [3450, 5300, 7900, 11300, 16400, 23200],
                "revenue": [930000, 1440000, 2160000, 3120000, 4530000, 6450000],
                "welfare": [32550, 50400, 75600, 109200, 158550, 225750],
                "velocity": "+593.5% FY CAGR",
                "kpis": {
                    "deployments": "21,500 Deployed",
                    "deployments_sub": "6-Quarter PACS Expansion",
                    "requests": "23,200 Requests",
                    "requests_sub": "92.7% National Fulfillment",
                    "revenue": "₹64.50 Lakhs",
                    "revenue_sub": "Cumulative Artisan Earnings",
                    "welfare": "₹2.25 Lakhs Pool",
                    "welfare_sub": "State Insurance Endowment"
                }
            }
        }
    },
    "central_delhi": {
        "region_name": "Central Delhi (Connaught Place, Karol Bagh)",
        "horizons": {
            "6m": {
                "labels": ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
                "deployments": [320, 410, 540, 710, 920, 1140],
                "requests": [350, 450, 590, 780, 1010, 1230],
                "revenue": [96000, 123000, 162000, 213000, 276000, 368900],
                "welfare": [3360, 4305, 5670, 7455, 9660, 12911],
                "velocity": "+256.3% 6-Mo Surge",
                "kpis": {
                    "deployments": "1,140 Active",
                    "deployments_sub": "+23.9% MoM Trajectory",
                    "requests": "1,230 Requests",
                    "requests_sub": "92.7% Fulfilment Ratio",
                    "revenue": "₹3.68 Lakhs",
                    "revenue_sub": "100% Direct Worker DBT",
                    "welfare": "₹12,911 Pool",
                    "welfare_sub": "3.5% Social Security Cess"
                }
            },
            "30d": {
                "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
                "deployments": [220, 260, 310, 350],
                "requests": [240, 280, 335, 375],
                "revenue": [66000, 78000, 93000, 105000],
                "welfare": [2310, 2730, 3255, 3675],
                "velocity": "+59.1% MoM",
                "kpis": {
                    "deployments": "350 Deployed",
                    "deployments_sub": "+12.9% vs Prev Week",
                    "requests": "375 Requests",
                    "requests_sub": "93.3% Service Fulfilment",
                    "revenue": "₹1.05 Lakhs",
                    "revenue_sub": "Direct Worker Payouts",
                    "welfare": "₹3,675 Pool",
                    "welfare_sub": "Central District Reserve"
                }
            },
            "ytd": {
                "labels": ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
                "deployments": [820, 1250, 1900, 2750, 3950, 5600],
                "requests": [900, 1380, 2090, 3010, 4300, 6050],
                "revenue": [246000, 375000, 570000, 825000, 1185000, 1680000],
                "welfare": [8610, 13125, 19950, 28875, 41475, 58800],
                "velocity": "+582.9% FY CAGR",
                "kpis": {
                    "deployments": "5,600 Deployed",
                    "deployments_sub": "District Guild Growth",
                    "requests": "6,050 Requests",
                    "requests_sub": "92.6% Cumulative Fulfillment",
                    "revenue": "₹16.80 Lakhs",
                    "revenue_sub": "Worker Take-Home Wages",
                    "welfare": "₹58,800 Pool",
                    "welfare_sub": "District Welfare Cess"
                }
            }
        }
    },
    "south_delhi": {
        "region_name": "South Delhi (Hauz Khas, Saket, Greater Kailash)",
        "horizons": {
            "6m": {
                "labels": ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
                "deployments": [380, 490, 640, 830, 1080, 1320],
                "requests": [420, 530, 690, 910, 1180, 1440],
                "revenue": [114000, 147000, 192000, 249000, 324000, 442000],
                "welfare": [3990, 5145, 6720, 8715, 11340, 15470],
                "velocity": "+247.4% 6-Mo Surge",
                "kpis": {
                    "deployments": "1,320 Active",
                    "deployments_sub": "+22.2% MoM Expansion",
                    "requests": "1,440 Requests",
                    "requests_sub": "91.7% Fulfilment Ratio",
                    "revenue": "₹4.42 Lakhs",
                    "revenue_sub": "High-Value Guild Gigs",
                    "welfare": "₹15,470 Pool",
                    "welfare_sub": "3.5% Cooperative Cess"
                }
            },
            "30d": {
                "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
                "deployments": [250, 300, 360, 410],
                "requests": [270, 325, 390, 445],
                "revenue": [75000, 90000, 108000, 123000],
                "welfare": [2625, 3150, 3780, 4305],
                "velocity": "+64.0% MoM",
                "kpis": {
                    "deployments": "410 Deployed",
                    "deployments_sub": "+13.8% vs Prev Week",
                    "requests": "445 Requests",
                    "requests_sub": "92.1% Service Fulfilment",
                    "revenue": "₹1.23 Lakhs",
                    "revenue_sub": "South Delhi Technicians",
                    "welfare": "₹4,305 Pool",
                    "welfare_sub": "PACS Medical Reserve"
                }
            },
            "ytd": {
                "labels": ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
                "deployments": [960, 1490, 2250, 3200, 4700, 6600],
                "requests": [1050, 1630, 2450, 3500, 5100, 7150],
                "revenue": [288000, 447000, 675000, 960000, 1410000, 1980000],
                "welfare": [10080, 15645, 23625, 33600, 49350, 69300],
                "velocity": "+587.5% FY CAGR",
                "kpis": {
                    "deployments": "6,600 Deployed",
                    "deployments_sub": "PACS Cooperative Network",
                    "requests": "7,150 Requests",
                    "requests_sub": "92.3% Cumulative Fulfilment",
                    "revenue": "₹19.80 Lakhs",
                    "revenue_sub": "Direct Cooperative DBT",
                    "welfare": "₹69,300 Pool",
                    "welfare_sub": "South Federation Reserve"
                }
            }
        }
    },
    "new_delhi": {
        "region_name": "New Delhi (Barakhamba, Chanakyapuri, Lodhi)",
        "horizons": {
            "6m": {
                "labels": ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
                "deployments": [210, 270, 350, 460, 590, 740],
                "requests": [230, 290, 380, 500, 640, 800],
                "revenue": [63000, 81000, 105000, 138000, 177000, 246000],
                "welfare": [2205, 2835, 3675, 4830, 6195, 8610],
                "velocity": "+252.4% 6-Mo Surge",
                "kpis": {
                    "deployments": "740 Active",
                    "deployments_sub": "+25.4% MoM Growth",
                    "requests": "800 Requests",
                    "requests_sub": "92.5% Fulfilment Ratio",
                    "revenue": "₹2.46 Lakhs",
                    "revenue_sub": "100% Direct DBT",
                    "welfare": "₹8,610 Pool",
                    "welfare_sub": "3.5% Welfare Cess"
                }
            },
            "30d": {
                "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
                "deployments": [140, 165, 195, 240],
                "requests": [150, 180, 210, 260],
                "revenue": [42000, 49500, 58500, 72000],
                "welfare": [1470, 1732, 2047, 2520],
                "velocity": "+71.4% MoM",
                "kpis": {
                    "deployments": "240 Deployed",
                    "deployments_sub": "+23.1% vs Prev Week",
                    "requests": "260 Requests",
                    "requests_sub": "92.3% Service Fulfilment",
                    "revenue": "₹72,000",
                    "revenue_sub": "Zero Cut Taken",
                    "welfare": "₹2,520 Pool",
                    "welfare_sub": "Urban Cooperative Reserve"
                }
            },
            "ytd": {
                "labels": ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
                "deployments": [540, 820, 1240, 1780, 2560, 3600],
                "requests": [590, 900, 1360, 1950, 2800, 3900],
                "revenue": [162000, 246000, 372000, 534000, 768000, 1080000],
                "welfare": [5670, 8610, 13020, 18690, 26880, 37800],
                "velocity": "+566.7% FY CAGR",
                "kpis": {
                    "deployments": "3,600 Deployed",
                    "deployments_sub": "Urban Guild Network",
                    "requests": "3,900 Requests",
                    "requests_sub": "92.3% Cumulative Fulfilment",
                    "revenue": "₹10.80 Lakhs",
                    "revenue_sub": "Direct Worker Payouts",
                    "welfare": "₹37,800 Pool",
                    "welfare_sub": "3.5% Trust Fund"
                }
            }
        }
    },
    "north_delhi": {
        "region_name": "North Delhi (Civil Lines, Kashmere Gate, Model Town)",
        "horizons": {
            "6m": {
                "labels": ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
                "deployments": [180, 230, 290, 380, 480, 590],
                "requests": [200, 255, 320, 420, 530, 650],
                "revenue": [54000, 69000, 87000, 114000, 144000, 198000],
                "welfare": [1890, 2415, 3045, 3990, 5040, 6930],
                "velocity": "+227.8% 6-Mo Surge",
                "kpis": {
                    "deployments": "590 Active",
                    "deployments_sub": "+22.9% MoM Trajectory",
                    "requests": "650 Requests",
                    "requests_sub": "90.8% Fulfilment Ratio",
                    "revenue": "₹1.98 Lakhs",
                    "revenue_sub": "100% Direct DBT",
                    "welfare": "₹6,930 Pool",
                    "welfare_sub": "3.5% Social Security Cess"
                }
            },
            "30d": {
                "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
                "deployments": [110, 135, 165, 195],
                "requests": [120, 150, 180, 215],
                "revenue": [33000, 40500, 49500, 58500],
                "welfare": [1155, 1417, 1732, 2047],
                "velocity": "+77.3% MoM",
                "kpis": {
                    "deployments": "195 Deployed",
                    "deployments_sub": "+18.2% vs Prev Week",
                    "requests": "215 Requests",
                    "requests_sub": "90.7% Service Fulfilment",
                    "revenue": "₹58,500",
                    "revenue_sub": "Direct Artisan Wages",
                    "welfare": "₹2,047 Pool",
                    "welfare_sub": "North Delhi PACS Fund"
                }
            },
            "ytd": {
                "labels": ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
                "deployments": [420, 660, 1010, 1470, 2130, 3050],
                "requests": [470, 740, 1120, 1630, 2350, 3350],
                "revenue": [126000, 198000, 303000, 441000, 639000, 915000],
                "welfare": [4410, 6930, 10605, 15435, 22365, 32025],
                "velocity": "+626.2% FY CAGR",
                "kpis": {
                    "deployments": "3,050 Deployed",
                    "deployments_sub": "North District Guilds",
                    "requests": "3,350 Requests",
                    "requests_sub": "91.0% Cumulative Fulfilment",
                    "revenue": "₹9.15 Lakhs",
                    "revenue_sub": "Craftsmen Direct Income",
                    "welfare": "₹32,025 Pool",
                    "welfare_sub": "3.5% Trust Fund"
                }
            }
        }
    },
    "west_delhi": {
        "region_name": "West Delhi (Rajouri Garden, Janakpuri, Punjabi Bagh)",
        "horizons": {
            "6m": {
                "labels": ["Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26"],
                "deployments": [150, 180, 220, 310, 380, 490],
                "requests": [180, 215, 280, 370, 450, 530],
                "revenue": [45000, 54000, 66000, 93000, 114000, 173600],
                "welfare": [1575, 1890, 2310, 3255, 3990, 6076],
                "velocity": "+226.7% 6-Mo Surge",
                "kpis": {
                    "deployments": "490 Active",
                    "deployments_sub": "+28.9% MoM Trajectory",
                    "requests": "530 Requests",
                    "requests_sub": "92.5% Fulfilment Ratio",
                    "revenue": "₹1.73 Lakhs",
                    "revenue_sub": "100% Direct Worker DBT",
                    "welfare": "₹6,076 Pool",
                    "welfare_sub": "3.5% Social Security Cess"
                }
            },
            "30d": {
                "labels": ["Week 1", "Week 2", "Week 3", "Week 4"],
                "deployments": [100, 120, 140, 165],
                "requests": [110, 135, 155, 180],
                "revenue": [30000, 36000, 42000, 49500],
                "welfare": [1050, 1260, 1470, 1732],
                "velocity": "+65.0% MoM",
                "kpis": {
                    "deployments": "165 Deployed",
                    "deployments_sub": "+17.9% vs Prev Week",
                    "requests": "180 Requests",
                    "requests_sub": "91.7% Service Fulfilment",
                    "revenue": "₹49,500",
                    "revenue_sub": "Direct Cooperative Payout",
                    "welfare": "₹1,732 Pool",
                    "welfare_sub": "West Delhi Cess Reserve"
                }
            },
            "ytd": {
                "labels": ["Q1 FY25", "Q2 FY25", "Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"],
                "deployments": [360, 580, 900, 1320, 1960, 2650],
                "requests": [440, 650, 1020, 1490, 2150, 2850],
                "revenue": [108000, 174000, 270000, 396000, 588000, 795000],
                "welfare": [3780, 6090, 9450, 13860, 20580, 27825],
                "velocity": "+636.1% FY CAGR",
                "kpis": {
                    "deployments": "2,650 Deployed",
                    "deployments_sub": "Industrial Guild Network",
                    "requests": "2,850 Requests",
                    "requests_sub": "93.0% Cumulative Fulfilment",
                    "revenue": "₹7.95 Lakhs",
                    "revenue_sub": "100% Direct DBT",
                    "welfare": "₹27,825 Pool",
                    "welfare_sub": "3.5% Trust Fund"
                }
            }
        }
    }
}

@app.get("/api/ministry/growth-analytics", tags=["Ministry Dashboard"])
def get_ministry_growth_analytics(
    region: str = Query("all", description="Region: all, central_delhi, south_delhi, new_delhi, north_delhi, west_delhi"),
    horizon: str = Query("6m", description="Horizon: 6m, 30d, ytd")
):
    selected_region = REGIONAL_GROWTH_METRICS.get(region, REGIONAL_GROWTH_METRICS["all"])
    horizon_data = selected_region["horizons"].get(horizon, selected_region["horizons"]["6m"])

    # Generate historical trajectory rows for tabular reporting
    labels = horizon_data["labels"]
    deployments = horizon_data["deployments"]
    requests = horizon_data["requests"]
    revenue = horizon_data["revenue"]
    welfare = horizon_data["welfare"]

    trajectory = []
    for i in range(len(labels)):
        prev_dep = deployments[i - 1] if i > 0 else deployments[i]
        growth_pct = round(((deployments[i] - prev_dep) / prev_dep * 100), 1) if prev_dep > 0 else 0.0
        trajectory.append({
            "period": labels[i],
            "region": selected_region["region_name"],
            "deployments": deployments[i],
            "requests": requests[i],
            "revenue": revenue[i],
            "welfare": welfare[i],
            "velocity": f"+{growth_pct}%" if growth_pct >= 0 else f"{growth_pct}%"
        })

    return {
        "success": True,
        "region": region,
        "region_name": selected_region["region_name"],
        "horizon": horizon,
        "labels": labels,
        "series": {
            "deployments": deployments,
            "requests": requests,
            "revenue": revenue,
            "welfare": welfare
        },
        "kpis": horizon_data["kpis"],
        "velocity": horizon_data["velocity"],
        "historical_trajectory": trajectory
    }

# 14. Worker Authentication, Onboarding & Access Control
@app.post("/api/workers/login", tags=["Workers"])
def worker_login(req: WorkerLoginRequest):
    # Match existing worker by phone or ID
    matched = None
    clean_req_phone = req.phone.replace(" ", "").replace("-", "")
    for w in WORKERS:
        clean_w_phone = str(w.get("phone", "")).replace(" ", "").replace("-", "")
        if clean_req_phone in clean_w_phone or clean_w_phone in clean_req_phone:
            matched = w
            break
        if req.worker_id and w["id"] == req.worker_id:
            matched = w
            break
    
    if matched:
        return {
            "success": True,
            "is_registered": True,
            "worker": matched,
            "access_granted": matched["is_verified"]
        }
    else:
        # Worker not found -> Proceed to onboarding wizard
        return {
            "success": True,
            "is_registered": False,
            "message": "New worker credentials. Please complete cooperative verification onboarding.",
            "access_granted": False
        }

@app.post("/api/workers/onboard", tags=["Workers"])
def worker_onboard(req: WorkerOnboardRequest):
    # Run AI document verification on submitted certificate
    ocr_result = verify_worker_documents(
        worker_name=req.name,
        skill=req.skill,
        doc_type="trade_certificate",
        image_base64_or_path=req.certificate_file or ""
    )
    
    existing_worker_ids = [int(w["id"]) for w in WORKERS if str(w.get("id", "")).isdigit()]
    new_id = req.worker_id or (max(existing_worker_ids, default=100) + 1)
    
    # Register or update worker profile
    worker_entry = {
        "id": new_id,
        "name": req.name,
        "phone": req.phone,
        "skill": req.skill.lower(),
        "coop_id": 1,
        "coop_name": req.coop_name or "Delhi Central Labour Coop",
        "lat": 28.6328,
        "lng": 77.2197,
        "is_available": True,
        "is_verified": ocr_result.get("verified", True),
        "rating": 5.0,
        "aadhaar": req.aadhaar,
        "certificate": req.certificate_title,
        "completed_jobs": 0,
        "total_earned": 0.0
    }
    
    # If exists, update
    existing_idx = next((i for i, w in enumerate(WORKERS) if w["id"] == new_id), None)
    if existing_idx is not None:
        WORKERS[existing_idx] = worker_entry
    else:
        WORKERS.append(worker_entry)
        
    return {
        "success": True,
        "message": f"Cooperative onboarding complete for {req.name}! Credentials verified.",
        "worker": worker_entry,
        "verification_audit": ocr_result,
        "access_granted": True
    }

@app.get("/api/workers/{worker_id}/profile", tags=["Workers"])
def get_worker_profile(worker_id: int):
    worker = next((w for w in WORKERS if w["id"] == worker_id), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    return {"success": True, "worker": worker}

# ----------------- 15. Worker Freelancing Platform (Post-Shift Independent Gigs) -----------------
@app.get("/api/freelance/jobs", tags=["Freelance"])
def list_freelance_jobs(skill: Optional[str] = None, status: Optional[str] = None):
    results = FREELANCE_JOBS
    if skill and skill != "all":
        results = [j for j in results if str(j.get("skill", "")).lower() == skill.lower()]
    if status:
        results = [j for j in results if str(j.get("status", "")).lower() == status.lower()]
    return {
        "success": True,
        "count": len(results),
        "jobs": results,
        "policy": "100% Direct Worker Payout • 0% Cooperative Federation Deduction"
    }

@app.post("/api/freelance/jobs/create", tags=["Freelance"])
def create_freelance_job(req: FreelanceJobCreateRequest):
    # Check if customer is debarred
    clean_cust = (req.customer_name or "").strip()
    clean_skill = (req.skill or "").strip().lower()
    for deb_name, deb_info in DEBARRED_CUSTOMERS.items():
        if deb_info.get("status") == "DEBARRED" and deb_name.lower() == clean_cust.lower():
            debarred_services = [s.lower() for s in deb_info.get("services", ["all"])]
            if "all" in debarred_services or clean_skill in debarred_services:
                svc_desc = "all services" if "all" in debarred_services else f"'{req.skill}' gigs"
                raise HTTPException(
                    status_code=403,
                    detail=f"Citizen '{req.customer_name}' is debarred from booking {svc_desc} by the Ministry of Cooperation."
                )

    new_id = max([int(j["id"]) for j in FREELANCE_JOBS], default=500) + 1
    fare_info = calculate_freelance_fare(service_type=req.skill, hourly_rate=req.direct_payout / 2.0)

    job_item = {
        "id": new_id,
        "title": req.title,
        "skill": req.skill.lower(),
        "customer_name": req.customer_name,
        "customer_phone": req.customer_phone or "+91 98000 12345",
        "address": req.address or "New Delhi NCR",
        "time_slot": req.time_slot or "18:00 - 20:30 (Post-Shift)",
        "date": req.date or "Today (Evening)",
        "direct_payout": float(req.direct_payout),
        "cooperative_cess": 0.0, # strictly zero federation cut
        "worker_takehome_pct": 100,
        "description": req.description,
        "fare_breakdown": fare_info,
        "status": "OPEN",
        "claimed_by_worker_id": None,
        "claimed_by_worker_name": None
    }
    FREELANCE_JOBS.insert(0, job_item)
    return {"success": True, "message": "Freelance gig published successfully! 100% direct payout.", "job": job_item}

@app.post("/api/freelance/jobs/{job_id}/apply", tags=["Freelance"])
def claim_freelance_job(job_id: str, req: FreelanceApplyRequest):
    clean_id = job_id.lower().replace("fl-", "")
    job = next((j for j in FREELANCE_JOBS if str(j["id"]).lower() == job_id.lower() or str(j["id"]).lower() == clean_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Freelance job not found")
    if job["status"] == "CLAIMED":
        raise HTTPException(status_code=400, detail="This freelance job has already been claimed by another technician.")

    worker = next((w for w in WORKERS if w["id"] == req.worker_id), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    if worker.get("disciplinary_status") in ["FIRED", "SUSPENDED"]:
        raise HTTPException(status_code=403, detail="Worker is under disciplinary suspension or terminated.")

    worker_name = req.worker_name or worker.get("name", f"Worker #{req.worker_id}")
    job["status"] = "CLAIMED"
    job["claimed_by_worker_id"] = req.worker_id
    job["claimed_by"] = req.worker_id
    job["claimed_by_worker_name"] = worker_name
    
    payout = float(job.get("direct_payout", job.get("freelance_fee", 450.0)))
    job["worker_takehome"] = payout
    job["federation_cut"] = 0.0
    job["freelance_fee"] = payout
    worker["freelance_earned"] = round(worker.get("freelance_earned", 0.0) + payout, 2)
    worker["total_earned"] = round(worker.get("total_earned", 0.0) + payout, 2)
    worker["completed_jobs"] = worker.get("completed_jobs", 0) + 1

    return {
        "success": True,
        "message": f"Freelance gig claimed by {worker_name}! ₹{payout} credited directly to worker UPI (0% Federation deduction).",
        "job": job,
        "worker_freelance_earned": worker["freelance_earned"],
        "direct_payout": payout
    }

@app.get("/api/workers/{worker_id}/freelance", tags=["Freelance"])
def get_worker_freelance_status(worker_id: int):
    worker = next((w for w in WORKERS if w["id"] == worker_id), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    claimed_gigs = [j for j in FREELANCE_JOBS if j.get("claimed_by_worker_id") == worker_id]
    return {
        "success": True,
        "worker_id": worker_id,
        "freelance_enabled": worker.get("freelance_enabled", True),
        "freelance_slots": worker.get("freelance_slots", ["17:00 - 21:00 (Evening)", "Weekend Flexible"]),
        "freelance_earned": worker.get("freelance_earned", 0.0),
        "total_earned": worker.get("total_earned", 0.0),
        "claimed_gigs": claimed_gigs
    }

@app.post("/api/workers/{worker_id}/freelance-settings", tags=["Freelance"])
def update_worker_freelance_settings(worker_id: int, req: WorkerFreelanceSettingsRequest):
    worker = next((w for w in WORKERS if w["id"] == worker_id), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    if req.freelance_enabled is not None:
        worker["freelance_enabled"] = req.freelance_enabled
    if req.freelance_slots is not None:
        worker["freelance_slots"] = req.freelance_slots

    return {
        "success": True,
        "message": "Worker freelance preferences and slots updated successfully.",
        "freelance_enabled": worker["freelance_enabled"],
        "freelance_slots": worker["freelance_slots"]
    }

# ----------------- 16. Worker Complaints & Customer Debarment Engine -----------------
@app.post("/api/workers/complaints/escalate", tags=["Complaints & Debarment"])
def escalate_worker_complaint(req: WorkerComplaintRequest):
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    new_id = max([int(c["id"]) for c in CUSTOMER_COMPLAINTS_DB], default=900) + 1

    clean_cust = req.customer_name.strip()
    
    category_titles = {
        "OVERTIME_DELAY": "Severe Uncompensated Delay / Job Exceeded Plan",
        "CUSTOMER_MISBEHAVIOR": "Customer Verbal Abuse / Hostile Misbehavior",
        "FRAUD_OTP_REFUSAL": "Customer Refusal to Provide END OTP / Hostage Labor",
        "UNSAFE_ENVIRONMENT": "Unsafe Working Conditions & Physical Hazards"
    }

    complaint_entry = {
        "id": new_id,
        "customer_name": clean_cust,
        "customer_phone": req.customer_phone or "+91 98100 00000",
        "worker_id": req.worker_id,
        "worker_name": req.worker_name or f"Worker #{req.worker_id}",
        "booking_id": req.booking_id or 1001,
        "category": req.category,
        "category_title": req.category_title or category_titles.get(req.category, "Incident Escalation"),
        "description": req.description,
        "delay_hours": req.delay_hours or 0.0,
        "severity": req.severity or "HIGH",
        "timestamp": now_str,
        "status": "ESCALATED_TO_MINISTRY",
        "ministry_action": "Ticket Logged in Ministry Cockpit"
    }
    CUSTOMER_COMPLAINTS_DB.insert(0, complaint_entry)

    # Calculate distinct workers who have escalated against this customer
    all_complaints_for_cust = [
        c for c in CUSTOMER_COMPLAINTS_DB 
        if c["customer_name"].lower() == clean_cust.lower()
    ]
    distinct_worker_ids = list({c["worker_id"] for c in all_complaints_for_cust})
    distinct_worker_names = list({c["worker_name"] for c in all_complaints_for_cust if c.get("worker_name")})

    debarment_triggered = False
    # Threshold: >= 2 distinct certified technicians reporting the same customer triggers automatic debarment
    if len(distinct_worker_ids) >= 2:
        debarment_triggered = True
        DEBARRED_CUSTOMERS[clean_cust] = {
            "customer_name": clean_cust,
            "customer_phone": req.customer_phone or "+91 98100 00000",
            "reporting_workers": distinct_worker_ids,
            "reporting_worker_names": distinct_worker_names,
            "reason": f"Multiple independent incident escalations ({len(distinct_worker_ids)} distinct technicians reported severe delays/misbehavior)",
            "services": ["ALL"],
            "debarred_at": now_str,
            "status": "DEBARRED",
            "appeal_status": "NONE"
        }
        complaint_entry["ministry_action"] = "AUTOMATIC DEBARMENT ENFORCED (Multi-Worker Threshold Reached)"

    return {
        "success": True,
        "message": (
            f"Incident complaint against citizen '{clean_cust}' successfully escalated to Ministry! "
            + (f"🚨 MULTI-WORKER DEBARMENT ENFORCED: Customer has been barred from booking services." if debarment_triggered else f"Reporting count: {len(distinct_worker_ids)}/2 workers. Warning logged.")
        ),
        "complaint": complaint_entry,
        "distinct_worker_reports": len(distinct_worker_ids),
        "debarment_triggered": debarment_triggered,
        "customer_debarred": clean_cust in DEBARRED_CUSTOMERS and DEBARRED_CUSTOMERS[clean_cust].get("status") == "DEBARRED"
    }

@app.get("/api/workers/complaints", tags=["Complaints & Debarment"])
def list_worker_complaints():
    return {
        "success": True,
        "count": len(CUSTOMER_COMPLAINTS_DB),
        "complaints": CUSTOMER_COMPLAINTS_DB,
        "debarred_customers_count": len([d for d in DEBARRED_CUSTOMERS.values() if d.get("status") == "DEBARRED"])
    }

@app.get("/api/customers/debarred", tags=["Complaints & Debarment"])
def list_debarred_customers():
    return {
        "success": True,
        "count": len(DEBARRED_CUSTOMERS),
        "debarred_customers": list(DEBARRED_CUSTOMERS.values())
    }

@app.post("/api/ministry/customers/{customer_name}/debar", tags=["Complaints & Debarment"])
def ministry_customer_debar_action(customer_name: str, req: CustomerDebarmentActionRequest):
    clean_cust = customer_name.strip()
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

    if req.action.upper() == "DEBAR":
        services_list = req.services if (req.services and len(req.services) > 0) else ["ALL"]
        DEBARRED_CUSTOMERS[clean_cust] = {
            "customer_name": clean_cust,
            "customer_phone": "Verified Account",
            "reporting_workers": [999],
            "reporting_worker_names": ["Ministry Enforcement Directive"],
            "reason": req.reason or "Administrative debarment ordered by Ministry of Cooperation",
            "services": services_list,
            "debarred_at": now_str,
            "status": "DEBARRED",
            "appeal_status": "NONE"
        }
        svc_msg = "all services" if "ALL" in services_list else f"services: {', '.join(services_list)}"
        return {"success": True, "message": f"Citizen '{clean_cust}' has been officially debarred from {svc_msg}.", "record": DEBARRED_CUSTOMERS[clean_cust]}
    elif req.action.upper() == "REINSTATE":
        if clean_cust in DEBARRED_CUSTOMERS:
            DEBARRED_CUSTOMERS[clean_cust]["status"] = "REINSTATED"
            DEBARRED_CUSTOMERS[clean_cust]["appeal_status"] = "PARDONED"
        return {"success": True, "message": f"Citizen '{clean_cust}' debarment revoked and service access restored."}
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use DEBAR or REINSTATE.")

# ----------------- 17. Workforce Excessive Rejections & Ministry Disciplinary Desk -----------------
@app.get("/api/ministry/workers/rejections", tags=["Ministry Disciplinary"])
def get_worker_rejections_audit():
    workers_rejection_summary = []
    for w in WORKERS:
        rej_count = w.get("rejection_count", 0)
        status = w.get("disciplinary_status", "ACTIVE")
        workers_rejection_summary.append({
            "worker_id": w["id"],
            "worker_name": w["name"],
            "skill": w.get("skill", "general"),
            "trade": w.get("trade", w.get("skill", "general").capitalize()),
            "coop_name": w.get("coop_name", "Cooperative Federation"),
            "completed_jobs": w.get("completed_jobs", 0),
            "rejection_count": rej_count,
            "disciplinary_status": status,
            "is_available": w.get("is_available", True),
            "is_verified": w.get("is_verified", True),
            "action_required": rej_count >= 3 or status in ["UNDER_REVIEW", "WARNING_ISSUED", "FIRED"],
            "disciplinary_history": w.get("disciplinary_history", [])
        })

    # Sort so workers with highest rejections and actions needed are at the top
    workers_rejection_summary.sort(key=lambda x: (-x["rejection_count"], x["disciplinary_status"] != "ACTIVE"))

    return {
        "success": True,
        "total_rejections_logged": len(WORKER_REJECTIONS_LOG),
        "rejections_log": list(reversed(WORKER_REJECTIONS_LOG)),
        "workers_summary": workers_rejection_summary,
        "flagged_count": len([w for w in workers_rejection_summary if w["action_required"]])
    }

@app.post("/api/ministry/workers/{worker_id}/discipline", tags=["Ministry Disciplinary"])
def ministry_discipline_worker(worker_id: int, req: WorkerDisciplineActionRequest):
    worker = next((w for w in WORKERS if w["id"] == worker_id), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")

    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    action_type = req.action.upper()

    if action_type == "FIRE":
        worker["disciplinary_status"] = "FIRED"
        worker["is_available"] = False
        worker["is_verified"] = False
        worker.setdefault("disciplinary_history", []).append({
            "action": "TERMINATED / FIRED",
            "reason": req.reason or "Terminated by Ministry of Cooperation for repeated service dispatches declined and cooperative breach.",
            "notes": req.notes or "License revoked. Dispatched radar access blocked.",
            "timestamp": now_str
        })
        return {
            "success": True,
            "message": f"Worker {worker['name']} (ID: {worker_id}) has been officially TERMINATED / FIRED. Cooperative license revoked.",
            "worker": worker
        }
    elif action_type == "WARN":
        worker["disciplinary_status"] = "WARNING_ISSUED"
        worker.setdefault("disciplinary_history", []).append({
            "action": "OFFICIAL_SHOW_CAUSE_NOTICE",
            "reason": req.reason or "Formal show-cause warning for high rejection rate.",
            "notes": req.notes or "Next rejection will result in automatic termination.",
            "timestamp": now_str
        })
        return {
            "success": True,
            "message": f"Official show-cause warning issued to {worker['name']}.",
            "worker": worker
        }
    elif action_type == "REINSTATE":
        worker["disciplinary_status"] = "ACTIVE"
        worker["is_available"] = True
        worker["is_verified"] = True
        worker["rejection_count"] = 0
        worker.setdefault("disciplinary_history", []).append({
            "action": "REINSTATED",
            "reason": req.reason or "Reinstated after review of legitimate medical or technical justification.",
            "timestamp": now_str
        })
        return {
            "success": True,
            "message": f"Worker {worker['name']} has been fully reinstated into the cooperative guild.",
            "worker": worker
        }
    elif action_type == "RESET_REJECTIONS":
        worker["rejection_count"] = 0
        worker["disciplinary_status"] = "ACTIVE"
        return {
            "success": True,
            "message": f"Rejection count reset to 0 for {worker['name']}.",
            "worker": worker
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use FIRE, WARN, REINSTATE, or RESET_REJECTIONS.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


