from app import *
import ssl
from flask import request,redirect

app = createApp()
# @app.before_request
# def before_request():
#     if not request.is_secure:
#         return redirect(request.url.replace("http://", "https://"))


if __name__ == '__main__':
    serverIp = '0.0.0.0'
    url, porta = buscarIP()

    # cert_file = 'cert.pem'
    # key_file = 'key.pem'


    # context = ssl.create_default_context(ssl.Purpose.CLIENT_AUTH)
    # context.check_hostname = False
    # context.verify_mode = ssl.CERT_NONE
    # context.load_cert_chain(certfile=cert_file, keyfile=key_file)

    print(f'IP do Servidor: {url}')
    
    socketio.run(app, port=porta, debug=True, host=serverIp)