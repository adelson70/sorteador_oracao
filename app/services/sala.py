# buscando os modulos do init
from app.services import *
from app.services.database import *
from app.services.token import *
from app.services.sessao import *

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

def fcriarSala(data):
    nomeSala = data['nomeSala']

    respo = consultarNomeSala(nomeSala)

    if respo == 1:
        return {'msg':'sala_existente'}

    else:
        limiteSala = data['limiteSala']
        dataRevelacao = data['dataRevelacao']
        idUsuario = buscarSessao('idAdm')

        dataCriacao = horario()
        token = gerarToken()
        link = None
        
        respo = criarSalaDB(
            token,
            nomeSala,
            limiteSala,
            dataCriacao,
            dataRevelacao,
            link,
            'Aberta',
            'ativo',
            idUsuario
        )

        return {'msg':'ok'}

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

def retornarSalasCriadas(idUsuario):
    data = []

    salas = consultarSalaDB(idUsuario)

    # tratando os dados que estão assim
    # [(""),("")]
    # ficarao assim
    # [{},{}]

    for sala in salas:
        temp = {}
        # desempacotando as informações
        idSala, tokenSala, nomeSala, limiteSala, dataCriacao, dataRevelacao, link, status, estado, idUsuarioAdm = sala

        temp['idSala'] = idSala
        temp['tokenSala'] = tokenSala
        temp['nomeSala'] = nomeSala
        temp['limiteSala'] = limiteSala
        temp['dataCriacao'] = dataCriacao
        temp['dataRevelacao'] = dataRevelacao
        temp['link'] = link
        temp['status'] = status
        temp['estado'] = estado
        temp['idUsuarioAdm'] = idUsuarioAdm

        data.append(temp)

    return data

def fdeletarSala(token):
    respo = deleteSalaDB(token)
    if respo:
        return {'msg':'ok'}
    
    else:
        return {'msg':'error'}