from app.rotas import *
from app.services.participante import *

def registerParticipante(app):
    
    @app.route('/participante/entrarSala', methods=['POST'])
    def entrarSala():
        data = request.get_json('data')
        nomeParticipante = data['nome']
        tokenSala = data['token']

        respo = participanteEntrarSala(nomeParticipante,tokenSala)

        return jsonify(respo)