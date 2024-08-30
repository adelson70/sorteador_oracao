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

        cursor.execute('INSERT INTO pessoas (nome) VALUES (?)',(nome,))

        conexao.commit()

        return 'success'

    except Exception as e:
        print(f'Função adicionarNome diz: {e}')

# FUNÇÃO PARA CRIAR UM COOKIE ONDE GUARDA O NOME DA PESSOA QUE INSERIU
def guardarNomeCookie(nome):
    session['meuNome'] = nome

# FUNÇÃO PARA BUSCAR O NOME DO USUARIO
def buscarMeuNome():
    meuNome = session.get('meuNome')
    return meuNome

# FUNÇÃO PARA DEFINIR O NOME DA PESSOA QUE O USUARIO IRA ORAR
def definirPessoaOracao(nomePessoaOracao):
    session['pessoaOracao'] = nomePessoaOracao

# FUNÇÃO PARA BUSCAR O NOME DA PESSOA QUE ESTA RECEBENDO A ORAÇÃO
def buscarNomePessoaOracao():
    nomePessoaOracao = session.get('pessoaOracao')
    return nomePessoaOracao

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

    return data
