from flask import Flask
from flask_socketio import SocketIO
from app.services.seguranca import *

socketio = SocketIO()

def createApp():
    app = Flask(__name__, template_folder='app/templates')
    app.config['SECRET_KEY'] = 'TEMPORARIO'

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