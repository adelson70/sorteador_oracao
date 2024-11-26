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


# evento quando o cliente entra na sala de oração
# ira atualizar os membros da sala de oração
@socketio.on('entrar_sala_template')
def handle_entrar_sala_template(data):
    global CLIENTS_ADM

    nomeParticipante = data['nome'].upper()
    tokenSala = data['token']
    
    join_room(tokenSala)

    target_sid = CLIENTS_ADM[tokenSala]

    print(f'{nomeParticipante} entrou na sala {tokenSala}')

    emit('receber_nome', nomeParticipante, to=target_sid)

# evento de escuta quando ocorreu o sorteio com sucesso
@socketio.on('nomes_sorteados')
def handle_nomes_sorteados(data):
    data = data['data']

    room = data['token']
    nomeOracao = data['revelacao']

    emit('receber_nome_oracao', nomeOracao, to=room, include_self=True)