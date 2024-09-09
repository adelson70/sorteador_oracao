from flask import render_template, session, redirect, url_for, jsonify, request, json
from utils import *
from flask_socketio import emit, join_room, leave_room

nomesSorteados = {}

def configure_app(app, socketio):

    # ROTA PRINCIPAL
    @app.route('/', methods=['POST','GET'])
    def main():
        nomeJaCadastrado = validarNomeCadastrado()

        if nomeJaCadastrado:
            return render_template('sortearNome.html', nomeCadastrado=True)
        
        return render_template('sortearNome.html')
    
    # ROTA DO ADM ONDE IRA SORTEAR O NOME
    @app.route('/admin')
    def admin():
        try:
            auth = verificarAuth()
            logged=False

            if auth:
                logged = True
            
            return render_template('adm.html', logged=logged)
        
        # CASO TENTE ACESSAR A PAGINA DE ADMIN SEM COLOCAR O TOKEN
        except Exception as e:
            print(e)
            return render_template('page_not_found.html')
        
    # ROTA DE LOGIN
    @app.route('/loggin/<data>', methods=['GET'])
    def loggin(data):
        # TRATANDO O RECEBIMENTO DA REQUISIÇÃO
        data = json.loads(data)

        msg = logginAuth(data)

        if msg == 'success':
            return redirect(url_for('adm'))

        else:
            return jsonify(msg)
        
    # ROTA PARA SAIR DO MODO ADM
    @app.route('/exitAdm', methods=['POST'])
    def exitAdm():
        session.clear()
        return redirect(url_for('admin'))
    
    # ROTA PARA ADICIONAR O NOME AO DB
    @app.route('/adicionarNome', methods=['POST'])
    def adicionarNome():
        nomeJaCadastrado = validarNomeCadastrado()

        if nomeJaCadastrado:
            return jsonify({'msg':'success'})
        
        # RECEBENDO DADOS EM FORMATO JSON (DICIONARO PARA O PYTHON)
        data = request.json

        # OBTENDO O NOME INSERIDO NO INPUT
        nome = data.get('nomeOracao')
        # OBTENDO O TOKEN INSERIDO NO INPUT
        token_sugerido = data.get('token')

        # CONSULTA SE O TOKEN INFORMADO NO INPUT É VALIDO
        tokenValido = consultaToken(token_sugerido)

        # CASO SEJA UM DICIONARIO
        if tokenValido != False:
            tokenSala = tokenValido['token']
            # RECEBENDO RETORNO DA FUNÇÃO QUE SERA UMA MENSAGEM
            response = adicionarNomeDB(nome, tokenSala)
            
        else:
            response = {'msg': 'token_invalido'}

        return jsonify(response)
    
    # ROTA PARA LIMPAR BANCO DE DADOS
    # QUANDO ACIONADO ELE LIMPA OS COOKIES DE TODOS CONECTADOS AO SITE
    @app.route('/limparDB/<token>',methods=['DELETE'])
    def limparDB(token):
        # CASO TENHA ACESSO ADM PARA FAZER A ALTERAÇÃO
        if token == '211121':
            msg = limparBancoDados()

            return jsonify(msg)

        # CASO NÃO TENHA IRA RETORNAR PARA PAGINA PRINCIPAL
        else:
            return redirect(url_for('main'))
        
    # ROTA PARA CRIAR SALA DE ORAÇÃO
    # DEVE GERAR UM TOKEN, SALVAR NO DB
    @app.route('/criarSala', methods=['POST'])
    def criarSala():
        if verificarAuth():
            data = request.get_json()
            nomeSala = data.get('nomeSala')

            msg = criarSalaOracao(nomeSala)

            # CRIANDO UMA SESSÃO INFORMANDO QUE A SALA FORA GERADO COM SUCESSO
            session['salaOracao'] = True
            session['infosSala'] = msg

            return msg

        else:
            return redirect(url_for('admin'))
    
    # ROTA PARA BUSCAR O NOME DA PESSOA DE ORAÇÃO DO RESPECTIVO USUARIO
    @app.route('/pessoaOracao/<data>', methods=['GET'])
    def pessoaOracao(data):

        try:    
            # BUSCANDO O NOME DO USUARIO
            meuNome = buscarMeuNome()

            # RECEBENDO ARR E DEIXANDO EM DICIONARIO
            data = json.loads(data)

            pessoaOracaoNome = data[meuNome].lower()

            # GUARDANDO VALORES NO DICIONARIO
            data = {'meuNome':meuNome,
                    'pessoaOracao':pessoaOracaoNome.capitalize()}
            
        except:
            data = {'msg':'nomes_sorteados'}

        return jsonify(data)
    
    # ROTA GET PARA VERIFICAR O NOME DAS PESSOAS QUE ESTÃO PARTICIPANDO DA RESPECTIVA SALA DE ORAÇÃO
    @app.route('/getNomesSala/<tokenSala>')
    def getNomesSala(tokenSala):

        msg = retornarNomes(tokenSala)

        return jsonify(msg)

    
    # RECEBE A LISTA E ENVIA O NOME PARA OS CLIENTES
    @socketio.on('enviar_nome')
    def send_name_handler(token):
        global nomesSorteados

        # BUSCANDO NOME DE TODOS QUE SE CADASTRARAM
        nomesSorteados = fSortearNome(token)

        if nomesSorteados == None:
            data = {'msg':'none'}

        else:
            # FUNÇÃO PARA QUE APÓS O SORTEIO A SALA FIQUE OFFLINE
            desativarSala(token)

            data = nomesSorteados
        
        # MENSAGEM PARA TODOS OS CLIENTES
        emit('receber_nome', data, broadcast=True)

    # EVENTO SOCKET PARA ENVIAR O NOME DA PESSOA CADASTRADA NA RESPECTIVA SALA PARA O RESPECTIVO ADM
    @socketio.on('nomePessoaCadastrada')
    def send_name_people_ak(infoNome):
        data = infoNome

        emit('receber_nome_pessoa_cadastrada', data, broadcast=True)

    # EVENTO SOCKET PARA LIMPAR O COOKIE DAS PESSOAS LOGADAS AO SITE APÓS TER LIMPADO O BANCO DE DADOS
    @socketio.on('limpar_cookie')
    def erase_cookie_handler(data):
        emit('erase_cookie_now', data, broadcast=True)

    # ROTA PARA LIMPAR O COOKIE (APENAS O NOME QUE ESTAVA CADASTRADO)
    @app.route('/limparCookie', methods=['DELETE'])
    def limparCookie():
        adm = verificarAuth()
        msg = fLimparCookie(adm)
        return jsonify(msg)
    
    # EVENTO SOCKET PARA ENCAMINHAR OS NOMES PARTICIPANTES
    @socketio.on('enviar_nome_participante')
    def sendNameParty(data):
        emit('')
    
    # ROTA DE TRATAMENTO DO ERRO 404
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('page_not_found.html'), 404
    
    # ROTA PARA REQUISIÇÃO BUSCAR UMA SESSÃO EM ESPECIFICO
    @app.route('/getSession/<nomeSessao>')
    def getSession(nomeSessao):
        data = {}

        sessao = session.get(nomeSessao)

        if sessao == None:
            sessao = False

        data[nomeSessao] = sessao

        return jsonify(data)