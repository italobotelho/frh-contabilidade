// Espera o documento carregar
document.addEventListener('DOMContentLoaded', function () {

  // Inicia o Swiper V2 (configuração clássica)
  const swiper = new Swiper('.servicos-slider-v2', {
    
    // === Loop Infinito ===
    loop: true,

    // === Autoplay ===
    // Rola a cada 3.5 segundos
    autoplay: {
      delay: 3500,
      disableOnInteraction: false, // Continua após o clique
    },
    
    // === Quantidade de Cards ===
    slidesPerView: 1, // Padrão para mobile
    spaceBetween: 20, // Espaço entre os cards

    // === Responsividade ===
    // Define quantos slides aparecem por tamanho de tela
    breakpoints: {
      // 2 cards em telas pequenas
      576: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // 3 cards em tablets
      768: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      // 5 cards em desktops (como na imagem)
      1200: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    },

    // === Setas de Navegação ===
    // Ativa as setas padrão (que estilizamos no CSS)
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    // Permite que o usuário "agarre" o slide com o mouse
    grabCursor: true,

  });

  // --- Script do Offcanvas Dinâmico de Serviços ---
  const servicoOffcanvas = document.getElementById('servicoOffcanvas');
    
  servicoOffcanvas.addEventListener('show.bs.offcanvas', function (event) { // MUDA AQUI
      // Pega o card (<a>) que foi clicado
      const card = event.relatedTarget;

      // Pega os dados dos data-attributes
      const title = card.getAttribute('data-title');
      const image = card.getAttribute('data-image');
      const description = card.getAttribute('data-description');
      const itemsJson = card.getAttribute('data-items');

      // Pega os elementos dentro do offcanvas
      const offcanvasTitle = servicoOffcanvas.querySelector('.offcanvas-title'); // MUDA AQUI
      const offcanvasImage = servicoOffcanvas.querySelector('#servicoOffcanvasImage'); // MUDA AQUI
      const offcanvasDescription = servicoOffcanvas.querySelector('#servicoOffcanvasDescription'); // MUDA AQUI
      const offcanvasList = servicoOffcanvas.querySelector('#servicoOffcanvasList'); // MUDA AQUI

      // Preenche o modal com as informações
      offcanvasTitle.textContent = title;
      offcanvasImage.src = image;
      offcanvasDescription.textContent = description;

      // Limpa a lista antiga e preenche a nova (se houver itens)
      offcanvasList.innerHTML = '';
      if (itemsJson) {
          const items = JSON.parse(itemsJson);
          items.forEach(item => {
              offcanvasList.innerHTML += `<li><i class="bi bi-check-circle-fill"></i> ${item}</li>`;
          });
      }
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