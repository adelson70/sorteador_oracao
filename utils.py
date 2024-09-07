import secrets
from database import conectarDB
from flask import session
from random import shuffle, sample
from string import ascii_uppercase as letrasUP

# FUNÇÃO PARA GERAR UM TOKEN DA SESSÃO DO COOKIE
def gerar_secret_key():
    return secrets.token_hex(32)

# ADICIONAR NOME DE ORAÇÃO
def adicionarNomeDB(nome, tokenSala):
    try:
        data = {}
        conexao, cursor = conectarDB()
        msg = ''

        # CONSULTANDO PARA AVERIGUAR SE O NOME EM QUESTÃO NÃO ESTA EM USO
        cursor.execute('SELECT COUNT(nome) FROM pessoas WHERE nome=? AND id_token=?',(nome,tokenSala,))
        qtdNomes = cursor.fetchone()[0]
        
        # CASO O NOME NÃO ESTEJA EM USO
        if qtdNomes == 0:
            cursor.execute('INSERT INTO pessoas (nome,id_token) VALUES (?,?)',(nome,tokenSala,))
            conexao.commit()

            # SE O RETORNO FOR DE SUCESSO IRA GUARDAR O NOME DA PESSOA NO COOKIE DO NAVEGADOR
            guardarNomeCookie(nome)
            cadastrarNome() #USADO PARA VERIFICAR SE O USUARIO JÁ FEZ O CADASTRAMENTO DO SEU NOME NO INPUT E ENTROU NUMA SALA

            msg = 'success'
            data['token'] = tokenSala
        
        # CASO O NOME ESTEJA EM USO
        else:
            msg = 'nome_repetido'

        conexao.close()

        data['msg'] = msg

        return data

    except Exception as e:
        print(f'Função adicionarNome diz: {e}')

# FUNÇÃO PARA CRIAR UM COOKIE ONDE GUARDA O NOME DA PESSOA QUE INSERIU
def guardarNomeCookie(nome):
    session['meuNome'] = nome

# FUNÇÃO PARA BUSCAR O NOME DO USUARIO
def buscarMeuNome():
    meuNome = session.get('meuNome')
    return meuNome

# FUNÇÃO PARA CRIAR UM COOKIE ONDE ARMAZENA A INFORMAÇÃO DE QUE SE O USUARIO JÁ CADASTROU SEU NOME
def cadastrarNome():
    session['nomeCadastrado'] = True

# FUNÇÃO PARA BUSCAR O COOKIE COM O CADASTRO DO NOME
def validarNomeCadastrado():
    try:
        nomeFoiCadastrado = session.get('nomeCadastrado')

        msg = True if nomeFoiCadastrado == True else False

    except:
        msg = False

    return msg

# FUNÇÃO PARA BUSCAR TODOS OS NOMES CADASTRADOS E SORTEAR UM DIFERENTE DO PROPRIO USUARIO
def fSortearNome(token):
    conexao, cursor = conectarDB()

    query = cursor.execute('SELECT nome FROM pessoas WHERE id_token=?',(token,))
    nomes = query.fetchall()

    # LISTA DOS NOMES QUE SERÁ A CHAVE DO DICIONARIO
    listaNomes = [nome[0] for nome in nomes]

    # LISTA DOS NOMES QUE SERÁ O VALOR DO DICIONARIO
    listaEmbaralhada = []
    listaAux = listaNomes[:]
    for nome in listaNomes:
        shuffle(listaAux)

        # DEFININDO O NOME ALEATORIO A PARTIR DO PRIMEIRO INDICE DA LISTA EMBARALHADA
        nomeAleatorio = listaAux[0]

        # CASO O NOME ALEATORIO SEJA DIFERENTE DO NOME DO ORADOR E NÃO TENHA SIDO ESCOLHIDO AINDA
        if nomeAleatorio != nome and nomeAleatorio not in listaEmbaralhada:
            # ADICIONA NA LISTA DE NOMES QUE RECEBEM ORAÇÃO E REMOVE O MESMO DA LISTA AUXILIAR
            listaEmbaralhada.append(nomeAleatorio)
            listaAux.remove(nomeAleatorio)

        # SENÃO
        else:
            # CASO OS ÚNICOS NOMES QUE TENHAM SOBRADO SEJAM OS MESMO IRA CHAMAR A PROPRIA FUNÇÃO PARA FAZER UMA NOVA RANDOMIZAÇÃO
            if len(listaAux) == 1 and nomeAleatorio == nome:
                return fSortearNome()
            
            # CASO OS NOMES SEJAM IGUAIS OU O NOME ALEATORIO JA TENHA SIDO ESCOLHIDO
            while nomeAleatorio == nome or nomeAleatorio in listaEmbaralhada:
                shuffle(listaAux)
                nomeAleatorio = listaAux[0]
                
            # ADICIONA NA LISTA DE NOMES QUE RECEBEM ORAÇÃO E REMOVE O MESMO DA LISTA AUXILIAR
            listaEmbaralhada.append(nomeAleatorio)
            listaAux.remove(nomeAleatorio)

    # CRIANDO JSON
    # CHAVE SERA A PESSOA QUE ESTA ORANDO
    # VALOR SERA O NOME DA PESSOA QUE ESTA RECEBENDO A ORAÇÃO
    data = {nomeOrador:nomeOrado for nomeOrador, nomeOrado in zip(listaNomes,listaEmbaralhada)}

    conexao.close()

    return data

# FUNÇÃO PARA LIMPAR BANCO DE DADOS
def limparBancoDados():
    conexao, cursor = conectarDB()

    data = {}

    # CASO TENHA CONSEGUIDO LIMPAR O BANCO DE DADOS
    try:
        cursor.execute('DELETE FROM pessoas')
        conexao.commit()
        conexao.close()
        msg = 'success'

    # CASO NÃO TENHA LIMPADO O DB
    except Exception as e:
        print(f'função limparBancoDados diz: {e}')
        msg = 'error'

    data['msg'] = msg

    return data

# FUNÇÃO PARA LIMPAR O COOKIE DO USUARIO
def fLimparCookie(adm):
    data = {}

    if adm:
        data['msg'] = 'success'    
        return data

    try:
        session.clear()
        msg = 'success'

    except Exception as e:
        print(f'função flimparcookie diz: {e}')
        msg = 'error'

    data['msg'] = msg

    return data

# FUNÇÃO PARA VERIFICAR AUTENTICAÇÃO DE ADM
def verificarAuth():
    auth = session.get('auth')
    return auth

# FUNÇÃO PARA VERIFICAR O LOGGIN
def logginAuth(data):
    dataJSON = {}
    msg = 'error'

    # DESEMPACOTANDO VALORES RECEBINDOS DA REQUISIÇÃO
    username = data.get('username')
    password = data.get('password')

    # APENAS PARA TESTE
    if username == 'adelson' and password == 'teste':
        msg = 'success'
        session['auth'] = True

    # FORMATANDO RESPOSTA A REQUISIÇÃO
    dataJSON['msg'] = msg

    return dataJSON

# FUNÇÃO PARA GERAR O TOKEN PARA ACESSO A SALA DE ORAÇÃO
def gerarTokenSala():
    tokenList = sample(letrasUP, 6)
    token = "".join(tokenList)
    return token

# FUNÇÃO PARA CRIAR SALA DE ORAÇÃO E GERAR TOKEN
def criarSalaOracao(nomeSala):
    conexao, cursor = conectarDB()
    data = {}

    # PRIMEIRO GERA UM TOKEN E VERIFICA SE JÁ NÃO POSSUI NO BANCO DE DADOS
    token = gerarTokenSala()

    # VERIFICA SE O TOKEN JÁ EXISTE NO BANCO DE DADOS
    cursor.execute('SELECT COUNT(token) FROM salas WHERE token=?',(token,))

    busca = cursor.fetchone()[0]

    # CASO O TOKEN GERADO JÁ TENHA NA BASE DE DADOS SERÁ CHAMADO NOVAMENTE A FUNÇÃO PARA QUE POSSA GERAR OUTRO TOKEN
    if busca != 0:
        return criarSalaOracao(nomeSala)
    
    # CASO SEJA UM TOKEN VALIDO (UNICO)
    # IRA ADICIONAR NO DB AS INFOS
    cursor.execute('INSERT INTO salas (token,status,nome_sala) VALUES (?,?,?)',(token, 'on', nomeSala,))

    conexao.commit()

    conexao.close()

    data['token'] = token
    data['status'] = 'on'
    data['nome_sala'] = nomeSala

    return data 

# FUNÇÃO PARA CONSULTAR SE O TOKEN INSERIDO NO ACESSO A SALA EXISTE
def consultaToken(token):
    conexao, cursor = conectarDB()

    data = {}
    
    # VERIFICA SE O TOKEN INFORMADO FORA CRIADO NO DB
    cursor.execute('SELECT COUNT(token) FROM salas WHERE token=?',(token,))
    busca = cursor.fetchone()[0]

    # CASO O TOKEN INFORMADO EXISTA IRA VERIFICAR SE ELE ESTA EXPIRADO
    if busca == 1:
        # VERIFICA SE O TOKEN QUE ESTA NO DB ESTA ONLINE
        cursor.execute('SELECT status FROM salas WHERE token=?',(token,))
        busca = cursor.fetchone()[0]

        if busca == 'on':
            cursor.execute('SELECT token, nome_sala FROM salas WHERE token=?',(token,))

            token, nomeSala = cursor.fetchone()

            data['token'] = token
            data['nomeSala'] = nomeSala

            return data
        
        else:
            return False
    
    # CASO O TOKEN O INFORMADO NÃO EXISTA
    else:
        return False

    
# FUNÇÃO PARA RETORNAR O NOME DAS PESSOAS PARTICIPANTES DA SALA DE ORAÇÃO COM BASE NO TOKEN
def retornarNomes(token):
    conexao, cursor = conectarDB()
    
    data = {}

    # PRIMEIRO VERIFICA SE O TOKEN UTILIZADO FOI EXPIRADO
    cursor.execute('SELECT status FROM salas WHERE token=?',(token,))

    result = cursor.fetchone()[0]


    if result == 'on':
        cursor.execute('SELECT nome FROM pessoas WHERE id_token=?',(token,))

        result = cursor.fetchall()

        nomesParticipando = [nome[0].capitalize() for nome in result]

        data['msg'] = 'success'
        data['nomes'] = nomesParticipando

    else:
        data['msg'] = 'sala_expirada'

    conexao.close()

    return data