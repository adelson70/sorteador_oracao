import io from 'socket.io-client'
import { config } from '../constants'

const socket = io(
    config.url, {
        transports: 
        ['websocket'],
        autoConnect: true, 
    })

export default socket