// Espera o documento carregar
document.addEventListener('DOMContentLoaded', function () {

  // ATENÇÃO: Verifique se você removeu o script do slider antigo
  // para não ter dois Swipers rodando na mesma página.

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