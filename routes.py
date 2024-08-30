from flask import render_template, session, redirect, url_for, jsonify, request
from utils import *

nomesSorteados = {}

def configure_app(app):

    # ROTA PRINCIPAL
    @app.route('/', methods=['POST','GET'])
    def main():
        nomeJaCadastrado = validarNomeCadastrado()

        if nomeJaCadastrado:
            return render_template('sortearNome.html', nomeCadastrado=True)
        
        return render_template('sortearNome.html')
    
    # ROTA DO ADM ONDE IRA SORTEAR O NOME
    @app.route('/admin/<token>')
    def admin(token):
        try:
            # CASO O TOKEN SEJA ESSE IRA ABRIR O TEMPLATE DE ADMIN
            if token == '211121':
                return render_template('adm.html')
            
            # SE INSERIR UM TOKEN ERRADO IRA VOLTAR PARA A PAGINA INICIAL
            else:
                return redirect(url_for('main'))
        
        # CASO TENTE ACESSAR A PAGINA DE ADMIN SEM COLOCAR O TOKEN
        except:
            return render_template('page_not_found.html')
    
    # ROTA PARA ADICIONAR O NOME AO DB
    @app.route('/adicionarNome', methods=['POST'])
    def adicionarNome():
        nomeJaCadastrado = validarNomeCadastrado()

        if nomeJaCadastrado:
            return jsonify({'msg':'success'})
        
        # RECEBENDO DADOS EM FORMATO JSON (DICIONARO PARA O PYTHON)
        data = request.json

        # OBTENDO APENAS O NOME INSERIDO NO INPUT
        nome = data.get('nomeOracao')

        # RECEBENDO RETORNO DA FUNÇÃO QUE SERA UMA MENSAGEM
        msg = adicionarNomeDB(nome)
        response = {'msg': msg}

        return jsonify(response)
    
    # ROTA PARA SORTEAR O NOME DA PESSOA
    @app.route('/sortearNomes', methods=['GET'])
    def sortearNomes():
        global nomesSorteados
        nomesSorteados = fSortearNome()
        return 'success'
    
    # ROTA PARA BUSCAR O NOME DA PESSOA DE ORAÇÃO DO RESPECTIVO USUARIO
    @app.route('/pessoaOracao', methods=['GET'])
    def pessoaOracao():
        global nomesSorteados

        # BUSCANDO O NOME DO USUARIO
        meuNome = buscarMeuNome()

        # RETORNANDO O NOME DA PESSOA DE ORAÇÃO DO USUARIO
        pessoaOracao = nomesSorteados[meuNome]

        # GUARDANDO VALORES NO DICIONARIO
        data = {'meuNome':meuNome,
                'pessoaOracao':pessoaOracao}

        return jsonify(data)
    
    # ROTA DE TRATAMENTO DO ERRO 404
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('page_not_found.html'), 404