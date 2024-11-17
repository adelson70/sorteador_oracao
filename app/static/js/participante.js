// texto de inspiração
const texto = `A oração é a respiração da alma. É o segredo do poder espiritual. Nenhum outro recurso da graça pode substituí-la, e a saúde da alma ser  conservada. <div class="livro"> <strong> Mensagens aos Jovens - Pag. 249 </strong> </div>`

var eleTextoInspiracao = document.getElementById('textoInspiracao')
eleTextoInspiracao.innerHTML = texto

// evento permitir apenas letras no input
var eleInputToken = document.getElementById('inserirToken')
eleInputToken?.addEventListener('input', function(e){
    
    const inputFormatado = e.target.value.replace(/[^a-zA-Z]/g, '')

    e.target.value = inputFormatado

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
                    console.log('entrou, digite seu nome')
            }

        })
    }
})