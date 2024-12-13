# buscando os modulos do init
import qrcode.constants
from app.services import *
from app.services.database import consultarSalaDBToken
from datetime import datetime
from string import ascii_uppercase as upp
from random import sample
import qrcode
from os import name

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

    if result == None:
        return token
    
    else:
        return gerarToken()
    
def gerarQRrcode(token,url):
    try:
        qr = qrcode.QRCode(
            version=20,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4
        )

        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill_color='black', back_color='white')

        nome_arquivo = f'{token}.png'

        # verificando sistema operacional
        if name == 'nt':
            path = f'sorteador_oracao/app/static/images/{nome_arquivo}'

        else:
            path = f'app/static/images/{nome_arquivo}'


        img.save(path)

        return True

    except Exception as e:
        print(f'Erro ao criar o qrcode: {e}')
        return False