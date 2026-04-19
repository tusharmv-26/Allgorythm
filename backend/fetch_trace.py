import urllib.request
import urllib.error
import json

try:
    req = urllib.request.Request(
        'http://127.0.0.1:8000/events',
        json.dumps({'attacker_ip': '1', 'resource_name': 'x', 'method': 'GET'}).encode('utf-8'),
        {'Content-Type': 'application/json'}
    )
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    with open("trace.html", "w") as f:
        f.write(e.read().decode('utf-8'))
