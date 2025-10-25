// 1. Seleciona sua barra de navegação pelo ID
const navbar = document.querySelector('#mainNavbar');

// 2. Define a "distância" de rolagem para ativar a sombra
// (pode ajustar esse valor, 10 pixels é um bom começo)
const scrollThreshold = 10;

// 3. Adiciona o "ouvinte" de evento de rolagem
window.addEventListener('scroll', () => {
    // 4. Verifica se a posição de rolagem é maior que o limite
    if (window.scrollY > scrollThreshold) {
        // Se rolou, adiciona a classe de sombra
        navbar.classList.add('shadow');
    } else {
        // Se está no topo, remove a classe de sombra
        navbar.classList.remove('shadow');
    }
});