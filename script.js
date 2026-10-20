// Notificação Executiva (Toast)
function notify(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Ações dos Botões Call to Action (CTA)
const rolarParaContato = () => {
    document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('nome').focus(), 600);
};

document.getElementById('btnCta').addEventListener('click', () => {
    notify('Iniciando agendamento de diagnóstico executivo.', 'info');
    rolarParaContato();
});

document.getElementById('btnCtaTopo').addEventListener('click', rolarParaContato);

// Interação nos cards de Insights
document.querySelectorAll('.insight-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
        const titulo = btn.getAttribute('data-title');
        notify(`${titulo}: Solicite o estudo completo através do formulário abaixo.`, 'info');
        rolarParaContato();
    });
});

// Integração com API ViaCEP
const cepInput = document.getElementById('cep');
const ruaInput = document.getElementById('rua');
const bairroInput = document.getElementById('bairro');
const cidadeInput = document.getElementById('cidade');
const estadoInput = document.getElementById('estado');
const cepStatus = document.getElementById('cepStatus');

// Máscara automática 00000-000
cepInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 5) {
        valor = valor.slice(0, 5) + '-' + valor.slice(5, 8);
    }
    e.target.value = valor;
});

function limparEndereco() {
    ruaInput.value = '';
    bairroInput.value = '';
    cidadeInput.value = '';
    estadoInput.value = '';
}

cepInput.addEventListener('blur', async () => {
    const cepLimpo = cepInput.value.replace(/\D/g, '');

    if (cepLimpo.length === 0) return;

    if (cepLimpo.length !== 8) {
        notify('Formato de CEP inválido. Informe os 8 dígitos.', 'error');
        limparEndereco();
        return;
    }

    cepStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando...';

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();

        if (!data.erro) {
            ruaInput.value = data.logradouro || 'Não especificado';
            bairroInput.value = data.bairro || 'Centro';
            cidadeInput.value = data.localidade;
            estadoInput.value = data.uf;
            cepStatus.textContent = '✓ Validado';
            notify(`Localidade identificada: ${data.localidade} - ${data.uf}`, 'success');
        } else {
            cepStatus.textContent = '';
            limparEndereco();
            notify('CEP não encontrado na base nacional dos Correios.', 'error');
        }
    } catch (err) {
        cepStatus.textContent = '';
        limparEndereco();
        notify('Falha ao consultar o serviço ViaCEP.', 'error');
    }
});

// Submissão do Formulário
const formContato = document.getElementById('formContato');

formContato.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) {
        notify('Por favor, preencha todos os campos obrigatórios (*).', 'error');
        return;
    }

    const btnSubmit = document.getElementById('btnSubmit');
    const originalText = btnSubmit.innerHTML;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando Solicitação...';
    btnSubmit.disabled = true;

    setTimeout(() => {
        notify(`Prezado(a) ${nome}, sua solicitação de diagnóstico foi registrada com sucesso.`, 'success');
        formContato.reset();
        limparEndereco();
        cepStatus.textContent = '';
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
    }, 1200);
});