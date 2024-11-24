from app import *
import socket

app = createApp()

if __name__ == '__main__':
    serverIp = '192.168.10.20'

    print(f'IP do Servidor: {serverIp}')
    socketio.run(app, port=5000, debug=True, host=serverIp)