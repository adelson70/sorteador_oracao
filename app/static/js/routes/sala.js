// requisição para acessar a sala primeiro passo
export async function acessarSala(token){
    // requisição para acessar a sala
    var response = await axios.post(`sala/acessar/${token}`)

    // obtendo resposta do servidor
    var data = response.data

    return data
}

// requisição para entrar de fato na sala
export async function entrarSala(nome,token) {
    
    var response = await axios.post('participante/entrarSala',{nome:nome, token:token})

    var data = response.data

    return data
}

// requisição para criar sala de oração
export async function criarSala(data) {
    
    var response = await axios.post('sala/criar',{data:data})

    var data = response.data

    return data
}