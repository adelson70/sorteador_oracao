import "../js/routes/sala.js"
import "../js/routes/usuario.js"
import "../js/routes/participante.js"
import "../js/routes/sortear.js"

import '../js/services/main.js'
import '../js/services/participante.js'
import '../js/services/sortear.js'
import '../js/services/token.js'
import '../js/services/usuario.js'
import "../js/services/sala.js"


const serverIP = '192.168.10.21'
const porta = '5000'

const host = `${serverIP}:${porta}`

export const socket = io.connect(host)