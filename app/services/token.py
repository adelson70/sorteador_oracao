# buscando os modulos do init
from app.services import *
from app.services.database import consultarSalaDBToken
from datetime import datetime
from string import ascii_uppercase as upp
from random import sample


def horario():
    horarioCompleto = datetime.now()
    dia = horarioCompleto.day
    mes = horarioCompleto.month
    ano = horarioCompleto.year

    data = f"{dia:02}/{mes:02}/{ano}"

    return data

def gerarToken():
    token = "".join(sample(upp,6))
    result = consultarSalaDBToken(token)

    if len(result) == 0:
        return token
    
    else:
        return gerarToken()