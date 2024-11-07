from flask import Flask
from utils import gerar_secret_key
from routes import configure_app
from flask_socketio import SocketIO

SECRET_KEY = gerar_secret_key()

app = Flask(__name__)
socketio = SocketIO(app)

app.secret_key = 'e6d54b4b8f270e78140b1957170de5338c6d8bc067ba703928a389b7d103f78f' #chave temporaria

# DEFININDO TEMPO DE EXPIRAÇÃO DOS COOKIES
dia = (60*60*24)
app.config['SESSION_PERMANENT'] = False
app.config['PERMANENT_SESSION_LIFETIME'] = dia

if __name__ == '__main__':
    configure_app(app, socketio)

    socketio.run(app, debug=True, host='192.168.10.24')