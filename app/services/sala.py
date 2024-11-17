# buscando os modulos do init
from app.services import *
from app.services.database import *

def verificarSalaExistente(token):
    
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