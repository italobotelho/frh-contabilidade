document.addEventListener('DOMContentLoaded', function () {

    // --- Script do Offcanvas Dinâmico de Serviços ---
    const servicoOffcanvas = document.getElementById('servicoOffcanvas');
    
    // 1. Verificação (garante que o offcanvas existe na página)
    if (servicoOffcanvas) {
        
        // 2. Listener que PREENCHE os dados quando o offcanvas é aberto
        servicoOffcanvas.addEventListener('show.bs.offcanvas', function (event) {
            // Pega o card (a tag <a>) que foi clicado
            const card = event.relatedTarget; 
            
            // Pega os dados dos data-attributes do card
            const title = card.getAttribute('data-title');
            const image = card.getAttribute('data-image');
            const description = card.getAttribute('data-description');
            const itemsJson = card.getAttribute('data-items');

            // Acha os elementos vazios dentro do offcanvas
            const offcanvasTitle = servicoOffcanvas.querySelector('.offcanvas-title');
            const offcanvasImage = servicoOffcanvas.querySelector('#servicoOffcanvasImage');
            const offcanvasDescription = servicoOffcanvas.querySelector('#servicoOffcanvasDescription');
            const offcanvasList = servicoOffcanvas.querySelector('#servicoOffcanvasList');

            // Preenche os elementos com os dados
            offcanvasTitle.textContent = title;
            offcanvasImage.src = image;
            offcanvasDescription.textContent = description;

            // Limpa a lista antiga e preenche a nova
            offcanvasList.innerHTML = '';
            if (itemsJson) {
                try {
                    // Converte o texto JSON em uma lista real
                    const items = JSON.parse(itemsJson);
                    // Cria um <li> para cada item da lista
                    items.forEach(item => {
                        offcanvasList.innerHTML += `<li><i class="bi bi-check-circle-fill"></i> ${item}</li>`;
                    });
                } catch (e) {
                    console.error("Erro ao processar data-items JSON:", e);
                }
            }
        });
    } else {
        console.error("Elemento #servicoOffcanvas não encontrado.");
    }

    // 3. (IMPORTANTE) Prevenir o "salto" dos links <a>
    // Encontra todos os seus cards de serviço
    const servicoCards = document.querySelectorAll('a.value-card[data-bs-toggle="offcanvas"]');
    servicoCards.forEach(card => {
        card.addEventListener('click', (event) => {
            // Impede que o href="#" mude a URL e "pule" a página ao clicar
            event.preventDefault();
        });
    });
    
    // 1. Pega os ELEMENTOS do formulário
    const submitButton = document.getElementById('submit-whatsapp');
    const nomeInput = document.getElementById('form-nome');
    const emailInput = document.getElementById('form-email');
    const telefoneInput = document.getElementById('form-telefone');
    const empresaInput = document.getElementById('form-empresa');
    const mensagemInput = document.getElementById('form-mensagem');

    // 2. Defina os números de telefone das sócias
    const telefones = {
        ana: '5519999831973', // <-- TROQUE PELO NÚMERO DA ANA
        alexandra: '55119YYYYYYYY'   // <-- TROQUE PELO NÚMERO DA ALEXANDRA
    };

    // 3. (API 1) Inicializa a MÁSCARA de Telefone
    const mascaraTelefone = {
        mask: [
            { mask: '(00) 0000-0000' }, // Telefone fixo
            { mask: '(00) 00000-0000' } // Celular
        ]
    };
    const telefoneMask = IMask(telefoneInput, mascaraTelefone);

    // 4. (API 2) Função de Validação de E-mail (Regex)
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarNomeCompleto(nome) {    
        // Esta Regex aceita letras, acentos e espaços.
        // Exige pelo menos duas "palavras" (nomes), cada uma com 2+ caracteres.
        const regex = /^[a-zA-ZÀ-ú']{2,}(\s[a-zA-ZÀ-ú']{2,})+$/;
        return regex.test(nome.trim());
    }

    // --- FIM DA CONFIGURAÇÃO ---

    // 5. Adiciona o "ouvinte" de clique ao botão
    submitButton.addEventListener('click', function() {

        // --- INÍCIO DA VALIDAÇÃO AVANÇADA ---
        
        let isValid = true;
        
        // Limpa todos os erros antigos
        [nomeInput, emailInput, telefoneInput, mensagemInput].forEach(campo => {
            campo.classList.remove('form-field-error');
        });

        // 6. VALIDAÇÕES ESPECÍFICAS
        
        // Valida Nome (tem que ter pelo menos 2 palavras, ex: "Ana Paula")
        if (!validarNomeCompleto(nomeInput.value)) {
            nomeInput.classList.add('form-field-error');
            isValid = false;
        }

        // Valida E-mail (usa a API de Regex)
        if (!validarEmail(emailInput.value)) {
            emailInput.classList.add('form-field-error');
            isValid = false;
        }

        // Valida Telefone (usa a API de Máscara)
        // Verifica se o número (sem a máscara) tem 10 ou 11 dígitos
        const numeroTelefone = telefoneMask.unmaskedValue;
        if (numeroTelefone.length < 10) {
            telefoneInput.classList.add('form-field-error');
            isValid = false;
        }

        // Valida Mensagem (tem que ter pelo menos 10 caracteres)
        if (mensagemInput.value.trim().length < 10) {
            mensagemInput.classList.add('form-field-error');
            isValid = false;
        }

        // 7. Se o formulário NÃO for válido, pare aqui
        if (!isValid) {
            alert('Por favor, verifique os campos destacados em vermelho.');
            return; // Interrompe a função
        }

        // --- FIM DA VALIDAÇÃO ---

        // 8. Se chegou aqui, o formulário é VÁLIDO.
        // Pega os valores (o do telefone já vem formatado pela máscara)
        const nome = nomeInput.value;
        const email = emailInput.value;
        const telefone = telefoneInput.value; // A máscara já formata!
        const empresa = empresaInput.value;
        const mensagem = mensagemInput.value;

        // 9. Pega a sócia
        const sociaSelecionada = document.querySelector('input[name="socia"]:checked').value;
        const nomeSocia = sociaSelecionada === 'ana' ? 'Ana' : 'Alexandra';
        const numeroDestino = telefones[sociaSelecionada];

        // 10. Constrói a mensagem formatada
        let mensagemFormatada = `Olá, ${nomeSocia}! Tudo bem?\n\n`;
        mensagemFormatada += `Vi o formulário no site e gostaria de um contato.\n\n`;
        
        // A mensagem que o cliente digitou
        mensagemFormatada += `*Minha necessidade é a seguinte:*\n${mensagem}\n\n`;
        
        // Os dados do cliente, formatados como uma assinatura
        mensagemFormatada += `*Seguem meus dados para o retorno:*\n`;
        mensagemFormatada += `*Nome:* ${nome}\n`;
        mensagemFormatada += `*Telefone:* ${telefone}\n`;
        mensagemFormatada += `*E-mail:* ${email}\n`;
        
        if (empresa) {
            mensagemFormatada += `*Empresa:* ${empresa}\n`;
        }
        
        mensagemFormatada += `\nAguardo seu contato. Obrigado!`;


        // 11. Codifica e abre o link do WhatsApp
        const mensagemCodificada = encodeURIComponent(mensagemFormatada);
        const urlWhatsApp = `https://wa.me/${numeroDestino}?text=${mensagemCodificada}`;
        window.open(urlWhatsApp, '_blank');
    });
});

const navbar = document.querySelector('#mainNavbar');
const scrollThreshold = 10;

window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
        navbar.classList.add('shadow');
    } else {
        navbar.classList.remove('shadow');
    }
});

function openWhatsApp() {
    const whatsappURL = "https://wa.me/5511999999999?text=Ol%C3%A1!%20Vi%20o%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.";

    window.open(whatsappURL, '_blank');
}