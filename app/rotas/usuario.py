from app.rotas import *
from app.services.usuario import *

def registerUsuario(app):
    
    @app.route('/usuario/admin',methods=['POST','GET'])
    def templateADM():
        return render_template('loginADM.html')
    
    @app.route('/usuario/login',methods=['POST'])
    def loginADM():
        data = request.get_json('data')

        nomeUsuario = data['nome']
        senhaUsuario = data['senha']

        respo = verificarLogin(nomeUsuario,senhaUsuario)

        data = {}

        if respo:
            data['msg'] = 'ok'

        else:
            data['msg'] = 'usuario_nao_encontrado'

        return jsonify(data)