// 1. Ação do Botão Call to Action (CTA)
const btnCta = document.getElementById('btnCta');

btnCta.addEventListener('click', () => {
    // Exibe a mensagem de agradecimento
    alert('Excelente! Vamos alinhar os detalhes da sua consultoria.');
    
    // Rola a página suavemente até o formulário de contato
    document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
});


// 2. Consumo da API ViaCEP
const cepInput = document.getElementById('cep');
const ruaInput = document.getElementById('rua');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');

// O evento 'blur' é disparado quando o usuário clica fora do campo de CEP
cepInput.addEventListener('blur', async () => {
    let cep = cepInput.value.replace(/\D/g, ''); // Remove tudo que não for número

    if (cep.length === 8) {
        try {
            // Faz a requisição para a API
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                // Preenche os campos automaticamente
                ruaInput.value = data.logradouro;
                cidadeInput.value = data.localidade;
                estadoInput.value = data.uf;
            } else {
                alert('CEP não encontrado na base de dados.');
                limparCamposEndereco();
            }
        } catch (error) {
            alert('Erro ao conectar com o serviço de CEP.');
        }
    } else if (cep.length > 0) {
        alert('CEP inválido. Digite os 8 números.');
    }
});

function limparCamposEndereco() {
    ruaInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';
}


// 3. Ação do Formulário
const formContato = document.getElementById('formContato');

formContato.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evita que a página recarregue
    
    const nome = document.getElementById('nome').value;
    alert(`Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`);
    
    formContato.reset(); // Limpa o formulário
    limparCamposEndereco();
});