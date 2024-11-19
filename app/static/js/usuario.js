// evento quando clica em entrar
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

// evento quando clica em criar sala
const eleCriarSala = document.getElementById('criarSala')
eleCriarSala?.addEventListener('click', function(){
    const modalCriarSala = new bootstrap.Modal(document.getElementById('modalCriarSala'))
    modalCriarSala.show()
})

// evento para quando digitar o limite da sala de oração a ser criada
const eleLimiteSala = document.getElementById('limiteSala')
eleLimiteSala?.addEventListener('input', function(e){
    const valorFormatado = e.target.value.replace(/[^0-9]/g, '')

    e.target.value = valorFormatado

    var valorNumerico = Number(valorFormatado)

    if (valorNumerico > 31){
        e.target.value = 30
    }
    // token, nome, limite, dataCriacao, dataRevelacao, link, status, estado, idUsuario
})

// evento para quando clicar no botão de criar sala
const eleBtnCriarSala = document.getElementById('btnCriarSala')
eleBtnCriarSala?.addEventListener('click', function(){
    console.log('criar sala!')
})