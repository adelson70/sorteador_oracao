import io from 'socket.io-client'

const socket = io(
    'ws://192.168.10.23:5000', {
        transports: 
        ['websocket'],
        autoConnect: true, 
    })

export default socket