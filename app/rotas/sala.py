from app.rotas import *
from app.services.sala import *
from app.services.participante import *

def registerSala(app):
    
    # rota de primeiro acesso quando usuario entra pelo /
    @app.route('/sala/acessar/<token>', methods=['POST','GET'])
    def acessarSala(token):
        token = token.upper()
        resp = fentrarSala(token)
        return jsonify(resp)
    
    # rota alternativa de primeiro acesso quando o usuario entra pela leitura do qrcode ou link compartilhado
    @app.route('/sala/acess/<token>', methods=['POST','GET'])
    def acessSala(token):
        token = token.upper()

        resp = fentrarSala(token)

        if resp['msg'] == 'ok':
            return render_template('acessoTokenInput.html',qrcode=True, token=token)
        
        else:
            return render_template('paginaNaoEncontrada.html')
    
    @app.route('/sala/remover', methods=['DELETE'])
    def removerSala():
        respo = request.get_json()

        tokenSala = respo.get('tokenSala')

        data = fdeletarSala(tokenSala)

        return jsonify(data)
    
    @app.route('/sala/criar', methods=['POST'])
    def criarSala():
        data = request.get_json('data')

        data = data['data']

        respo = fcriarSala(data)

        return jsonify(respo)
    
    @app.route('/sala/carregar', methods=['GET'])
    def carregarSala():

        idUsuario = request.args.get('idUsuario')

        params = request.args.get('params')

        data = retornarSalasCriadas(idUsuario,params)

        return jsonify(data)
    
    @app.route('/sala/entrar', methods=['POST'])
    def entrarSala():
        data = request.get_json('data')
        nomeParticipante = data['nome']
        tokenSala = data['token']

        respo = participanteEntrarSala(nomeParticipante,tokenSala)

        return jsonify(respo)
    
    @app.route('/sala/visualizar/<token>', methods=['GET'])
    def visualizarSala(token):
        try:
            data = consultarSalaTokenDB(token)

            return render_template('painelSala.html',data=data)
        
        except Exception as e:
            print(e)