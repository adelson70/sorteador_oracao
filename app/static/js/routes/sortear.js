export async function sortear(tokenSala) {

    var response = await axios.post('/sortear', {tokenSala:tokenSala})

    var data = response.data

    return data
    
}