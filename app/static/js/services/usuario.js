// importando rotas
import { socket } from '../index.js';
import { retornarSorteio } from '../routes/participante.js';
import { carregarSalas, criarSala, deletarSala } from '../routes/sala.js'
import { loginAdm } from '../routes/usuario.js'

// Função para criar botões dinamicamente
function criarBotao(classe, icone, titulo, eventoClick = null, id = null) {
    const btn = document.createElement('button');
    btn.className = classe
    btn.innerHTML = `<i class="fa-solid ${icone}" data-value="${id}"></i>`;
    btn.title = titulo;
    if (id) btn.id = id;
    if (eventoClick) btn.addEventListener('click', eventoClick);
    return btn;
}

// Função para incrementar uma linha na tabela
function incrementarLinha(tabela, data) {
    const novaLinha = tabela.insertRow();
    const [nome, token, criacao, revelacao, limite, status, link, idSala] = data;

    // Criar células
    const celulas = [
        nome, token, criacao, revelacao, limite, status
    ].map((text) => {
        const celula = novaLinha.insertCell();
        celula.textContent = text;
        return celula;
    });

    // Célula de ações
    const celulaAcoes = novaLinha.insertCell();
    celulaAcoes.style.display = 'flex';
    celulaAcoes.style.gap = '2px';
    celulaAcoes.style.justifyContent = 'center';

    var celulaStatus = celulas[5]

    if (status === 'Aberta') {
        // criando uma classe para a celula
        celulaStatus.className = 'statusSalaON'
        // Botões para sala aberta
        
        // criando botão de ação de visualizar sala de oração
        celulaAcoes.appendChild(criarBotao('btnVisualizar', 'fa-eye', 'Visualizar Sala de Oração', (e) => {
            // evento para visualizar sala de oração em nova aba
            var valor

            if (e.target.id) valor = e.target.id
            
            else valor = e.target.dataset.value
            
            const url = `/sala/visualizar/${valor}`

            window.open(url, '_blank')

        }, token));
        
        // criando botão de ação de compartilhar sala de oração
        celulaAcoes.appendChild(criarBotao('btnCompartilhar', 'fa-share', 'Compartilhar Sala de Oração', () => {
            
            try {
                navigator.clipboard.writeText(link)
                alert('Link Copiado!')

            } catch (error) {
                console.error('Não foi possivel copiar o link, verifique as permissões do navegador')
            }


        }));
        
        // criando botão de ação de "remover" sala de oração
        celulaAcoes.appendChild(criarBotao('btnRemover', 'fa-trash', 'Remover Sala de Oração', null, token));

    } else {
        // criando uma classe para celula
        celulaStatus.className = 'statusSalaOFF'
        // Botões para sala fechada
        
        // criando botão de ação de espiar sala de oração
        celulaAcoes.appendChild(criarBotao('btnEspiar', 'fa-users', 'Ver quem orou por quem', () => {
            retornarSorteio(token).then(response => {
                var data = response.data.revelacao
                var revelacao = data.revelacao

                var eleModalEspiar = document.querySelector('#modalEspiarSala')

                // definindo nome da sala
                var eleNomeSalaModal = eleModalEspiar.querySelector("#nomeSalaEspiar")
                eleNomeSalaModal.innerHTML = nome

                // mostrando revelação
                var eleNomesSorteados = eleModalEspiar.querySelector('#revelacaoSala')
                
                for(let nome in revelacao){
                    var meuNome = nome
                    var nomeSorteado = revelacao[meuNome]

                    var eleNome = document.createElement('div')
                    eleNome.className = 'nomeParticipante'
                    eleNome.style.cursor = 'pointer'
                    eleNome.style.marginBottom = '10px'
                    eleNome.innerHTML = meuNome.toUpperCase()
                    eleNome.setAttribute('data-sorteado',`${nomeSorteado}`)
                    
                    eleNome.id = meuNome

                    // evento quando clicado no nome do participante
                    eleNome.addEventListener('mouseover', function(e){
                        var nome = e.target.id
                        var nomeSorteado = e.target.getAttribute('data-sorteado')

                        e.target.innerHTML = `${nome.toUpperCase()} orou por ${nomeSorteado.toUpperCase()}`
                    })

                    eleNome.addEventListener('mouseout', function(e){
                        var nome = e.target.id

                        e.target.innerHTML = nome.toUpperCase()
                    })


                    eleNomesSorteados.appendChild(eleNome)
                }

                

                // visualizando modal
                var modalEspiar = new bootstrap.Modal(eleModalEspiar)
                modalEspiar.show()

                // limpando as informações após fechar o modal
                eleModalEspiar.addEventListener('hidden.bs.modal', function () {
                    var eleNomesSorteados = eleModalEspiar.querySelector('#revelacaoSala')
                    eleNomesSorteados.innerHTML = ''
                  });


            })
        }, token));
        
        // criando botção de ação de "remover" sala de oração
        celulaAcoes.appendChild(criarBotao('btnRemover', 'fa-trash', 'Remover Sala de Oração', null, token));
    }
}

// Carregar salas ao carregar o DOM
document.addEventListener('DOMContentLoaded', function () {
    try {
        const idUsuario = document.getElementById('idAdm').value;
        const tabela = document.getElementById('tabela').querySelector('tbody');
    
        carregarSalas(idUsuario).then((response) => {
            tabela.innerHTML = ''; // Limpar tabela
    
            response.forEach((sala) => {
                const arrSala = [
                    sala.nomeSala, sala.tokenSala, sala.dataCriacao, sala.dataRevelacao,
                    sala.limiteSala, sala.status, sala.link, sala.idSala
                ];
                incrementarLinha(tabela, arrSala);
            });
        });
    
        // Evento para remover sala
        tabela.addEventListener('click', (e) => {
            if (e.target.closest('.btnRemover')) {
                const linhaRemovida = e.target.closest('tr');
                const tokenSala = linhaRemovida.querySelector('.btnRemover').id;
                linhaRemovida.remove();
    
                deletarSala(tokenSala).then((response) => {
                    console.log(response.msg);
                });
            }
        });
    }
    catch{
        console.log('elementos não encontrados nessa pagina')
    }

});

// Pesquisa de salas
const eleInputBuscaSala = document.getElementById('pesquisarSala');
eleInputBuscaSala?.addEventListener('input', (e) => {
    const param = e.target.value;
    const idUsuario = document.getElementById('idAdm').value;
    const tabela = document.getElementById('tabela').querySelector('tbody');

    carregarSalas(idUsuario, param).then((response) => {
        tabela.innerHTML = ''; // Limpar tabela antes de recarregar
        response.forEach((sala) => {
            const arrSala = [
                sala.nomeSala, sala.tokenSala, sala.dataCriacao, sala.dataRevelacao,
                sala.limiteSala, sala.status, sala.link, sala.idSala
            ];
            incrementarLinha(tabela, arrSala);
        });
    });
});

// evento quando clica em entrar
const eleNomeUsuario = document.getElementById('nomeUsuario')
const eleSenhaUsuario = document.getElementById('senhaUsuario')

const eleBtnEntrar = document.getElementById('acessoAdm')

eleBtnEntrar?.addEventListener('click', function(){
    var nomeUsuario = eleNomeUsuario.value
    var senhaUsuario = eleSenhaUsuario.value

    if (nomeUsuario.length == 0 || senhaUsuario.length == 0){
        alert('Preencha todos os campos!')
    }

    else{
        loginAdm(nomeUsuario,senhaUsuario).then(response => {
            var data = response.msg
    
            switch (data) {
                case 'ok':
                    console.log('usuario encontrado')

                    window.location.reload()
                    break;
            
                case 'usuario_nao_encontrado':
                    alert('Usuario não encontrado!')
            }
        })
    }
})

// evento quando clica em criar sala
const eleCriarSala = document.getElementById('criarSala')
eleCriarSala?.addEventListener('click', function(){
    const modalCriarSala = new bootstrap.Modal(document.getElementById('modalCriarSala'))
    modalCriarSala.show()
})

// evento para quando digitar o limite da sala de oração a ser criada
const eleLimiteSala = document.getElementById('limiteSala')
eleLimiteSala?.addEventListener('input', function(e){
    const valorFormatado = e.target.value.replace(/[^0-9]/g, '')

    e.target.value = valorFormatado

    var valorNumerico = Number(valorFormatado)

    if (valorNumerico > 31){
        e.target.value = 30
    }

    else if (valorNumerico < 2){
        alert('Limite minimo é de 2 participantes!')
    }
})

// evento para quando clicar no botão de criar sala
const eleBtnCriarSala = document.getElementById('btnCriarSala')
eleBtnCriarSala?.addEventListener('click', function(){
    var data = {}
    var nomeSala = document.getElementById('nomeSala').value
    var dataRevelacao = document.getElementById('dataRevelacao').value
    const [ano, mes, dia] = dataRevelacao.split('-')
    const dataFormatada = `${dia}/${mes}/${ano}`

    var limiteSala = document.getElementById('limiteSala').value

    data = {
        nomeSala:nomeSala,
        dataRevelacao:dataFormatada,
        limiteSala:limiteSala
    }

    criarSala(data).then(response => {
        var msg = response.msg

        switch (msg) {
            case 'ok':
                alert('Sala criada com sucesso!')
                window.location.reload()
                break

        
            case 'sala_existente':
                alert(`Nome da sala "${nomeSala}" já existe!`)
                document.getElementById('nomeSala').value = ''
                break;

            case 'error':
                console.error('Erro ao criar a sala, verifique o console do servidor')
                break
        }
    
    })
})