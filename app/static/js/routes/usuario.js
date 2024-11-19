export async function loginAdm(nome,senha) {
    var response = await axios.post('/usuario/login',{nome:nome,senha:senha})

    var data = response.data

    return data
}