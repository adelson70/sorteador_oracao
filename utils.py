import secrets
from database import conectarDB
from flask import session
from random import shuffle

# FUNÇÃO PARA GERAR UM TOKEN DA SESSÃO DO COOKIE
def gerar_secret_key():
    return secrets.token_hex(32)

# ADICIONAR NOME DE ORAÇÃO
def adicionarNomeDB(nome):
    try:
        conexao, cursor = conectarDB()
        msg = ''

        # CONSULTANDO PARA AVERIGUAR SE O NOME EM QUESTÃO NÃO ESTA EM USO
        cursor.execute('SELECT COUNT(nome) FROM pessoas WHERE nome=?',(nome,))
        qtdNomes = cursor.fetchone()[0]
        
        # CASO O NOME NÃO ESTEJA EM USO
        if qtdNomes == 0:
            cursor.execute('INSERT INTO pessoas (nome) VALUES (?)',(nome,))
            conexao.commit()
            # SE O RETORNO FOR DE SUCESSO IRA GUARDAR O NOME DA PESSOA NO COOKIE DO NAVEGADOR
            guardarNomeCookie(nome)
            cadastrarNome() #USADO PARA VERIFICAR SE O USUARIO JÁ FEZ O CADASTRAMENTO DO SEU NOME NO INPUT
            msg = 'success'
        
        # CASO O NOME ESTEJA EM USO
        else:
            msg = 'nome_repetido'

        conexao.close()

        return msg

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
def fSortearNome():
    conexao, cursor = conectarDB()

    query = cursor.execute('SELECT nome FROM pessoas')
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