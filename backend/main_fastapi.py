from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import datetime

from intelligence import RiskEngine, SimilarityEngine
from aws_client import AWSController
from grok_client import GrokClient

app = FastAPI(title="Cloud Sentinel API")

# Setup CORS as requested
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
risk_engine = RiskEngine()
similarity_engine = SimilarityEngine()
aws_client = AWSController()
grok_client = GrokClient()

# In-memory stores
events = [] # Event feed
audit_log = [] # Audit logs
system_status = {"status": "Monitoring", "peak_score": 0, "total_events": 0, "total_healing": 0}

# Removed Pydantic base models completely for raw async Request decoding to bypass Python 3.14 type hint parsing crashes


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/events")
async def post_event(request: Request):
    payload = await request.json()
    req_ip = payload.get("attacker_ip")
    req_res_name = payload.get("resource_name")
    req_method = payload.get("method")
    ts = payload.get("timestamp") or time.time()
    
    # 1. Calculate risk score
    score = risk_engine.calculate_score(req_ip, req_res_name)
    
    # Update system tracking
    system_status["total_events"] += 1
    if score > system_status["peak_score"]:
        system_status["peak_score"] = score
        
    status_badge = "Healthy"
    if score >= 70:
        system_status["status"] = "Healing active"
        status_badge = "Critical"
    elif score >= 40:
        system_status["status"] = "Alert"
        status_badge = "Elevated"
    else:
        system_status["status"] = "Monitoring"
        status_badge = "Low"

    # Add to main event feed
    event_record = {
        "id": len(events) + 1,
        "timestamp": datetime.datetime.fromtimestamp(ts).strftime('%H:%M:%S'),
        "attacker_ip": req_ip,
        "resource_name": req_res_name,
        "method": req_method,
        "risk_score": score,
        "status_badge": status_badge
    }
    events.insert(0, event_record)  # Reverse-chronological

    # 2. If score >= 70, trigger intelligence matching and self-healing
    if score >= 70:
        at_risk = similarity_engine.find_at_risk_resource(req_res_name)
        if at_risk:
            # Check if we already mitigated it recently
            already_healed = any(
                log for log in audit_log 
                if log['resource_id'] == at_risk['id'] and log['action'] == 'Restricted'
            )
            
            if not already_healed:
                print(f"[HEAL TRIGGER] Protecting {at_risk['name']} ({at_risk['id']})")
                success = aws_client.restrict_security_group(at_risk['id'])
                
                if success:
                    system_status["total_healing"] += 1
                    explanation = grok_client.generate_audit_explanation(
                        req_ip,
                        req_res_name,
                        score,
                        at_risk['name'],
                        "restricted"
                    )
                    
                    audit_record = {
                        "id": len(audit_log) + 1,
                        "timestamp": datetime.datetime.fromtimestamp(ts).strftime('%H:%M:%S'),
                        "resource_id": at_risk['id'],
                        "resource_name": at_risk['name'],
                        "action": "Restricted",
                        "explanation": explanation
                    }
                    audit_log.insert(0, audit_record)

    return {"status": "success", "record": event_record}

@app.get("/events")
def get_events():
    return events[:50] # return top 50

@app.get("/audit")
def get_audit():
    return audit_log[:50]

@app.get("/status")
def get_status():
    return system_status

@app.post("/rollback")
async def post_rollback(request: Request):
    payload = await request.json()
    resource_id = payload.get("resource_id")
    success = aws_client.rollback_security_group(resource_id)
    if success:
        # Add to audit log
        ts = time.time()
        explanation = f"Manual rollback executed. Access to {resource_id} has been restored."
        
        audit_record = {
            "id": len(audit_log) + 1,
            "timestamp": datetime.datetime.fromtimestamp(ts).strftime('%H:%M:%S'),
            "resource_id": resource_id,
            "resource_name": resource_id,
            "action": "Rolled Back",
            "explanation": explanation
        }
        audit_log.insert(0, audit_record)
        
        # Reset system status if this was the last locked resource (simplification)
        if system_status["status"] == "Healing active":
            system_status["status"] = "Monitoring"
            
        return {"status": "success"}
    return {"status": "failed", "reason": "Could not rollback or resource not found in saved states."}

@app.post("/heal")
async def post_heal(request: Request):
    payload = await request.json()
    resource_id = payload.get("resource_id")
    # Manual heal endpoint as requested
    success = aws_client.restrict_security_group(resource_id)
    if success:
        system_status["total_healing"] += 1
        ts = time.time()
        audit_record = {
            "id": len(audit_log) + 1,
            "timestamp": datetime.datetime.fromtimestamp(ts).strftime('%H:%M:%S'),
            "resource_id": resource_id,
            "resource_name": resource_id,
            "action": "Restricted",
            "explanation": f"Manual restriction executed. Access to {resource_id} restricted."
        }
        audit_log.insert(0, audit_record)
        return {"status": "success"}
    return {"status": "failed"}

# Simple demo endpoint to populate fake data for testing without attacker script
@app.post("/demo")
def post_demo():
    import random
    ts = time.time()
    ip = f"185.220.101.{random.randint(10,200)}"
        
    import urllib.request
    import json
    
    e1 = {
        "attacker_ip": ip,
        "resource_name": "company-prod-db-backup-2024",
        "method": "GET",
        "timestamp": ts
    }
    urllib.request.urlopen(urllib.request.Request("http://127.0.0.1:8000/events", json.dumps(e1).encode('utf-8'), {'Content-Type': 'application/json'}))
    
    # 2 seconds later
    e2 = {
        "attacker_ip": ip,
        "resource_name": "company-prod-db-backup-2024/credentials",
        "method": "GET",
        "timestamp": ts + 2
    }
    urllib.request.urlopen(urllib.request.Request("http://127.0.0.1:8000/events", json.dumps(e2).encode('utf-8'), {'Content-Type': 'application/json'}))
    return {"status": "demo sequence triggered"}
