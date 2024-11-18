const eleNomeUsuario = document.getElementById('nomeUsuario')
const eleSenhaUsuario = document.getElementById('senhaUsuario')

const eleBtnEntrar = document.getElementById('acessoAdm')

eleBtnEntrar?.addEventListener('click', function(){
    var nomeUsuario = eleNomeUsuario.value
    var senhaUsuario = eleSenhaUsuario.value

    if (nomeUsuario.length == 0 || senhaUsuario.length == 0){
        alert('Preencha todos os campos!')
    }

    else{
        loginAdm(nomeUsuario,senhaUsuario).then(response => {
            data = response.msg
    
            switch (data) {
                case 'ok':
                    console.log('usuario encontrado')
                    window.location.reload()
                    break;
            
                case 'usuario_nao_encontrado':
                    alert('Usuario não encontrado!')
            }
        })
    }
})

async function loginAdm(nome,senha) {
    var response = await axios.post('/usuario/login',{nome:nome,senha:senha})

    var data = response.data

    return data
}