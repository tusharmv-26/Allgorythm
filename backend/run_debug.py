import subprocess
import time
import urllib.request
import json

with open("flask_error.log", "w") as f:
    p = subprocess.Popen(["python", "-u", "main.py"], stderr=subprocess.STDOUT, stdout=f)
    
time.sleep(2)

try:
    urllib.request.urlopen(urllib.request.Request(
        'http://127.0.0.1:8000/events',
        json.dumps({'attacker_ip': '1', 'resource_name': 'x', 'method': 'GET'}).encode('utf-8'),
        {'Content-Type': 'application/json'}
    ))
except Exception as e:
    print("HTTP Error:", str(e))

p.terminate()
