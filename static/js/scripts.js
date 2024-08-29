// OBTENDO ELEMENTO BOTÃO QUE ADICIONA O NOME DA PESSOA
const botao_adicionar_nome = document.getElementById('adicionarNome')

// EVENTO PARA AÇÃO QUANDO CLICADO NO BOTÃO DE ADICIONAR O NOME DA PESSOA
botao_adicionar_nome.addEventListener('click', function(){
    // CAPTURA O NOME DA PESSOA
    const nome_pessoa = document.getElementById('nomeOracao').value

    // CASO NÃO TENHA DIGITADO O NOME
    if (nome_pessoa.lenght === undefined){
        alert('Digite seu nome!')
    }

    // CASO TENHA DIGITADO O NOME
    else {
        alert(`Ola ${nome_pessoa}!`)
    }
})