from app.rotas import *
from app.services.sala import *

def registerSala(app):
    
    @app.route('/sala/acessar/<token>', methods=['POST','GET'])
    def acessarSala(token):
        resp = entrarSala(token)
        return jsonify(resp)
    
    @app.route('/sala/remover', methods=['DELETE'])
    def removerSala():
        respo = request.get_json()

        tokenSala = respo.get('tokenSala')

        data = fdeletarSala(tokenSala)

        return jsonify(data)