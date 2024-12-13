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

import { ip, port } from '../../../../constants.json'

const host = `${ip}:${port}`

export const socket = io.connect(host)