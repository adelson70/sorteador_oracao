from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from app.services.seguranca import *
import socket

socketio = SocketIO()

SERVER_IP = '10.29.0.163'

def createApp():
    app = Flask(__name__, template_folder='templates')
    app.config['SECRET_KEY'] = 'TEMPORARIO'

    CORS(app, resources={"/*":{"origins":"*"}})

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
    socketio.init_app(app)

    # carrega os eventos do socket
    from app.socket import event

    return app