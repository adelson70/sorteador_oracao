// OBTENDO ELEMENTO BOTÃO QUE ADICIONA O NOME DA PESSOA
const botao_adicionar_nome = document.getElementById('adicionarNome')

// EVENTO PARA AÇÃO QUANDO CLICADO NO BOTÃO DE ADICIONAR O NOME DA PESSOA
botao_adicionar_nome.addEventListener('click', function(){
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

                console.log(msgServidor)

                // APLICAÇÕES CASO DE CERTO OU DE ERRADO
            })
    }
})