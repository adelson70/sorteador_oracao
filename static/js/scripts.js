// REQUISIÇÃO PARA VERIFICAR SE O USUARIO ADM JÁ CRIOU UMA SALA DE ORAÇÃO
axios.get('/getSession/salaOracao')
    .then(response=>{
        resp = response.data.salaOracao
        
        // CASO O USUARIO ADM JÁ TENHA CRIADO UMA SALA DE ORAÇÃO
        if (resp == true){
            ele = document.getElementById('opcaoCriarSala')
            ele.remove()

            // ALTERA OS ELEMENTOS DA PAGINA PARA PARTE DE SORTEIO DOS NOMES
            axios.get('/getSession/infosSala')
                .then(response=>{
                    data = response.data.infosSala

                    // REMOVE O ELEMENTO PEDIDO PARA CRIAR SALA DE ORAÇÃO
                    eleAlerta = document.getElementById('alertaCriarSala')
                    eleAlerta.style.display = 'none'

                    // MOSTRA OS OUTROS ELEMENTOS
                    nomeSala = data.nome_sala
                    tokenSala = data.token

                    // MOSTRANDO AS INFOS
                    // LOAD, NOMES, TOKEN
                    eleSalaCriada = document.querySelector('.salaOracaoCriada')
                    eleSalaCriada.style.display = 'block'
                    
                    // MOSTRANDO TOKEN AO USUARIO ADM
                    eleToken = document.getElementById('token')
                    eleToken.innerHTML = tokenSala

                    // MOSTRANDO NOME DA SALA DE ORAÇÃO QUE ELE CRIOU
                    eleNomeSalaOracao = document.getElementById('tokenLabel')
                    eleNomeSalaOracao.innerHTML = `Token de acesso a sala "${nomeSala}"`

                    // MOSTANDO NOME DAS PESSOAS
                    // RECEBE AS EMISSÕES DO SOCKET PARA ADICIONAR O NOME NA JANELA DO ADM
                    elePessoasParticipando = document.querySelector('.nomesParticipando')
                    elePessoasParticipando.style.display = 'flex'

                    // REQUISIÇÃO PARA BUSCAR OS NOMES PARTICIPANTES
                    axios.get(`/getNomesSala/${tokenSala}`)
                        .then(response=>{
                            data = response.data
                            msgServer = data.msg

                            if (msgServer == 'success'){
                                nomes = data.nomes
                                // CASO ALGUEM JÁ TENHA SE CADASTRADO O LOAD SERÁ RETIRADO
                                if (nomes.length != 0){
                                    // RETIRANDO O LOAD DA PAGINA
                                    eleLoad = document.querySelector('.spinner-border')
                                    eleLoad.style.display = 'none'

                                    // MOSTRANDO NA TELA AS PESSOAS DE ORAÇÃO QUE JÁ SE CADASTRARAM
                                    elePessoasParticipando = document.querySelector('.nomesParticipando')

                                    
                                    nomes.forEach(nome => {
                                        let primeiraLetra = nome[0].toUpperCase()
                                        let restoNome = nome.slice(1).toLowerCase()
                                        let nomeFormatado = primeiraLetra+restoNome

                                        // CRIA UM ELEMENTO SPAN PARA CADA NOME
                                        let span = document.createElement('span')
                                        span.textContent = nomeFormatado
                                        span.classList.add('nomeParticipante')

                                        elePessoasParticipando.appendChild(span)
                                    });

                                    
                                }

                                console.log(nomes)
                            }

                            else if(msgServer == 'sala_expirada')
                                // SE A SALA JÁ TER SIDO USADA O ADM IRA RETORNAR PARA PAGINA DE CRIAÇÃO DE SALA

                                eleLoad = document.querySelector('.spinner-border')
                                eleLoad.style.display = 'none'

                                eleBtnSortear = document.querySelector('.btn-sortear')
                                eleBtnSortear.style.display = 'none'
                                
                                // AVISO O USUARIO QUE A SALA DE ORAÇÃO FOI EXPIRADA
                                // POIS JÁ FOI SORTEADO
                                eleTituloPessoa = document.querySelector('.titulo-pessoas')
                                eleTituloPessoa.innerHTML = 'Sala Expirada'
                                eleTituloPessoa.title = 'Recarregue a página para criar uma nova sala de oração!'

                                // MOSTRANDO NOMES SORTEADOS
                                // REQUISIÇÃO PARA BUSCAR A RELAÇÃO DOS NOMES
                                axios.get(`/getNomesSalaExpirada/${tokenSala}`)
                                    .then(response=>{
                                        nomes = response.data.nomes

                                        // BUSCANDO ELEMENTO ONDE IRA MOSTRAR A RELAÇÃO DOS NOMES

                                        eleRelacaoNomes = document.querySelector('.relacao-nomes')

                                        
                                        // ITERA SOBRE OS RESULTADOS
                                        for (let key in nomes){
                                            meuNome = nomes[key].meuNome
                                            nomeSorteado = nomes[key].sorteadoNome

                                            relacaoNomes = `${meuNome} orou por ${nomeSorteado}`
                                            
                                            // CRIA UM ELEMENTO DIV PARA CADA NOME
                                            eleNomesSorteados = document.createElement('div')
                                            
                                            // ADICIONA AO ELEMENTO A MENSAGEM
                                            eleNomesSorteados.textContent = relacaoNomes
                                            
                                            // ADICIONA A CLASSE REFERIDA AS INFORMAÇÕES DO ELEMENTO
                                            eleNomesSorteados.classList.add('relacao-nomes')

                                            // INCREMENTA AS INFORMAÇÕES
                                            eleRelacaoNomes.appendChild(eleNomesSorteados)
                                            
                                        }
                                        
                                        eleRelacaoNomes.style.display = 'block'

                                        alert('Recarregue a página para criar uma nova sala de oração')
                                    })


                        })
                })
        }
    })

// EVENTO PARA QUANDO O USUARIO PARTICIPANTE DA SALA ATUALIZAR A PAGINA
usuarioParticipante = document.getElementById('usuarioParticipante')

axios.get('/verificarSorteio')
    .then(response=>{
        data = response.data
        
        var sorteado = data.msg
        var nomePessoaSorteada = data.nomeSorteado

        if (sorteado == 'sorteado'){
            // TIRA DA TELA A INFORMAÇÃO REFERENTE AO CARREGAMENTO
            const eleLoad = document.querySelector('.spinner-border')
            eleLoad.style.display = 'none'
            
            // MENSAGEM QUE IRA APARECER
            if (nomePessoaSorteada==undefined){
                console.log('sala não encontrada!')
            }
            else{
                msg = `<div class="nomePessoaOracao">${nomePessoaSorteada}</div> é seu amigo de oração da semana!`
    
                // CAPTURANDO ELEMENTO ONDE MOSTRA A MENSAGEM DA PESSOA DE ORAÇÃO E TITULO
                const eleMsgOracao = document.getElementById('oracao')
                const eleTituloLoad = document.querySelector('.titulo-pessoas')
                
                eleTituloLoad.innerHTML = 'Amigo de Oração'
                eleMsgOracao.innerHTML = msg
            }
        }
    })


// OBTENDO ELEMENTO BOTÃO QUE ADICIONA O NOME DA PESSOA
const botao_adicionar_nome = document.getElementById('adicionarNome')

// EVENTO PARA AÇÃO QUANDO CLICADO NO BOTÃO DE ADICIONAR O NOME DA PESSOA
botao_adicionar_nome?.addEventListener('click', function(){
    // CAPTURA O NOME DA PESSOA
    const nome_pessoa = document.getElementById('nomeOracao').value

    // CAPTURA O TOKEN
    const token_sala = document.getElementById('token-input').value

    // CASO NÃO TENHA DIGITADO UM TOKEN COM 6 CHARS
    if (token_sala.length != 6 ){
        console.log(token_sala, token_sala.length)
        alert('Insira o TOKEN da sala!')
    }

    // CASO NÃO TENHA DIGITADO O NOME
    else if (nome_pessoa.length < 3){
        alert('Insira um nome!')
    }

    // CASO TENHA DIGITADO O NOME
    else {
        // CRIANDO JSON PARA ENVIAR AO BACK
        const data = {
            'nomeOracao':nome_pessoa,
            'token': token_sala
        }

        // REQUISIÇÃO DE POST AO BACK PARA ADICIONAR O NOME AO BANCO DE DADOS
        axios.post('/adicionarNome', data)
            // OBTENDO RESPONSA DO SERVIDOR (BACKEND)
            .then(response=>  {
                // RESPOSTA DO BACK
                var resposta = response.data
                var msgServidor = resposta.msg
                var tokenSala = resposta.token

                console.log(resposta)

                // CASO USUARIO TENHA INSERIDO O TOKEN INVALIDO
                if (msgServidor == 'token_invalido'){
                    alert('TOKEN Inválido!')
                }

                // CASO A REQUISIÇÃO TENHA OCORRIDO CORRETAMENTE
                else if (msgServidor == 'success'){
                    // SELECIONA TODO ELEMENTO EM QUE CADASTRA O NOME DA PESSOA
                    const content_div = document.querySelector('.caixa-entrada')
                    
                    // REMOVE A DIV ONDE CONTEM AS INFORMAÇÕES PARA ADICIONAR O NOME DA PESSOA
                    content_div.remove()

                    // DEIXA A DIV ONDE CONTEM AS INFORMAÇÕES DE PESSOAS PARTICIPANDO E LOAD VISIVEL
                    const eleContainerPessoas = document.getElementsByClassName('container-pessoas')[0]
                    eleContainerPessoas.style.display = 'block'

                    dataInfo ={
                        nomePessoa : nome_pessoa,
                        token: tokenSala
                    }

                    // EVENTO PARA EMISSÃO NO NOME CADASTRADO
                    socket.emit('nomePessoaCadastrada', dataInfo)
                }

                else if (msgServidor == 'nome_repetido'){
                    alert(`o nome ${nome_pessoa} já esta em uso!`)
                }
            })
    }
})

// EVENTO PARA SORTEAR OS NOMES
// PARA SORTEAR O NOME
var socket = io("http://192.168.10.28:5000");
let btnSortearNome = document.getElementById('sortearNome')

btnSortearNome?.addEventListener('click', function() {
    // ENVIA LISTA VAZIA POIS O BACK IRA BUSCAR AS INFORMAÇÕES NO DB
    alert('Nomes Sorteados!')
    socket.emit('enviar_nome', tokenSala)
});

// EVENTO PARA RECEBER O NOME DA PESSOA QUE ENTROU NA SALA DE ORAÇÃO
socket.on('receber_nome_pessoa_cadastrada', data=>{
    eleTokenAdm = document.getElementById('token')

    // TRATAMENTO PARA RECEBER DE ACORDO COM O TOKEN GERADO PELO ADM
    if (data.token == eleTokenAdm.innerHTML){
        pessoaParticipando = data.nomePessoa

        eleLoad = document.querySelector('.spinner-border')
        eleLoad.style.display = 'none'

        eleNomesParticipando = document.querySelector('.nomesParticipando')
        
        primeiraLetra = pessoaParticipando[0].toUpperCase()
        restoNome = pessoaParticipando.slice(1).toLowerCase()
        nomeFormatado = primeiraLetra+restoNome

        // CRIA UM ELEMENTO SPAN PARA CADA NOME
        span = document.createElement('span')
        span.textContent = nomeFormatado
        span.classList.add('nomeParticipante')

        eleNomesParticipando.appendChild(span)

        console.log(`${pessoaParticipando} entrou na sala de oração`)
    }
})

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
    const socket = io("http://192.168.10.28:5000");

    // EVENTO PARA QUANDO RECEBER A MSG DE EMISSÃO 'receber_nome', IRA TRATAR OS DADOS E MOSTRAR APENAS O NECESSARIO PARA O CLIENT
    try {
        socket.on('receber_nome', (data) => {
            // REQUISIÇÃO PARA BUSCAR O NOME DA PESSOA DE ORAÇÃO
            dataJSON = JSON.stringify(data)

            // CASO TENTE SORTEAR COM APENAS UMA PESSOA NA SALA
            if(data.msg == 'none'){
                console.log('não foi possivel sortear')
            }

            // CASO TENTE SORTEAR NUMA SALA EXPIRADA
            else if (data.msg == 'offline'){
                location.reload()
            }

            else{
                axios.get(`pessoaOracao/${dataJSON}`)
                    .then(response=>{
                        // DESEMPACOTANDO AS INFORMAÇÕES
                        // var meuNome = response.data.meuNome
                        var pessoaOracao = response.data.pessoaOracao

                        console.log(response.data)
    
                        // TIRA DA TELA A INFORMAÇÃO REFERENTE AO CARREGAMENTO
                        const eleLoad = document.querySelector('.spinner-border')
                        eleLoad.style.display = 'none'
                        
                        if (pessoaOracao != undefined){
                            // MENSAGEM QUE IRA APARECER
                            msg = `<div class="nomePessoaOracao">${pessoaOracao}</div> é seu amigo de oração da semana!`
            
                            // CAPTURANDO ELEMENTO ONDE MOSTRA A MENSAGEM DA PESSOA DE ORAÇÃO
                            var eleMsgOracao = document.getElementById('oracao')
                        }
                        
                        // ATRIBUINDO VALOR AO ELEMENTO
                        try {
                            eleMsgOracao.innerHTML = msg
                            // MOSTRANDO ALERT
                            if (pessoaOracao!=undefined){
                                alert(`${pessoaOracao} é seu amigo de oração da semana!`)   
                            }
    
                        } catch (error) {
                            // alert('Nomes sorteados!')
                        }
        
                    })
            }

        })
    // CASO SEJA ADM NÃO IRA RECEBER O NOME DE ORAÇÃO
    // ADM SERVE APENAS COMO UMA SALA
    } catch (error) {
        console.log('adm não recebe nome de oração')
    }

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

// EVENTO PARA QUANDO CLICAR EM CRIAR SALA DE ORAÇÃO
// BUSCANDO NOME DA SALA CRIADA
const eleNomeSala = document.getElementById('nomeSala')
const btnCriarSala = document.getElementById('criarSala')

btnCriarSala?.addEventListener('click', function(){
    const nomeSala = eleNomeSala.value
    
    // CASO NÃO TENHA COLOCADO NENHUM NOME
    if (nomeSala.length == 0){
        console.log('nenhum nome inserido')

        alert('Insira um nome para sua sala de oração!')

    }

    // CASO TENHA INSERIDO ALGUM NOME PARA SALA
    else{
        data = {nomeSala: nomeSala}
        // REQUISIÇÃO PARA CRIAR A SALA DE ORAÇÃO
        axios.post('/criarSala', data)
            .then(response=>{
                location.reload()
            })
    }

})

try {
    // EVENTO PARA QUANDO O USUARIO INSIRA O TOKEN PARA ACESSAR A SALA DE ORAÇÃO
    document.getElementById('token-input').addEventListener('input', function(e) {
        // REMOVE CARACTER QUE NÃO SEJA LETRA
        this.value = this.value.replace(/[^a-zA-Z]/g, '');
        
        // LIMITA A 6 CHARS E DEIXA TUDO EM MAIUSCULO
        this.value = this.value.toUpperCase().slice(0, 6);
    });    
} catch (error) {
    console.log(error)
}

// EVENTO PARA DEIXAR O NOME DE USUARIO SEMPRE EM MINUSCULO E SEM ESPAÇO
inputUserAdm = document.getElementById('nomeAdm')

inputUserAdm.addEventListener('input', function(e){
    // PERMITE APENAS LETRAS MINUSCULAS
    this.value = this.value.replace(/[^a-z]/g, '')

    // MAXIMO DE 15 CARACTERES
    this.value = this.value.slice(0,15)

})

// EVENTO PARA CRIAR USUARIO DE LOGGIN ADM
btn_criar_adm = document.getElementById('criar-adm')

btn_criar_adm?.addEventListener('click', function(){
    // OBTENDO VALORES DOS ELEMENTOS
    // NOME DO USUARIO
    nome = document.getElementById('nomeAdm').value
    // SENHA E SENHA DE CONFIRMAÇÃO
    senha1 = document.getElementById('senhaAdm1').value
    senha2 = document.getElementById('senhaAdm2').value

    // ADD NUM DICIO
    const dataAdm = {
        nome:nome,
        senha1:senha1,
        senha2:senha2
    }    

    // REQUISIÇÃO PARA O BACK PARA VALIDAR E CRIAR USUARIO
    axios.post('criarAdm', dataAdm)
        .then(response=>{
            data = response.data

            msg = data.msg

            if (msg=='success'){
                alert('Usuario Criado')
                location.reload()
            }

            else if(msg=='vazio'){
                alert('Preencha todos os campos!')
            }

            else if(msg=='nome_curto'){
                alert('Nome deve ter no minimo 3 caracteres!')
            }

            else if(msg=='senhas_ncorresponde'){
                alert('Senhas não correspondem!')
            }

            else if(msg=='senha_curta'){
                alert('Senha deve ter no minimo 8 caracteres')
            }

            else if(msg=='usuario_existente'){
                alert('Este usuário já existe!')
            }
            
        })
})