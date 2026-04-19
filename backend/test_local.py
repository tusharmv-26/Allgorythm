from main import app, handle_events
import traceback

with app.app_context():
    try:
        with app.test_request_context('/events', method='POST', json={'attacker_ip': '185.220.101.47', 'resource_name': 'company-prod-db-backup-2024', 'method':'GET'}):
            res = handle_events()
            print("1st:", res.get_json())
        with app.test_request_context('/events', method='POST', json={'attacker_ip': '185.220.101.47', 'resource_name': 'company-prod-db-backup-2024/config.json', 'method':'GET'}):
            res = handle_events()
            print("2nd:", res.get_json())
    except Exception as e:
        traceback.print_exc()
