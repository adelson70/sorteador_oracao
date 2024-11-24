// requisição para retornar os participantes da sala expecifica
export async function retornarParticipantes(tokenSala) {

    var response = axios.get('/participante/buscar', {params:{tokenSala:tokenSala}})

    return response
    
}