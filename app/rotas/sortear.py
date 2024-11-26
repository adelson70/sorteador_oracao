from app.rotas import *
from app.services.sortear import *
from app.services.database import *

def registerSortear(app):
    
    @app.route('/sortear', methods=['POST'])
    def sortear():

        data = request.get_json('tokenSala')

        token = data['tokenSala']

        nomes = retornarNomeParticipanteDB(token)

        arrNomesParticipantes = [nome[0] for nome in nomes]

        nomesSortidos = sortearNomes(arrNomesParticipantes)

        data = {
            "token":token,
            "nomes":arrNomesParticipantes,
            "revelacao":nomesSortidos
        }

        if (adicionarSorteioNDB(data)):
            msg = 'ok'
            dataNDB = data
        
        else:
            msg = 'erro'

        return jsonify({"msg":msg, "data":dataNDB})