from app.rotas import *
from app.services.participante import *

def registerParticipante(app):
    
    @app.route('/participante/buscar', methods=['GET'])
    def retornarParticipantes():
        tokenSala = request.args.get('tokenSala')

        arrNomes = retornarNomesParticipantes(tokenSala)

        return jsonify({'data':arrNomes})
    
    @app.route('/participante/retornarAmigo', methods=['GET'])
    def retornarAmigo():
        meuNome = request.args.get('meuNome')
        token = request.args.get('tokenSala')

        response = retornarAmigoSecreto(token,meuNome)
        
        return jsonify(response)