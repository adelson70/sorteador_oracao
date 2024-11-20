from app.rotas import *
from app.services.usuario import *
from app.services.sessao import *
from app.services.token import *
from app.services.database import *
from app.services.sala import *

def registerUsuario(app):
    
    @app.route('/usuario/admin',methods=['POST','GET'])
    def templateADM():
        if buscarSessao('userType') == 'admin':
            idUsuario = buscarSessao('idAdm')
            return render_template('menuADM.html',idUsuario=idUsuario)
        
        else:
            return render_template('loginADM.html')
    
    @app.route('/usuario/login',methods=['POST'])
    def loginADM():
        data = request.get_json('data')

        nomeUsuario = data['nome']
        senhaUsuario = data['senha']

        respo = verificarLogin(nomeUsuario,senhaUsuario)

        data = {}

        if respo[0]:
            criarSessao('userType','admin')
            criarSessao('idAdm',respo[1])
            data['msg'] = 'ok'

        else:
            data['msg'] = 'usuario_nao_encontrado'

        return jsonify(data)
    
    @app.route('/usuario/criarSala', methods=['POST'])
    def criarSala():
        data = request.get_json('data')

        data = data['data']

        respo = fcriarSala(data)

        return jsonify(respo)
    
    @app.route('/usuario/carregarSala/<int:idUsuario>', methods=['GET'])
    def carregarSala(idUsuario):

        data = retornarSalasCriadas(idUsuario)

        return jsonify(data)