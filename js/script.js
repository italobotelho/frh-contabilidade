// Exemplo: Validação básica do formulário
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.querySelector('input[placeholder="Nome"]').value;
    const email = document.querySelector('input[placeholder="E-mail"]').value;
    if (nome && email) {
        alert('Mensagem enviada! Entraremos em contato em breve.');
        // Aqui, integre com EmailJS ou Formspree para envio real
    } else {
        alert('Preencha os campos obrigatórios.');
    }
});