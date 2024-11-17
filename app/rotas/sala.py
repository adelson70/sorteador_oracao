from app.rotas import *
from app.services.sala import *

def registerSala(app):
    
    @app.route('/sala/acessar/<token>', methods=['POST','GET'])
    def acessarSala(token):
        resp = entrarSala(token)
        return jsonify(resp)