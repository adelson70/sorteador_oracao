# buscando os modulos do init
from app.services import *
from app.services.database import *
from app.services.sessao import criarSessao

def participanteEntrarSala(nome,token):
    data = {'msg':None}
    respo = consultarNomeUso(nome,token)

    if respo == 0:
        inserirParticipanteDB(nome,token)
        criarSessao('userType','participante')
        criarSessao('tokenSala',token)
        criarSessao('meuNome',token)
        
        data['msg'] = 'ok'

    else:
        data['msg'] = 'nome_em_uso'

    return data

def retornarNomesParticipantes(tokenSala):
    nomes = retornarNomeParticipanteDB(tokenSala)

    arrNomes = [nome[0].upper() for nome in nomes]

    return arrNomes