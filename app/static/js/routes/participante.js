// requisição para retornar os participantes da sala expecifica
export async function retornarParticipantes(tokenSala) {

    var response = axios.get('/participante/buscar', {params:{tokenSala:tokenSala}})

    return response
    
}

// requisição para retornar a pessoa de oração
export async function retornarAmigoSecreto(meuNome, tokenSala) {

    var response = axios.get('/participante/retornarAmigo', {params:{meuNome:meuNome,tokenSala:tokenSala}})

    return response
    
}