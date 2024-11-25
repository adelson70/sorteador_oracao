import { retornarParticipantes } from '../routes/participante.js'
import { socket } from '../index.js'

// evento para carregar participantes 
addEventListener('DOMContentLoaded', function(){
    const divNomesParticipantes = document.querySelector('.listaParticipantes')

    if (divNomesParticipantes){
        var tokenSala = document.querySelector('#tokenSala').innerText

        socket.emit('connectROOM', {tokenSala})

        retornarParticipantes(tokenSala).then(response => {
            var nomes = response.data.data

            nomes.forEach(nome => {
                var divNome = document.createElement('div')
                divNome.innerHTML = nome
                divNome.className = 'nomeParticipante'

                var divNomes = divNomesParticipantes.querySelector('.nomeDosParticipantes')

                divNomes.appendChild(divNome)
            });
        })

}})

// escuta evento do servidor para nome na respectiva sala
document.addEventListener('DOMContentLoaded', () => {
    const divNomesParticipantes = document.querySelector('.listaParticipantes');

    if (divNomesParticipantes) {
        socket.on('receber_nome', (data) => {
            var nome = data

            var divNomes = divNomesParticipantes.querySelector('.nomeDosParticipantes')

            var divNome = document.createElement('div')
            divNome.innerHTML = nome
            divNome.className = 'nomeParticipante'

            divNomes.appendChild(divNome)
        });
    }
});