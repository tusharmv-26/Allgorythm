import urllib.request
import urllib.error
import json

try:
    urllib.request.urlopen(urllib.request.Request(
        'http://127.0.0.1:8000/events',
        json.dumps({'attacker_ip': '1', 'resource_name': 'company-prod-db-backup-2024', 'method': 'GET'}).encode('utf-8'),
        {'Content-Type': 'application/json'}
    ))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
