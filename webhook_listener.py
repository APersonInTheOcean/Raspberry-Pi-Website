from flask import Flask, request
import subprocess
import hmac
import hashlib
import os

app = Flask(__name__)

SECRET = "1021"

env = os.environ.copy()
env["GIT_SSH_COMMAND"] = "ssh -i /home/raspberrypi/.ssh/id_ed25519.pub"

def verify_signature(data, signature):
    mac = hmac.new(SECRET.encode(), msg=data, digestmod=hashlib.sha256)
    expected = 'sha256=' + mac.hexdigest()
    return hmac.compare_digest(expected, signature)

@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Hub-Signature-256')

    if not verify_signature(request.data, signature):
        return "Invalid signature", 403

    

    subprocess.call(
        ["git", "pull"],
        cwd="/home/raspberrypi/Raspberry-Pi-Website",
        env=env
    )   
    return "Updated", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)