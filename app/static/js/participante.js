// texto de inspiração
const texto = `A oração é a respiração da alma. É o segredo do poder espiritual. Nenhum outro recurso da graça pode substituí-la, e a saúde da alma ser  conservada. <div class="livro"> <strong> Mensagens aos Jovens - Pag. 249 </strong> </div>`

var eleTextoInspiracao = document.getElementById('textoInspiracao')
eleTextoInspiracao.innerHTML = texto

// evento permitir apenas letras no input do token
var eleInputToken = document.getElementById('inserirToken')
eleInputToken?.addEventListener('input', function(e){
    
    const inputFormatadoToken = e.target.value.replace(/[^a-zA-Z]/g, '')

    e.target.value = inputFormatadoToken

    var comprimentoValor = e.target.value.length

    if (comprimentoValor == 6){
        const token = e.target.value
        
        acessarSala(token).then(data => {
            msg = data.msg

            switch (msg) {
                case 'sala_nao_existe':
                    alert('Essa sala não existe, verifique o TOKEN inserido!')
                    break;

                case 'limite_atingido':
                    alert('Limite máximo de participantes atingido!')
            
                case 'ok':
                    // ira esconder as infos sobre inserir token de acesso a sala
                    var eleConteudoInputToken = document.getElementById('conteudoInserirToken')
                    eleConteudoInputToken.style.display = 'none'

                    // mostra as infos para digitar o nome para entrar de fato na sala
                    var eleConteudoInputNome = document.getElementById('conteudoInserirNome')
                    eleConteudoInputNome.style.display = 'block'

                    // atribuindo a um input hidden o token da sala que o usuario ira acessar
                    var eleDivToken = document.getElementById('token')
                    eleDivToken.value = token
            }

        })
    }
})

// evento para permitir apenas letras no input do nome
const eleInputNome = document.getElementById('inserirNome')
eleInputNome?.addEventListener('input', function(e){
    const inputFormatadoNome = e.target.value.replace(/[^a-zA-Z\s]/g, '')
    e.target.value = inputFormatadoNome
})

// evento para quando clicar no botão de entrar na sala de oração
const eleBtnEntrarSala = document.getElementById('entrarSalaOracao')
eleBtnEntrarSala?.addEventListener('click', function(){
    var nome = eleInputNome.value
    var token = document.getElementById('token').value

    if (nome.length == 0){
        alert('Insira seu nome!')
    }

    else if (nome.length < 3){
        alert('Nome invalido!')
    }

    else {
        entrarSala(nome, token).then(response => {
            data = response.msg

            switch (data) {
                case 'ok':
                    console.log('entrou')
                    window.location.reload()
                    break;
            
                case 'nome_em_uso':
                    alert(`O nome "${nome}" já esta em uso!`)
                    break
            }
        })
    }
})