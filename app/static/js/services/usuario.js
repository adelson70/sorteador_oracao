// importando rotas
import { carregarSalas, criarSala, deletarSala } from '../routes/sala.js'
import { loginAdm } from '../routes/usuario.js'

// evento para quando carregar todo o DOM buscar as salas criadas suas respectivas informações
addEventListener('DOMContentLoaded', function(){
    var idUsuario = document.getElementById('idAdm').value
    carregarSalas(idUsuario).then(response => {
        var data = response

        const tabela = this.document.getElementById('tabela').querySelector('tbody')
        
        // função para incrementar linha da tabela
        function incrementarLinha(data){
            var novaLinha = tabela.insertRow()
           
            var celulaNome = novaLinha.insertCell()
            var celulaToken = novaLinha.insertCell()
            var celulaDataCriacao = novaLinha.insertCell()
            var celulaDataRevelacao = novaLinha.insertCell()
            var celulaLimite = novaLinha.insertCell()
            var celulaStatus = novaLinha.insertCell()
            var celulaAcoes = novaLinha.insertCell()
            
            // incrementando informações nas celulas
            const linha = [celulaNome,celulaToken,celulaDataCriacao,celulaDataRevelacao,celulaLimite,celulaStatus]

            for (let i = 0; i < linha.length; i++) {
                const celula = linha[i];
                const text = data[i]
                const idSala = data[7]
                const link = data[6]

                if (text == 'Aberta'){
                    celula.className = 'statusSalaON'

                    // botões de ações para sala aberta
                    // botão de visualizar sala de oração
                    var btnVisualizar = document.createElement('button')
                    btnVisualizar.className = 'btnVisualizar'
                    btnVisualizar.innerHTML = `<i class="fa-solid fa-eye"></i>`
                    btnVisualizar.title = 'Visualizar Sala de Oração'
                    btnVisualizar.id = data[1]
                    // evento ao clicar para visualizar sala de oração

                    // botão de compartilhar sala de oração
                    var btnCompartilhar = document.createElement('button')
                    btnCompartilhar.className = 'btnCompartilhar'
                    btnCompartilhar.innerHTML = `<i class="fa-solid fa-share"></i>`
                    btnCompartilhar.title = 'Compartilhar Sala de Oração'
                    // evento ao clicar no botão de compartilhar sala de oração
                    btnCompartilhar?.addEventListener('click', function(){
                        // copiando link para area de transferencia
                        navigator.clipboard.writeText(link)
                        console.log('link para acessar sala copiado')
                    })
                    
                    // botão de remover sala de oração
                    var btnRemover = document.createElement('button')
                    btnRemover.className = 'btnRemover'
                    btnRemover.innerHTML = `<i class="fa-solid fa-trash"></i>`
                    btnRemover.title = 'Remover Sala de Oração'
                    btnRemover.id = data[1]


                    // adicionando botões a celula
                    // definindo estilo da celula
                    celulaAcoes.style.display = 'flex'
                    celulaAcoes.style.gap = '2px'
                    celulaAcoes.style.justifyContent = 'center'
                    
                    celulaAcoes.appendChild(btnVisualizar)
                    celulaAcoes.appendChild(btnCompartilhar)
                    celulaAcoes.appendChild(btnRemover)
                    
                }

                else if (text == 'Fechada'){
                    celula.className = 'statusSalaOFF'

                    // botões de ações para sala fechada
                    // botão de espiar a sala de oração fechada
                    var btnEspiar = document.createElement('button')
                    btnEspiar.className = 'btnEspiar'
                    btnEspiar.innerHTML = `<i class="fa-solid fa-users"></i>`
                    btnEspiar.title = 'Ver quem orou por quem'
                    // evento ao clicar no botão de espiar sala de oração

                    // botão de remover sala de oração
                    var btnRemover = document.createElement('button')
                    btnRemover.className = 'btnRemover'
                    btnRemover.innerHTML = `<i class="fa-solid fa-trash"></i>`
                    btnRemover.title = 'Remover Sala de Oração'
                    btnRemover.id = data[1]

                    // adicionando botões a celula
                    // definindo estilo da celula
                    celulaAcoes.style.display = 'flex'
                    celulaAcoes.style.gap = '2px'
                    celulaAcoes.style.justifyContent = 'center'

                    celulaAcoes.appendChild(btnEspiar)
                    celulaAcoes.appendChild(btnRemover)
                    

                }
                
                celula.textContent = text
            }


        }
        // fim da função de incremento de linha

        // percorre cada sala criada
        for (let i = 0; i < data.length; i++) {
            const sala = data[i];

            var nomeSala = sala.nomeSala
            var tokenSala = sala.tokenSala
            var dataCriacao = sala.dataCriacao
            var dataRevelacao = sala.dataRevelacao
            var limiteSala = sala.limiteSala
            var status = sala.status
            var link = sala.link
            var idSala = sala.idSala

            var arrSala = [nomeSala,tokenSala,dataCriacao,dataRevelacao,limiteSala,status,link,idSala]

            incrementarLinha(arrSala)
            
            
        }

        // evento para caso click no botão de remover sala de oração
        tabela?.addEventListener('click', (e) => {

            // se o elemento clicado for um botão da classe btnRemover ou fa-trash
            // ira remover a linha
            if (e.target.classList.contains('btnRemover') || e.target.classList.contains('fa-trash')){
                // captura a respectiva linha e a remove
                const linhaRemovida = e.target.closest('tr')
                
                var tokenSala = linhaRemovida.querySelector('.btnRemover').id

                linhaRemovida.remove()

                // requisição para "deletar a sala de oração"
                deletarSala(tokenSala).then(response => {
                    var msg = response.msg

                    console.log(msg)
                })
            }
        })

        
    })
})

// evento de pesquisa da sala
const eleInputBuscaSala = document.getElementById('pesquisarSala')
eleInputBuscaSala?.addEventListener('input',(e)=>{
    var param = e.target.value
    var idUsuario = document.getElementById('idAdm').value

    carregarSalas(idUsuario,param).then(response => {
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
    const [ano, mes, dia] = dataRevelacao.split('-')
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
                window.location.reload()

        
            case 'sala_existente':
                alert(`Nome da sala "${nomeSala}" já existe!`)
                document.getElementById('nomeSala').value = ''
                break;
        }
    
    })
})