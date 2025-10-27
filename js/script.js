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