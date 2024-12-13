from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from app.services.seguranca import *
import json

socketio = SocketIO(cors_allowed_origins="*")

def buscarIP():
    with open('constants.json', 'r') as file:
        config = json.load(file)
        SERVER_IP = config.get('ip')
        PORT = config.get('port')

        return (SERVER_IP,PORT)
        

def createApp():
    app = Flask(__name__, template_folder='templates')
    app.config['SECRET_KEY'] = 'TEMPORARIO'

    CORS(app, resources={r"/*": {"origins": "*"}})

    # registro das rotas
    with app.app_context():
        from app.rotas import participante, sala, sortear, token, usuario, main

        participante.registerParticipante(app)
        sala.registerSala(app)
        sortear.registerSortear(app)
        token.registerToken(app)
        usuario.registerUsuario(app)
        main.registerMain(app)

    # inicializa o web socket
    socketio.init_app(app, cors_allowed_origins="*")

    # carrega os eventos do socket
    from app.socket import event

    return app