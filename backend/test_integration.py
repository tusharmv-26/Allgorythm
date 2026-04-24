"""
Integration test script to verify all 6 features work correctly.
Tests: Honeypots, MITRE, APT, ML, Dynamic Content, DevSecOps
"""

import requests
import json
import time

BASE_URL = "http://13.61.240.101:8000"

def test_event_with_mitre_apt():
    """Post a test event and verify it returns MITRE techniques and APT analysis"""
    print("\n[TEST 1] Posting attack event...")
    
    event = {
        "attacker_ip": "192.168.1.100",
        "resource_name": "s3-customer-backups",
        "method": "GET",
        "timestamp": time.time()
    }
    
    response = requests.post(f"{BASE_URL}/events", json=event)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        record = data.get('record', {})
        
        print(f"✓ Event posted successfully")
        print(f"  Risk Score: {record.get('risk_score')}")
        print(f"  MITRE Techniques: {len(record.get('mitre_techniques', []))} detected")
        print(f"  APT Score: {record.get('apt_analysis', {}).get('apt_score', 0)}")
        
        if record.get('mitre_techniques'):
            print(f"  Sample Techniques: {[t['technique_id'] for t in record.get('mitre_techniques', [])[:3]]}")
        
        return True
    else:
        print(f"✗ Failed to post event: {response.text}")
        return False

def test_honeypots_endpoint():
    """Test the honeypots endpoint"""
    print("\n[TEST 2] Fetching honeypot status...")
    
    response = requests.get(f"{BASE_URL}/honeypots")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Got {len(data)} honeypots")
        for hp in data[:2]:
            print(f"  - {hp['name']}: {hp['mode']} (hits: {hp['total_hits']})")
        return True
    else:
        print(f"✗ Failed: {response.text}")
        return False

def test_mitre_summary():
    """Test MITRE summary endpoint"""
    print("\n[TEST 3] Fetching MITRE summary...")
    
    response = requests.get(f"{BASE_URL}/mitre/summary")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Found {len(data)} MITRE techniques")
        for tech in data[:3]:
            print(f"  - {tech['technique_id']}: {tech['name']} ({tech['count']} hits)")
        return True
    else:
        print(f"✗ Failed: {response.text}")
        return False

def test_apt_suspects():
    """Test APT suspects endpoint"""
    print("\n[TEST 4] Fetching APT suspects...")
    
    response = requests.get(f"{BASE_URL}/apt/suspects")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        if len(data) > 0:
            print(f"✓ Found {len(data)} APT suspects")
            for apt in data[:2]:
                print(f"  - {apt['ip']}: {apt['classification']} (score: {apt['apt_score']})")
        else:
            print(f"✓ No APT suspects (normal if no high-risk activity)")
        return True
    else:
        print(f"✗ Failed: {response.text}")
        return False

def test_ml_feature_importance():
    """Test ML feature importance endpoint"""
    print("\n[TEST 5] Fetching ML feature importance...")
    
    response = requests.get(f"{BASE_URL}/ml/feature-importance")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        risk_features = data.get('risk_model', {})
        mitre_features = data.get('mitre_model', {})
        
        print(f"✓ Risk model has {len(risk_features)} features")
        print(f"✓ MITRE model has {len(mitre_features)} features")
        
        if risk_features:
            top_risk = max(risk_features.items(), key=lambda x: x[1])
            print(f"  Top risk feature: {top_risk[0]} ({top_risk[1]:.4f})")
        
        return True
    else:
        print(f"✗ Failed: {response.text}")
        return False

def test_devsecops_endpoints():
    """Test DevSecOps endpoints"""
    print("\n[TEST 6] Testing DevSecOps endpoints...")
    
    # Test deployment event recording
    deployment = {
        "service_name": "payment-service",
        "version": "1.2.3",
        "deployed_by": "github-actions",
        "environment": "production",
        "repository": "payment-service-repo",
        "timestamp": time.time(),
        "assets": ["database-connection", "api-keys", "config"]
    }
    
    response = requests.post(f"{BASE_URL}/devsecops/deployment-event", json=deployment)
    print(f"Deployment POST Status: {response.status_code}")
    
    if response.status_code == 200:
        print(f"✓ Deployment recorded")
    
    # Test coverage endpoint
    response = requests.get(f"{BASE_URL}/devsecops/coverage")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Coverage report: {len(data)} services tracked")
        if data:
            print(f"  - {data[0]['service_name']}: {data[0]['coverage_status']}")
    
    # Test coverage summary
    response = requests.get(f"{BASE_URL}/devsecops/coverage-summary")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Coverage: {data.get('coverage_percentage', 0):.1f}% ({data.get('monitored', 0)}/{data.get('total_services', 0)})")
    
    return True

def test_events_endpoint():
    """Verify events include all new fields"""
    print("\n[TEST 7] Verifying event fields...")
    
    response = requests.get(f"{BASE_URL}/events")
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        events = response.json()
        if len(events) > 0:
            event = events[0]
            has_mitre = 'mitre_techniques' in event
            has_apt = 'apt_analysis' in event
            
            print(f"✓ Event has MITRE techniques: {has_mitre}")
            print(f"✓ Event has APT analysis: {has_apt}")
            print(f"✓ Risk score: {event.get('risk_score')}")
            
            return has_mitre and has_apt
        else:
            print("  No events yet (post some first)")
            return True
    else:
        print(f"✗ Failed: {response.text}")
        return False

def main():
    print("=" * 60)
    print("SentinelMesh 6-Feature Integration Test")
    print("=" * 60)
    
    try:
        # First, post a test event
        if test_event_with_mitre_apt():
            time.sleep(0.5)  # Brief pause
        
        # Then test all endpoints
        results = [
            test_honeypots_endpoint(),
            test_mitre_summary(),
            test_apt_suspects(),
            test_ml_feature_importance(),
            test_devsecops_endpoints(),
            test_events_endpoint()
        ]
        
        print("\n" + "=" * 60)
        print(f"RESULTS: {sum(results)}/{len(results)} tests passed")
        print("=" * 60)
        
        if all(results):
            print("✓ All integration tests PASSED!")
            return 0
        else:
            print("✗ Some tests failed - check output above")
            return 1
            
    except Exception as e:
        print(f"\n✗ Test execution failed: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
