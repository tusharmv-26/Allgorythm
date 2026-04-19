from main import app
client = app.test_client()
res = client.post('/events', json={'attacker_ip': '1', 'resource_name': 'x', 'method': 'GET'})
print(res.status_code)
print(res.get_data(as_text=True))
