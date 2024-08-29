from flask import render_template, session, redirect, url_for, jsonify, request
from utils import *

def configure_app(app):

    # ROTA PRINCIPAL
    @app.route('/', methods=['POST','GET'])
    def main():
        return render_template('index.html')
    
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