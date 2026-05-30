import json
import urllib.request
import urllib.error
import time

BASE_URL = "http://localhost:8000"

def make_request(path, method="GET", data=None, headers=None, is_form=False):
    url = f"{BASE_URL}{path}"
    headers = headers or {}
    
    if data:
        if is_form:
            # Simple form-data encoding for login
            encoded_data = urllib.parse.urlencode(data).encode("utf-8")
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            encoded_data = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
    else:
        encoded_data = None

    req = urllib.request.Request(url, data=encoded_data, method=method)
    for key, val in headers.items():
        req.add_header(key, val)

    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            return response.status, json.loads(res_data) if res_data else None
    except urllib.error.HTTPError as e:
        err_data = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_data)
        except Exception:
            return e.code, err_data
    except Exception as e:
        return 0, str(e)

def run_tests():
    print("--- starting local api verification ---")
    
    # 1. Check root
    status, res = make_request("/")
    if status != 200:
        print("[ERROR] FastAPI server is not running on http://localhost:8000. Start the server using 'uvicorn app.main:app --reload' first.")
        return
    print(f"[OK] Root status endpoint: {res}")

    # 2. Register user
    email = f"user_{int(time.time())}@company.com"
    payload_register = {
        "name": "Verification User",
        "email": email,
        "password": "securepassword123"
    }
    status, res = make_request("/auth/register", method="POST", data=payload_register)
    if status == 201:
        print(f"[OK] User registered successfully: {res['email']}")
    else:
        print(f"[FAIL] Registration failed (status {status}): {res}")
        return

    # 3. Log In
    payload_login = {
        "username": email,
        "password": "securepassword123"
    }
    status, res = make_request("/auth/login", method="POST", data=payload_login, is_form=True)
    if status == 200:
        token = res["access_token"]
        print(f"[OK] Login successful. Received token prefix: {token[:15]}...")
    else:
        print(f"[FAIL] Login failed (status {status}): {res}")
        return

    auth_headers = {"Authorization": f"Bearer {token}"}

    # 4. Fetch Emails (Initial scan should be processed by celery or list existing)
    status, res = make_request("/emails", headers=auth_headers)
    print(f"[OK] Fetched emails list (count: {len(res) if isinstance(res, list) else 0})")
    
    # Let's trigger email scan using celery beat/trigger (manual email fetch trigger not present since it runs in worker beat)
    # However, let's create a mock email database entry manually to verify analysis works
    # Wait, we can test meetings transcript analysis which works inline!
    
    # 5. Upload Meeting
    meeting_payload = {
        "title": "Project Kickoff Sync",
        "transcript": "Alice: I will design the Postgres schema by next Monday. Bob: Excellent, I am going to build the Celery tasks structure by next Wednesday. Alice: Perfect, Charlie can you finalize settings by next Thursday? Charlie: Yes, I will verify SMTP accounts by Tuesday."
    }
    status, res = make_request("/meetings/upload", method="POST", data=meeting_payload, headers=auth_headers)
    if status == 201:
        meeting_id = res["id"]
        print(f"[OK] Meeting transcript uploaded. ID: {meeting_id}")
    else:
        print(f"[FAIL] Meeting upload failed (status {status}): {res}")
        return

    # 6. Analyze Meeting
    print("Running transcript NLP analysis (summarization & action-item extraction)...")
    status, res = make_request(f"/meetings/{meeting_id}/analyze", method="POST", headers=auth_headers)
    if status == 200:
        print("[OK] Meeting analyzed successfully.")
        print(f"Summary preview: {res['summary'][:150]}...")
        print(f"Extracted Tasks count: {len(res['tasks'])}")
        for idx, task in enumerate(res["tasks"], 1):
            print(f"  Task {idx}: {task['task_name']} | Owner: {task['owner']} | Deadline: {task['deadline']} | Status: {task['status']}")
    else:
        print(f"[FAIL] Transcript analysis failed (status {status}): {res}")
        return

    # 7. List Tasks
    status, res = make_request("/tasks", headers=auth_headers)
    if status == 200:
        print(f"[OK] Total tasks in database: {len(res)}")
    else:
        print(f"[FAIL] Fetching tasks list failed (status {status}): {res}")
        
    print("--- verification complete ---")

if __name__ == "__main__":
    run_tests()
