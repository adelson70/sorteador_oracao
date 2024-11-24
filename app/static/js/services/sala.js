import { retornarParticipantes } from '../routes/participante.js'

// evento para carregar participantes 
addEventListener('DOMContentLoaded', function(){
    const divNomesParticipantes = document.querySelector('.listaParticipantes')

    if (divNomesParticipantes){
        var tokenSala = document.querySelector('#tokenSala').innerText

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