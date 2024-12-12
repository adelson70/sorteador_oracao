import { API_URL } from "../constants"
import io from 'socket.io-client'

const socket = io(
    'ws://10.29.0.111:5000', {
        transports: 
        ['websocket'],
        autoConnect: true, 
    })

export default socket