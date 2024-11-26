from app.rotas import *
from app.services.sessao import *
from app.services.sala import consultarSalaTokenDB

def registerMain(app):

    @app.route('/', methods=['POST','GET'])
    def main():
        userType = buscarSessao('userType')

        if userType == 'participante':
            meuNome = buscarSessao('meuNome')
            tokenSala = buscarSessao('tokenSala')
            
            data = consultarSalaTokenDB(tokenSala)

            nomeSala = data['nome'].capitalize()

            return render_template("aguardandoSorteio.html",nomeSala=nomeSala, meuNome=meuNome, tokenSala=tokenSala)

        criarSessao("nomeSorteado")
        
        return render_template("acessoTokenInput.html")
    
    @app.errorhandler(404)
    def notfound(e):
        return render_template('paginaNaoEncontrada.html'), 404
