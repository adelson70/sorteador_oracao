import secrets
from database import conectarDB

# FUNÇÃO PARA GERAR UM TOKEN DA SESSÃO DO COOKIE
def gerar_secret_key():
    return secrets.token_hex(32)