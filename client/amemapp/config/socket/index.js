import io from 'socket.io-client'
import { config } from '../constants'

const socket = io(
    `ws://${config.ip}:${config.port}`, {
        transports: 
        ['websocket'],
        autoConnect: true, 
    })

export default socket