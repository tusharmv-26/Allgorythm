import requests
import time

# To use via Boto3, we might need actual or mock AWS configs.
# But for the purest "simulate attacker" flow on Laptop 2 as requested, standard HTTP requests
# to the backend directly, or HTTP to S3 buckets that trigger the lambda pipeline in AWS.

import sys

def run_attack(fastapi_url: str):
    print("Cloud Sentinel - Attacker Simulator")
    print("Initiating sequence...\n")
    
    # We will just post directly to the FastAPI endpoint to simulate the chain if AWS isn't set up.
    # If AWS is set up, this script should use requests.get() on the actual S3 bucket public URL.
    
    events = [
        {"ip": "185.220.101.47", "resource": "company-prod-db-backup-2024", "method": "GET"},
        {"ip": "185.220.101.47", "resource": "company-prod-db-backup-2024/config.json", "method": "GET"},
        {"ip": "185.220.101.47", "resource": "company-internal-credentials", "method": "GET"}
    ]
    
    for i, e in enumerate(events):
        print(f"[{i+1}/{len(events)}] Probing {e['resource']} from IP {e['ip']}...")
        try:
            res = requests.post(
                f"{fastapi_url}/events",
                json={
                    "attacker_ip": e['ip'],
                    "resource_name": e['resource'],
                    "method": e['method']
                }
            )
            print(f"Response: {res.status_code}")
        except Exception as ex:
            print(f"Error connecting: {ex}")
            
        time.sleep(2)
        
    print("\nAttack complete. Check the Cloud Sentinel Dashboard.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        url = "http://localhost:8000"
    else:
        url = sys.argv[1]
        
    run_attack(url)
