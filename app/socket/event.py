from app.socket import *
from app import socketio
from flask import request
from app.services.sessao import *

CLIENTS_ADM = {}

# evento quando o cliente ADM se conecta na sala
@socketio.on('connectROOM')
def handle_connect(data):
    global CLIENTS_ADM

    sid_adm = request.sid

    token = data['tokenSala']

    CLIENTS_ADM[token] = sid_adm

    join_room(token)

    print(f'ADM entrou na sala {token}')

@socketio.on('entrar_sala_mobile')
def handle_entrar_sala_mobile(data):
    global CLIENTS_ADM

    nomeParticipante = data['nome'].upper()
    tokenSala = data['token']
    target_sid = CLIENTS_ADM[tokenSala]

    print(f'{nomeParticipante} entrou na sala {tokenSala}')

    join_room(tokenSala)

    emit('receber_nome', nomeParticipante, to=target_sid)


# evento quando o cliente entra na sala de oração
# ira atualizar os membros da sala de oração
@socketio.on('entrar_sala_template')
def handle_entrar_sala_template(data):
    global CLIENTS_ADM

    nomeParticipante = data['nome'].upper()
    tokenSala = data['token']
    jaEntrou = data['entrou']

    print('cheguei aqui',data) 

    if jaEntrou:
        join_room(tokenSala)

        print(f'{nomeParticipante} entrou na sala novamente {tokenSala}')
    
    else:
        join_room(tokenSala)

        try:
            target_sid = CLIENTS_ADM[tokenSala]
            
            print(f'{nomeParticipante} entrou na sala {tokenSala}')

            emit('receber_nome', nomeParticipante, to=target_sid)

        except Exception as e:
            print(f'ADM não entrou na sala {tokenSala}')


# evento de escuta quando ocorreu o sorteio com sucesso
@socketio.on('nomes_sorteados')
def handle_nomes_sorteados(data):
    data = data['data']

    room = data['token']
    nomeOracao = data['revelacao']

    emit('receber_nome_oracao', nomeOracao, to=room, include_self=False)