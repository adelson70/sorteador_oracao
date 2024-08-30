from flask import render_template, session, redirect, url_for, jsonify, request
from utils import *

def configure_app(app):

    # ROTA PRINCIPAL
    @app.route('/', methods=['POST','GET'])
    def main():
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
        # RECEBENDO DADOS EM FORMATO JSON (DICIONARO PARA O PYTHON)
        data = request.json

        # OBTENDO APENAS O NOME INSERIDO NO INPUT
        nome = data.get('nomeOracao')

        # RECEBENDO RETORNO DA FUNÇÃO QUE SERA UMA MENSAGEM
        msg = adicionarNomeDB(nome)
        response = {'msg': msg}

        # SE O RETORNO FOR DE SUCESSO IRA GUARDAR O NOME DA PESSOA NO COOKIE DO NAVEGADOR
        guardarNomeCookie(nome) if msg == 'success' else None

        return jsonify(response)
    
    # ROTA DE TRATAMENTO DO ERRO 404
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('page_not_found.html'), 404