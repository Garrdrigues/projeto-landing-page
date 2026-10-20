// --- SISTEMA DE TOAST (Substitui os alerts normais) ---
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Ícones do FontAwesome baseados no tipo
    let icon = 'fa-circle-info';
    if(type === 'success') icon = 'fa-circle-check';
    if(type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    // Remove o toast após 4 segundos
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// --- NAVEGAÇÃO SUAVE E BOTÃO CTA ---
document.getElementById('btnCta').addEventListener('click', () => {
    document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
});

// --- MÁSCARA DO CEP (Formata automaticamente: 00000-000) ---
const cepInput = document.getElementById('cep');

cepInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, ''); // Remove letras
    if (valor.length > 5) {
        valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
    }
    e.target.value = valor;
});

// --- CONSUMO DA API VIACEP ---
const ruaInput = document.getElementById('rua');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');
const cepLoading = document.getElementById('cep-loading');

cepInput.addEventListener('blur', async () => {
    let cep = cepInput.value.replace(/\D/g, '');

    if (cep.length === 8) {
        cepLoading.classList.remove('hidden'); // Mostra o spinner de carregamento

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                ruaInput.value = data.logradouro;
                cidadeInput.value = data.localidade;
                estadoInput.value = data.uf;
                showToast('Endereço encontrado!', 'success');
            } else {
                showToast('CEP não encontrado na base de dados.', 'error');
                limparCamposEndereco();
            }
        } catch (error) {
            showToast('Erro ao conectar com o ViaCEP.', 'error');
            limparCamposEndereco();
        } finally {
            cepLoading.classList.add('hidden'); // Esconde o spinner
        }
    } else if (cep.length > 0) {
        showToast('CEP inválido. Digite 8 números.', 'error');
    }
});

function limparCamposEndereco() {
    ruaInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';
}

// --- SUBMISSÃO DO FORMULÁRIO ---
const formContato = document.getElementById('formContato');

formContato.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    const nome = document.getElementById('nome').value;
    
    // Simula o envio
    const btnSubmit = document.getElementById('btnSubmit');
    const textoOriginal = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    btnSubmit.disabled = true;

    setTimeout(() => {
        showToast(`Obrigado, ${nome}! Sua solicitação foi recebida com sucesso.`, 'success');
        formContato.reset();
        limparCamposEndereco();
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
    }, 1500); // Simula 1.5s de processamento no servidor
});