document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('themeToggle');
    const headerLogo = document.getElementById('headerLogo');
    const footerLogo = document.getElementById('footerLogo');

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        const isDark = theme === 'dark';

        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        }
        if (headerLogo) headerLogo.src = isDark ? 'assets/images/logo-4.png' : 'assets/images/logo.png';
        if (footerLogo) footerLogo.src = isDark ? 'assets/images/logo-footer.png' : 'assets/images/logo.png';
    };

    // Check saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // 3. Sticky Navbar Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        const toggleMenu = (forceClose = false) => {
            const isActive = forceClose ? false : !navLinks.classList.contains('active');
            navLinks.classList.toggle('active', isActive);

            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
            }
        };

        mobileBtn.addEventListener('click', () => toggleMenu());

        // Use Event Delegation to close menu when clicking a link
        navLinks.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && e.target.tagName === 'A') {
                toggleMenu(true);
            }
        });
    }

    // 4. Scroll Reveal Animations using Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Select all elements with fade-in classes
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 5. Active Link Highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 6. Form Validation & Submission (Demo with UX/UI)
    const form = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        // Phone Input Mask: (11) 98765-4321
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            if (x) {
                e.target.value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? '-' + x[3] : ''}`;
            }
        });
    }

    if (form) {
        // Seleciona APENAS os campos de ação do usuário, ignorando as chaves ocultas do Web3Forms
        const inputs = form.querySelectorAll('.form-group input, .form-group textarea');

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateInput(input);
                }
            });
        });

        function validateInput(input) {
            const formGroup = input.closest('.form-group');
            if (!formGroup) return true; // Previne erros caso um input sem form-group chame a função

            let isValid = input.checkValidity();

            // Custom phone validation (ensure it has at least 10 digits)
            if (input.id === 'phone') {
                const phoneDigits = input.value.replace(/\D/g, '');
                isValid = phoneDigits.length >= 10 && phoneDigits.length <= 11;
            }

            if (isValid) {
                input.classList.remove('invalid');
                input.classList.add('valid');
                formGroup.classList.remove('has-error');
            } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
                formGroup.classList.add('has-error');
            }
            return isValid;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            let isFormValid = true;

            // Força validação visual em TODOS os inputs ao clicar em Enviar
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isFormValid = false;
                    // Garante que a classe de erro visual (vermelha) seja aplicada imediatamente
                    input.classList.remove('valid');
                    input.classList.add('invalid');
                    input.closest('.form-group').classList.add('has-error');
                }
            });

            if (!isFormValid) {
                // Trigger shake animation no formulário todo
                form.classList.remove('shake');
                void form.offsetWidth; // trigger reflow mágico do navegador
                form.classList.add('shake');
                return;
            }

            // Verificação do hCaptcha usando a API oficial do hcaptcha (mais confiável)
            let captchaResponse = '';
            if (typeof hcaptcha !== 'undefined') {
                captchaResponse = hcaptcha.getResponse();
            }

            if (!captchaResponse) {
                // Impede o envio e notifica graficamente criando aquele shake geral ou mudando uma cor se desejar
                const captchaContainer = form.querySelector('.h-captcha');
                if (captchaContainer) {
                    captchaContainer.style.border = '1px solid #e74c3c';
                    captchaContainer.style.borderRadius = '4px';
                    setTimeout(() => { captchaContainer.style.border = 'none'; }, 3000);
                }

                // Trigger shake animation no formulário todo para alertar o erro global
                form.classList.remove('shake');
                void form.offsetWidth;
                form.classList.add('shake');
                return; // Paralisa aqui
            }

            const btn = form.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // Prepare data for Web3Forms 
            const formData = new FormData(form);

            // Web3Forms espera o campo h-captcha-response explícito
            formData.set('h-captcha-response', captchaResponse);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.status === 200) {
                    btn.textContent = 'Mensagem Enviada!';
                    btn.style.background = '#25D366'; // Success color
                    btn.style.color = '#fff';

                    // Reset form and validation states
                    form.reset();
                    inputs.forEach(input => {
                        input.classList.remove('valid', 'invalid');
                        input.closest('.form-group').classList.remove('has-error');
                    });
                } else {
                    console.error(result);
                    btn.textContent = 'Erro ao enviar. Tente novamente.';
                    btn.style.background = '#e74c3c'; // Error color
                    btn.style.color = '#fff';
                }
            } catch (error) {
                console.error(error);
                btn.textContent = 'Erro de conexão. Tente novamente.';
                btn.style.background = '#e74c3c'; // Error color
                btn.style.color = '#fff';
            } finally {
                // Reseta o captcha nativamente
                if (typeof hcaptcha !== 'undefined') {
                    hcaptcha.reset();
                }

                // Reset button state after 3 seconds
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 3000);
            }
        });
    }

    // 7. Service Modal Logic
    const serviceData = {
        'contabilidade': {
            title: 'Contabilidade em Geral',
            icon: 'fa-calculator',
            description: 'Rotina contábil completa para garantir a saúde financeira e a conformidade da sua empresa com as normas vigentes.',
            features: [
                'Escrituração contábil (Lucro Real, Presumido e Simples)',
                'Elaboração de Balanços e Balancetes',
                'Demonstração de Resultados (DRE)',
                'Relatórios gerenciais para tomada de decisão'
            ],
            whatsapp: 'Olá, gostaria de saber mais sobre os serviços de Contabilidade em Geral.'
        },
        'abertura': {
            title: 'Abertura e Regularização',
            icon: 'fa-building-circle-check',
            description: 'Descomplicamos o processo de legalização do seu negócio, cuidando de cada detalhe burocrático de ponta a ponta.',
            features: [
                'Abertura, alteração e encerramento de empresas',
                'Emissão de Alvarás e Licenças',
                'Regularização de pendências em órgãos públicos',
                'Escolha do melhor enquadramento tributário'
            ],
            whatsapp: 'Olá, gostaria de saber mais sobre Abertura ou Regularização de empresas.'
        },
        'imposto-renda': {
            title: 'Imposto de Renda (IRPF/IRPJ)',
            icon: 'fa-file-invoice-dollar',
            description: 'Segurança e agilidade na declaração do seu Imposto de Renda, para Pessoas Físicas e Jurídicas.',
            features: [
                'Análise de rendimentos e despesas dedutíveis',
                'Declaração anual do IRPF',
                'Declarações acessórias de IRPJ',
                'Planejamento para redução legal do imposto a pagar'
            ],
            whatsapp: 'Olá, gostaria de ajuda com a declaração do meu Imposto de Renda.'
        },
        'cpf': {
            title: 'Regularização do CPF',
            icon: 'fa-id-card',
            description: 'Resolvemos pendências e malha fina junto à Receita Federal para que seu documento volte a ficar regular.',
            features: [
                'Consulta unificada de situação cadastral',
                'Atendimento à malha fina fiscal',
                'Parcelamento de débitos federais',
                'Justificativas e correção de declarações anteriores'
            ],
            whatsapp: 'Olá, preciso de ajuda para regularizar a situação do meu CPF.'
        },
        'diso': {
            title: 'Regularização de Obra (DISO)',
            icon: 'fa-helmet-safety',
            description: 'Gerenciamos toda a documentação da sua obra para emissão rápida da Certidão Negativa de Débitos (CND).',
            features: [
                'Cálculo e aferição de obra no SERO',
                'Preenchimento de formulários DISO',
                'Emissão de CND de obra junto à Receita/INSS',
                'Regularização de obras antigas ou inacabadas'
            ],
            whatsapp: 'Olá, gostaria de mais informações sobre regularização de obra civil (DISO/CND).'
        },
        'incra': {
            title: 'INCRA',
            icon: 'fa-tractor',
            description: 'Serviços especializados para produtores e proprietários rurais manterem seus imóveis totalmente regulares.',
            features: [
                'Cadastro e Atualização no CCIR / INCRA',
                'Processo de emissão do Certificado de Cadastro',
                'Baixa e transferências de áreas',
                'Vinculação NIRF e CAR'
            ],
            whatsapp: 'Olá, procuro serviços contábeis relacionados ao INCRA.'
        },
        'itr': {
            title: 'Imposto Territorial Rural (ITR)',
            icon: 'fa-tree',
            description: 'Declaração obrigatória para imóveis rurais realizada com conhecimento em legislação do agronegócio.',
            features: [
                'Elaboração e entrega anual do ITR',
                'Cálculo e apuração de DITR',
                'Retificação de declarações de anos anteriores',
                'Cruzamento de dados CCIR / ITR / ADA'
            ],
            whatsapp: 'Olá, gostaria de fazer a entrega ou retificação do ITR.'
        },
        'aposentadoria': {
            title: 'Aposentadoria e Outros',
            icon: 'fa-user-clock',
            description: 'Planejamento previdenciário e suporte em diversos serviços complementares que facilitam sua vida.',
            features: [
                'Contagem de tempo de contribuição',
                'Simulação de valores e melhor regra de transição',
                'Encaminhamento de benefícios',
                'Atendimento presencial e digital'
            ],
            whatsapp: 'Olá, gostaria de conversar sobre Aposentadoria ou Planejamento Previdenciário.'
        }
    };

    const serviceCards = document.querySelectorAll('.service-card[data-service]');
    const modal = document.getElementById('serviceModal');
    const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;

    if (modal && serviceCards.length > 0) {
        const titleEl = document.getElementById('modalTitle');
        const iconEl = document.getElementById('modalIcon');
        const descEl = document.getElementById('modalDescription');
        const featuresEl = document.getElementById('modalFeaturesList');
        const whatsappBtn = document.getElementById('modalWhatsappBtn');

        // Use Event Delegation for opening modals
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.service-card[data-service]');
                if (!card) return;

                e.preventDefault();
                const serviceKey = card.dataset.service;
                const data = serviceData[serviceKey];

                if (data) {
                    titleEl.textContent = data.title;
                    iconEl.className = `fas ${data.icon}`;
                    descEl.textContent = data.description;

                    featuresEl.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

                    const phoneNumber = '551140028922';
                    whatsappBtn.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(data.whatsapp)}`;

                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    const modalContent = modal.querySelector('.modal-content');
                    if (modalContent) modalContent.scrollTop = 0;
                }
            });
        }

        // Close modal functions
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        };

        modalCloseBtn.addEventListener('click', closeModal);

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // 8. History Slideshow Logic
    const slideshowContainer = document.getElementById('historySlideshow');
    if (slideshowContainer) {
        const slides = slideshowContainer.querySelectorAll('.history-slide');
        let currentSlide = 0;
        const slideInterval = 4000; // Troca a cada 4 segundos

        if (slides.length > 1) {
            setInterval(() => {
                // Remove active from current
                slides[currentSlide].classList.remove('active');

                // Move to next slide
                currentSlide = (currentSlide + 1) % slides.length;

                // Add active to new
                slides[currentSlide].classList.add('active');
            }, slideInterval);
        }
    }
});
