from app.rotas import *
from app.services.sortear import *
from app.services.database import *
from app.services.sessao import *

def registerSortear(app):
    
    @app.route('/sortear', methods=['POST'])
    def sortear():
        data = request.get_json('tokenSala')

        token = data['tokenSala']

        nomeSessao = f'sorteio-{token}'

        sorteio = buscarSessao(nomeSessao)

        if sorteio:
            msg = 'sorteio_ja_ocorreu'
            return jsonify({'msg':msg})

        else: 
            nomes = retornarNomeParticipanteDB(token)

            arrNomesParticipantes = [nome[0] for nome in nomes]

            nomesSortidos = sortearNomes(arrNomesParticipantes)

            data = {
                "token":token,
                "nomes":arrNomesParticipantes,
                "revelacao":nomesSortidos
            }

            if len(arrNomesParticipantes) < 2:
                msg = 'numero_participantes'
                dataNDB = {}
                return jsonify({"msg":msg, "data":dataNDB})

            if (adicionarSorteioNDB(data)):
                dataNDB = data

                # mudando o status da sala de oração
                result = fecharSala(token)

                if result:
                    criarSessao(nomeSessao,True)
                    msg = 'ok'

            
            else:
                msg = 'erro'

            return jsonify({"msg":msg, "data":dataNDB})