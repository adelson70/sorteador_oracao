import { socket } from '../index.js'
import { sortear } from '../routes/sortear.js'

// evento quando clicar no botão de sortear
const divBtnSortear = document.querySelector('#btnSortear')

if (divBtnSortear) {
    divBtnSortear?.addEventListener('click', function(){
        var token = document.querySelector('#tokenSala').innerText
        
        sortear(token).then(response => {
            var msg = response.msg
            var data = response.data

            if (msg == 'ok'){
                socket.emit('nomes_sorteados', {data:data})
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
        console.log(data)

        alert('nome recebido')
    })
})