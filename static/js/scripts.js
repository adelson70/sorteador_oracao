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

                // CASO A REQUISIÇÃO TENHA OCORRIDO CORRETAMENTE
                if (msgServidor == 'success'){
                    // SELECIONA TODO ELEMENTO EM QUE CADASTRA O NOME DA PESSOA
                    const content_div = document.querySelector('.caixa-entrada')
                    
                    // REMOVE A DIV ONDE CONTEM AS INFORMAÇÕES PARA ADICIONAR O NOME DA PESSOA
                    content_div.remove()

                    // RECARREGA A PAGINA
                    location.reload()
                }

                else if (msgServidor == 'nome_repetido'){
                    alert(`o nome ${nome_pessoa} já esta em uso!`)
                }
            })
    }
})