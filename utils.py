import secrets
from database import conectarDB

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