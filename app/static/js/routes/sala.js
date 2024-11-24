// requisição para acessar a sala primeiro passo
export async function acessarSala(token){
    // requisição para acessar a sala
    var response = await axios.post(`/sala/acessar/${token}`)

    // obtendo resposta do servidor
    var data = response.data

    return data
}

// requisição para entrar de fato na sala
export async function entrarSala(nome,token) {
    
    var response = await axios.post('/sala/entrar',{nome:nome, token:token})

    var data = response.data

    return data
}

// requisição para criar sala de oração
export async function criarSala(data) {
    
    var response = await axios.post('/sala/criar',{data:data})

    var data = response.data

    return data
}

// requisição para carregar todas as salas pertencentes ao usuario

export async function carregarSalas(idUsuario,params=null) {

    var response = await axios.get(`/sala/carregar`,{params:{idUsuario:idUsuario,params:params}})

    var data = response.data

    return data
}

// requisição para "deletar" sala de oração
export async function deletarSala(tokenSala) {
    
    var response = await axios.delete('/sala/remover', {data:{tokenSala:tokenSala}})

    var data = response.data

    return data
}

// requisição para visulizar painel da sala de oração
export async function visualizarSala(tokenSala) {

    var response = await axios.get('/sala/visualizar', {params:{tokenSala:tokenSala}})

    var data = response.data

    return data
    
}