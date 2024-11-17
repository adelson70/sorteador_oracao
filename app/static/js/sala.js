// requisição para acessar a sala
async function acessarSala(token){
    // requisição para acessar a sala
    const response = await axios.post(`sala/acessar/${token}`)

    // obtendo resposta do servidor
    const data = response.data

    return data
}