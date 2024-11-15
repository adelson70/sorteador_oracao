# buscando os modulos do init
from flask import session
from app.services import *

# session.get('nomeSessao')

# criar sessao caso não haja nada
def criarSessao(nomeSessao, valorAtribuido=None):
    try:
        valor = session.get(nomeSessao)

        if valor == None and valorAtribuido == None:
            session[nomeSessao] = False

        elif valor == None and valorAtribuido != None:
            session[nomeSessao] = valorAtribuido


    except Exception as e:
        print(f'erro ao criar sessao "{nomeSessao}": ', e)

# editar sessao
def editarSessao(nomeSessao, novoValor):
    try:
        valor = session.get(nomeSessao)

        if valor == novoValor:
            print('valores iguais o que você pretende fazer meu querido!')

        elif valor == None:
            print('sessao não foi criada!')

        else:
            session[nomeSessao] = novoValor

    except Exception as e:
        print(f'erro ao editar a sessao "{nomeSessao}": ',e)