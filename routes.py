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
            if token == '211121':
                return render_template('adm.html')
            
            else:
                return redirect(url_for('main'))
            
        except:
            return render_template('page_not_found.html')
    
    # ROTA PARA ADICIONAR O NOME AO DB
    @app.route('/adicionarNome', methods=['POST'])
    def adicionarNome():
        # RECEBENDO DADOS EM FORMATO JSON (DICIONARO PARA O PYTHON)
        data = request.json

        # OBTENDO APENAS O NOME INSERIDO NO INPUT
        nome = data.get('nomeOracao')

        msg = adicionarNomeDB(nome)
        
        response = {'msg': msg}

        guardarNomeCookie(nome) if msg == 'success' else None

        return jsonify(response)
    
    # ROTA DE TRATAMENTO DO ERRO 404
    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('page_not_found.html'), 404