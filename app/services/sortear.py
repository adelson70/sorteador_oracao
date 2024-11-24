# buscando os modulos do init
from app.services import *
from random import shuffle

def sortearNomes(arrNomes):
    meuNome = arrNomes

    nomesSortidos = meuNome.copy()

    shuffle(nomesSortidos)

    for original, sortido in zip(meuNome,nomesSortidos):
        if original == sortido:
            return sortearNomes(arrNomes)
        
    data = {nome:nomeSorteado for nome,nomeSorteado in zip(meuNome,nomesSortidos) }

    return (meuNome,nomesSortidos,data)