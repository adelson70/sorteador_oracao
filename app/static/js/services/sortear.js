import { socket } from '../index.js'
import { retornarAmigoSecreto } from '../routes/participante.js'
import { sortear } from '../routes/sortear.js'

// evento quando clicar no botão de sortear
const divBtnSortear = document.querySelector('#btnSortear')

if (divBtnSortear) {
    divBtnSortear?.addEventListener('click', function(){
        var token = document.querySelector('#tokenSala').innerText
        
        sortear(token).then(response => {
            var msg = response.msg
            var data = response.data
            
            if (msg == 'numero_participantes'){
                alert('Precisa de 2 participantes no minimo!')
            }

            else if (msg == 'ok'){
            socket.emit('nomes_sorteados', {data:data})
            alert('Nomes Sorteados!')
            window.location.reload()

            }
            else if (msg == 'sorteio_ja_ocorreu'){
                divBtnSortear.style.display = 'none'
                console.log('Sorteio ja ocorreu')

            }
            else{
                console.log('erro verifique o log do servidor')
            }
            
        })
    })

}

// evento recebendo seu nome de oração
addEventListener('DOMContentLoaded', () => {
    socket.on('receber_nome_oracao', (data) => {
        alert('Nomes Sorteados!')
        
        const divLoad = document.querySelector('.spinner-border')
        divLoad.style.display = 'none'

        const divTextoAguardando = document.querySelector('#aguardandoSorteio')
        divTextoAguardando.style.display = 'none'

        const divRevelacao = document.querySelector('.revelacao')

        const meuNome = document.querySelector('#meuNome').value
        const nomeSorteado = data[meuNome]

        var revelacaoNome = document.createElement('div')
        revelacaoNome.className = 'nomeRevelado'
        revelacaoNome.innerHTML = `<strong>${nomeSorteado.toUpperCase()}</strong> será a pessoa que você estará orando!`

        divRevelacao.appendChild(revelacaoNome)
        divRevelacao.style.display = 'block'

        //adicionando ao cache do navegador  
        sessionStorage.setItem(meuNome, JSON.stringify({ sorteado: true }))
    })
})

addEventListener('DOMContentLoaded', function(){
    const meuNome = document.querySelector('#meuNome').value
    const token = document.querySelector('#token').value

    if (meuNome){
        const user = JSON.parse(this.sessionStorage.getItem(meuNome))

        if (user != null){
            retornarAmigoSecreto(meuNome,token).then(response => {
                const nomeSorteado = response.data.amigoSecreto

                const divLoad = document.querySelector('.spinner-border')
                divLoad.style.display = 'none'
        
                const divTextoAguardando = document.querySelector('#aguardandoSorteio')
                divTextoAguardando.style.display = 'none'
        
                const divRevelacao = document.querySelector('.revelacao')
    
                var revelacaoNome = document.createElement('div')
                revelacaoNome.className = 'nomeRevelado'
                revelacaoNome.innerHTML = `<strong>${nomeSorteado.toUpperCase()}</strong> será a pessoa que você estará orando!`
        
                divRevelacao.appendChild(revelacaoNome)
                divRevelacao.style.display = 'block'

            })
        }
    }

})