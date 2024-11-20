// importando rotas
import { carregarSalas, criarSala } from '../routes/sala.js'
import { loginAdm } from '../routes/usuario.js'

// evento para quando carregar todo o DOM

addEventListener('DOMContentLoaded', function(){
    var idUsuario = document.getElementById('idAdm').value
    carregarSalas(idUsuario).then(response => {
        var data = response

        console.log(data)
    })
})

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
            var data = response.msg
    
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

    else if (valorNumerico < 2){
        alert('Limite minimo é de 2 participantes!')
    }
})

// evento para quando clicar no botão de criar sala
const eleBtnCriarSala = document.getElementById('btnCriarSala')
eleBtnCriarSala?.addEventListener('click', function(){
    var data = {}
    var nomeSala = document.getElementById('nomeSala').value
    var dataRevelacao = document.getElementById('dataRevelacao').value
    const [dia, mes, ano] = dataRevelacao.split('-')
    const dataFormatada = `${dia}/${mes}/${ano}`

    var limiteSala = document.getElementById('limiteSala').value

    data = {
        nomeSala:nomeSala,
        dataRevelacao:dataFormatada,
        limiteSala:limiteSala
    }

    criarSala(data).then(response => {
        var msg = response.msg

        switch (msg) {
            case 'ok':
                alert('Sala criada com sucesso!')
                window.location.reload
                break;
        
            case 'sala_existente':
                alert(`Nome da sala "${nomeSala}" já existe!`)
                document.getElementById('nomeSala').value = ''
                break;
        }
    
    })
})