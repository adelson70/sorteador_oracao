from app.rotas import *
from app.services.sessao import *

def registerMain(app):

    @app.route('/')
    def main():
        criarSessao("loginADM")
        criarSessao("participante")
        criarSessao("nomeSorteado")
        
        return 'ola mundo'