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

let host
let ip
let port

fetch('/static/js/constants.json')
    .then((response) => {
        if (!response.ok){
            console.log('Erro ao carregar JSON')
        }
        return response.json()
    })
    .then((data) => {
        ip = data.ip
        port = data.port

        host = `${ip}:${port}`        
    })

export const socket = io.connect(host)
export const config = {
    ip: ip,
    port: port
}