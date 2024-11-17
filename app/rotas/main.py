from app.rotas import *
from app.services.sessao import *

def registerMain(app):

    @app.route('/', methods=['POST','GET'])
    def main():
        criarSessao("loginADM")
        criarSessao("participante")
        criarSessao("nomeSorteado")
        
        return render_template("acessoTokenInput.html")