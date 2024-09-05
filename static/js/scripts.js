
// OBTENDO ELEMENTO BOTÃO QUE ADICIONA O NOME DA PESSOA
const botao_adicionar_nome = document.getElementById('adicionarNome')

// EVENTO PARA AÇÃO QUANDO CLICADO NO BOTÃO DE ADICIONAR O NOME DA PESSOA
botao_adicionar_nome?.addEventListener('click', function(){
    // CAPTURA O NOME DA PESSOA
    const nome_pessoa = document.getElementById('nomeOracao').value

    // CASO NÃO TENHA DIGITADO O NOME
    if (nome_pessoa.length < 3 ){
        alert('Digite seu nome!')
    }

    // CASO TENHA DIGITADO O NOME
    else {
        // CRIANDO JSON PARA ENVIAR AO BACK
        const data = {
            'nomeOracao':nome_pessoa
        }

        // REQUISIÇÃO DE POST AO BACK PARA ADICIONAR O NOME AO BANCO DE DADOS
        axios.post('/adicionarNome', data)
            // OBTENDO RESPONSA DO SERVIDOR (BACKEND)
            .then(response=>  {
                // RESPOSTA DO BACK
                var resposta = response.data
                var msgServidor = resposta.msg

                // CASO A REQUISIÇÃO TENHA OCORRIDO CORRETAMENTE
                if (msgServidor == 'success'){
                    // SELECIONA TODO ELEMENTO EM QUE CADASTRA O NOME DA PESSOA
                    const content_div = document.querySelector('.caixa-entrada')
                    
                    // REMOVE A DIV ONDE CONTEM AS INFORMAÇÕES PARA ADICIONAR O NOME DA PESSOA
                    content_div.remove()

                    // DEIXA A DIV ONDE CONTEM AS INFORMAÇÕES DE PESSOAS PARTICIPANDO E LOAD VISIVEL
                    const eleContainerPessoas = document.getElementsByClassName('container-pessoas')[0]
                    eleContainerPessoas.style.display = 'block'

                    // RECARREGA A PAGINA
                    // PARA MOSTRAR A PAGINA DE CARREGAMENTO E MOSTRAR AS PESSOAS QUE ESTÃO PARTICIPANDO
                }

                else if (msgServidor == 'nome_repetido'){
                    alert(`o nome ${nome_pessoa} já esta em uso!`)
                }
            })
    }
})

// EVENTO PARA SORTEAR OS NOMES
// PARA SORTEAR O NOME
var socket = io('http://10.30.0.203:5000');
let btnSortearNome = document.getElementById('sortearNome')

btnSortearNome?.addEventListener('click', function() {
    // ENVIA LISTA VAZIA POIS O BACK IRA BUSCAR AS INFORMAÇÕES NO DB
    socket.emit('enviar_nome', [])
});

// PARA LIMPAR O BANCO DE DADOS
// EVENTO PARA QUANDO CLICAR NO BOTÃO DE LIMPAR O BANCO DE DADOS
const eleLimparDB = document.getElementById('limparDB')
eleLimparDB?.addEventListener('click', function(){
    // REQUISIÇÃO PARA LIMPAR BANCO DE DADOS
    axios.delete('/limparDB/211121')
        .then(response=>{
            msg = response.data.msg

            // CONFIRMAÇÃO DA LIMPEZA DO BANCO DE DADOS
            if (msg == 'success'){

                // ENVIA PARA LIMPAR O COOKIE DAS PESSOAS LOGADAS

                socket.emit('limpar_cookie', [])

                alert('banco de dados limpo')
            }

            // CASO TENHA DADO ERRADO A LIMPEZA
            else{
                alert('erro! consulte o console do servidor!')
            }
        })
})

window.onload =  function(){
    const socket = io('http://10.30.0.203:5000');

    // EVENTO PARA QUANDO RECEBER A MSG DE EMISSÃO 'receber_nome', IRA TRATAR OS DADOS E MOSTRAR APENAS O NECESSARIO PARA O CLIENT
    socket.on('receber_nome', (data) => {
        // REQUISIÇÃO PARA BUSCAR O NOME DA PESSOA DE ORAÇÃO
        dataJSON = JSON.stringify(data)
        axios.get(`pessoaOracao/${dataJSON}`)
            .then(response=>{
                // DESEMPACOTANDO AS INFORMAÇÕES
                // var meuNome = response.data.meuNome
                var pessoaOracao = response.data.pessoaOracao

                // TIRA DA TELA A INFORMAÇÃO REFERENTE AO CARREGAMENTO
                const eleLoad = document.querySelector('.spinner-border')
                eleLoad.style.display = 'none'
                
                // MENSAGEM QUE IRA APARECER
                msg = `<div class="nomePessoaOracao">${pessoaOracao}</div> é seu amigo de oração da semana!`

                // MENSAGEM PARA DEPURAÇÃO
                msgConsole = (response.data)
                console.log(msgConsole)

                // CAPTURANDO ELEMENTO ONDE MOSTRA A MENSAGEM DA PESSOA DE ORAÇÃO
                const eleMsgOracao = document.getElementById('oracao')

                // ATRIBUINDO VALOR AO ELEMENTO
                eleMsgOracao.innerHTML = msg

                // MOSTRANDO ALERT
                alert(`${pessoaOracao} é seu amigo de oração da semana!`)
            })
    })

    // RECEBE EVENTO DO SERVIDOR PARA LIMPAR O COOKIE
    socket.on('erase_cookie_now', (data) =>{
        // REQUISIÇÃO PARA LIMPAR O COOKIE DO NAVEGADOR PARA ESSA SESSÃO
        axios.delete('/limparCookie')
            .then(response=>{
                msg = response.data.msg

                if (msg == 'success'){
                    location.reload()
                }

                else{
                    console.log('erro! verifique o console do servidor!')
                }
            })
    })
}

// EVENTO QUANDO USUARIO TENTA FAZER LOGIN NA PAGINA
const btnLoggin = document.querySelector('.btn-loggin')

// EVENTO PARA QUANDO CLICADO NO BOTÃO DE ACESSAR
btnLoggin?.addEventListener('click', function(){
    userName = document.getElementById('input-user').value
    userPass = document.getElementById('input-pass').value

    data = {username: userName, password: userPass}

    // REQUISIÇÃO PARA CONSULTAR OS VALORES INFORMADOS
    axios.get(`/loggin/${JSON.stringify(data)}`)
        .then(response=>{
            msg = response.data.msg

            // LOGGIN COM EXITO
            if (msg == 'success'){
                // RECARREGA A PAGINA PARA ACESSAR A MESMA PORÉM COM O PRIVILEGIO DE ADM
                location.reload()
            }

            // LOGGIN SEM EXITO
            else if (msg == 'error'){
                alert('Credenciais Inválidas!')
            }
        })
})

// EVENTO PARA QUANDO CLICAR NO BOTÃO DE SAIR DO MODO ADM
const btnExitAdm = document.getElementById('exitAdm')

btnExitAdm?.addEventListener('click', function(){
    // REQUISIÇÃO PARA LIMPAR CACHE LOGO IRA SAIR DO MODO ADM
    axios.post('/exitAdm', [])
        .then(response=>{
            // RECARREGA A PAGINA
            location.reload()
        })
})