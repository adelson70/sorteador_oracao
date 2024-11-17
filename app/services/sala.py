# buscando os modulos do init
from app.services import *
from app.services.database import *

def entrarSala(token):
    
    data = {'msg':None}

    respo = salaExistsDB(token)

    # caso o token de acesso não exista no db
    if respo[0] == 0:
        data['msg'] = 'sala_nao_existe'

    # se o token existir
    # verifica se atingiu o limite
    else:
        limiteSala = respo[1]

        respo = consultarLimiteSalaDB(token)

        if limiteSala == respo:
            data['msg'] = 'limite_atingido'

        else:
            data['msg'] = 'ok'

    return data

def consultarSalaTokenDB(token):
    data = {}

    result = consultarSalaDBToken(token)
    
    data['idSala'] = result[0]
    data['token'] = result[1]
    data['nome'] = result[2]
    data['limite'] = result[3]
    data['dataCriacao'] = result[4]
    data['dataRevelacao'] = result[5]
    data['link'] = result[6]
    data['status'] = result[7]
    data['estado'] = result[8]
    data['idUsuario'] = result[9]
    
    return data