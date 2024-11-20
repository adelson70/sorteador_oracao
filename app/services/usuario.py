# importando modulos do init
from app.services import *
from app.services.database import consultarUsuario

def verificarLogin(nome,senha):
    respo = consultarUsuario(nome,senha)

    auth, id = respo

    return (auth,id)