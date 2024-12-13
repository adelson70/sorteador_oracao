# buscando os modulos do init
from app.services import *
from app.services.database import *
from app.services.token import *
from app.services.sessao import *
from app import buscarIP

def fentrarSala(token):
    
    data = {'msg':None}

    respo = salaExistsDB(token)

    existeSala = True if respo[0] == 1 else False
    limiteSala = respo[1]
    statusSala = respo[2]

    # caso o token de acesso não exista no db
    if existeSala == False:
        data['msg'] = 'sala_nao_existe'

    # caso a sala esteja fechada
    elif existeSala and statusSala == 'Fechada':
        data['msg'] = 'sala_fechada'

    # se o token existir
    # verifica se atingiu o limite
    else:
        respo = consultarLimiteSalaDB(token)

        if limiteSala == respo:
            data['msg'] = 'limite_atingido'

        else:
            data['msg'] = 'ok'

    return data

def fcriarSala(data):
    idUsuario = buscarSessao('idAdm')
    nomeSala = data['nomeSala']

    respo = consultarNomeSala(nomeSala,idUsuario)

    if respo == 1:
        return {'msg':'sala_existente'}

    else:
        limiteSala = data['limiteSala']
        dataRevelacao = data['dataRevelacao']

        dataCriacao = horario()
        token = gerarToken()
        serverIP, portIP = buscarIP()
        link = f'http://{serverIP}:{portIP}/sala/acess/{token}'
        
        if gerarQRrcode(token,link):
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

        else:
            return {'msg':'error'}


def consultarSalaTokenDB(token):
    data = {}

    token = token.upper()

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

def retornarSalasCriadas(idUsuario,params):
    data = []

    salas = consultarSalaDB(idUsuario,params)

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