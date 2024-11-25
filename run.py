from app import *
import ssl
from flask import request,redirect

app = createApp()

@app.before_request
def before_request():
    if not request.is_secure:
        return redirect(request.url.replace("http://", "https://"))

if __name__ == '__main__':
    serverIp = '192.168.10.20'
    porta=5000
    cert_file = 'cert.pem'
    key_file = 'key.pem'


    context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    context.check_hostname = False
    context.verify_mode = ssl.CERT_NONE
    context.load_cert_chain(certfile=cert_file, keyfile=key_file)

    print(f'IP do Servidor: https://{serverIp}:{porta}')
    
    socketio.run(app, port=porta, debug=True, host=serverIp, ssl_context=context)