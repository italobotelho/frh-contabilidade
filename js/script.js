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