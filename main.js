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

    let transitionTimeout;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Apply a global transition class to force smooth color changes on child elements
            document.documentElement.classList.add('theme-transition');

            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);

            // Clear previous timeout to prevent race condition bugs on rapid clicks
            if (transitionTimeout) {
                clearTimeout(transitionTimeout);
            }

            // Allow DOM to register the class before swapping colors
            requestAnimationFrame(() => {
                applyTheme(newTheme);

                // Cleanup after transition ends (0.4s match css)
                transitionTimeout = setTimeout(() => {
                    document.documentElement.classList.remove('theme-transition');
                }, 400);
            });
        });
    }

    // ==========================================================================
    // Unified High-Performance Scroll Handler
    // ==========================================================================
    let isScrolling = false;
    let lastScrollY = window.scrollY;

    // Cached DOM nodes for scroll events (prevents querying DOM every pixel)
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
    const scrollProgress = document.getElementById('scrollProgress');
    const marqueeParts = document.querySelectorAll('.marquee-part');

    // Set up marquee GSAP animation if exists
    let marqueeAnim = null;
    let direction = -1;
    let scrollTimeout = null;

    if (marqueeParts.length > 0 && typeof gsap !== 'undefined') {
        marqueeAnim = gsap.to(marqueeParts, {
            xPercent: -100,
            repeat: -1,
            duration: 20,
            ease: 'linear'
        });
    }

    // The single central function that handles all scroll-related paint updates
    const updateOnScroll = () => {
        const currentScrollY = window.scrollY;

        // 1. Sticky Navbar Effect
        if (navbar) {
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // 2. Active Link Highlighting (ScrollSpy)
        let currentSectionId = '';
        sections.forEach(section => {
            if (currentScrollY >= (section.offsetTop - 200)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });

        // 3. Scroll Progress Bar Update
        if (scrollProgress) {
            const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
            scrollProgress.style.width = scrollPercent + '%';
        }

        // 4. Infinite Horizontal Marquee Velocity Link
        if (marqueeAnim) {
            const delta = currentScrollY - lastScrollY;

            if (Math.abs(delta) > 5) {
                direction = delta > 0 ? -1 : 1;
                gsap.to(marqueeAnim, {
                    timeScale: direction * (1 + Math.abs(delta) * 0.05),
                    duration: 0.2,
                    overwrite: true
                });
            }

            // Decelerate when scrolling stops
            if (scrollTimeout) window.clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                gsap.to(marqueeAnim, {
                    timeScale: direction,
                    duration: 0.8,
                    overwrite: true
                });
            }, 50);
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        isScrolling = false;
    };

    // Single Scroll Listener mapped to requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(updateOnScroll);
            isScrolling = true;
        }
    }, { passive: true });

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
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .reveal-on-scroll');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // (Scroll Spy logic successfully migrated to the Unified Handler above)

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

            const btn = form.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // Prepare data for Web3Forms (A submissão do Captcha deles proíbe JSON, o formato tem que ser FormData)
            const formData = new FormData(form);

            try {
                // Send real request to Web3Forms usando Form Data nativo sem header restrictivo
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.status == 200) {
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
                    btn.textContent = result.message || 'Erro ao enviar. Tente novamente.';
                    btn.style.background = '#e74c3c'; // Error color
                    btn.style.color = '#fff';
                }
            } catch (error) {
                console.error(error);
                btn.textContent = 'Erro de conexão. Tente novamente.';
                btn.style.background = '#e74c3c'; // Error color
                btn.style.color = '#fff';
            } finally {
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

    // 8. (Removed Timeline Logic) - Now handled natively by CSS Sticky and reveal-on-scroll IntersectionObserver.

    // 9. Magnetic Buttons Logic (GSAP)
    if (typeof gsap !== 'undefined') {
        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                // Calcula a distância do centro do botão para o cursor
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3, // Força de "puxada" horizontal
                    y: y * 0.3, // Força de "puxada" vertical
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                // Efeito elástico ao voltar pro lugar
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }

    // 10. Text Reveal Animation (GSAP + SplitType)
    if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const revealTexts = document.querySelectorAll('.reveal-text');

        revealTexts.forEach((textElement) => {
            // Split the text into lines and characters
            const split = new SplitType(textElement, { types: 'lines, chars' });

            // Show the element now that it's split (prevents FOUC)
            textElement.classList.add('split-ready');

            // Setup the GSAP animation
            gsap.from(split.chars, {
                scrollTrigger: {
                    trigger: textElement,
                    start: 'top 85%', // Anima quando o topo do elemento atinge 85% da tela
                    toggleActions: 'play none none none' // Toca uma vez
                },
                y: 30, // Move up less distance
                opacity: 0,
                duration: 0.5, // Mais rápido
                stagger: 0.015, // Delay bem curto
                ease: 'power2.out'
            });
        });

        // 11. Image/Map Curtain Reveal (Parallax)
        const curtains = document.querySelectorAll('.reveal-curtain');

        curtains.forEach(curtain => {
            const overlay = curtain.querySelector('.curtain-overlay');
            const media = curtain.querySelector('iframe') || curtain.querySelector('img');

            if (overlay && media) {
                // Pre set states
                gsap.set(curtain, { visibility: 'visible' });
                gsap.set(media, { scale: 1.2 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: curtain,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });

                tl.to(overlay, {
                    scaleY: 0,
                    transformOrigin: 'top center',
                    ease: 'power2.inOut',
                    duration: 0.8
                })
                    .to(media, {
                        scale: 1,
                        ease: 'power2.out',
                        duration: 1.0
                    }, "-=0.5"); // Começa um pouco antes da cortina terminar
            }
        });

        // 12. Service Cards Stagger Reveal
        const serviceCardsReveal = document.querySelectorAll('.reveal-card');
        if (serviceCardsReveal.length > 0) {
            gsap.to(serviceCardsReveal, {
                scrollTrigger: {
                    trigger: '.services-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.05, // Efeito cascata lindo e rápido
                ease: 'back.out(1.5)'
            });
        }

        // 13. Custom Interactive Cursor (GSAP quickSetter)
        const customCursor = document.querySelector('.custom-cursor');

        if (customCursor) {
            // Check if it's a touch device, if so, we disable the custom cursor
            const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

            if (!isTouchDevice) {
                // Highly performant setters for cursor position
                const setX = gsap.quickSetter(customCursor, "x", "px");
                const setY = gsap.quickSetter(customCursor, "y", "px");

                window.addEventListener('mousemove', (e) => {
                    setX(e.clientX);
                    setY(e.clientY);
                });

                // Add active state to buttons/links
                const interactiveElements = document.querySelectorAll('a, button, .service-card, .timeline-item');
                interactiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => customCursor.classList.add('active'));
                    el.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
                });

                // Add active state to Text (Letreiros)
                const textElements = document.querySelectorAll('h1, h2, h3');
                textElements.forEach(el => {
                    el.addEventListener('mouseenter', () => customCursor.classList.add('text-active'));
                    el.addEventListener('mouseleave', () => customCursor.classList.remove('text-active'));
                });

                // Hide cursor when leaving window
                document.addEventListener('mouseleave', () => {
                    customCursor.classList.add('hidden');
                });

                document.addEventListener('mouseenter', () => {
                    customCursor.classList.remove('hidden');
                });
            } else {
                customCursor.style.display = 'none'; // Fallback cleanup
            }
        }

        // 14. 3D Hover Cards (Holographic Tilt Effect)
        const tiltCards = document.querySelectorAll('.service-card');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // X position within card
                const y = e.clientY - rect.top;  // Y position within card

                // Set CSS variables for holographic glow effect origin
                card.style.setProperty('--mouseX', `${x}px`);
                card.style.setProperty('--mouseY', `${y}px`);

                // Calculate Rotation: mapping position to degree logic (-10deg to 10deg)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -15; // Vertical rotation limits to 15deg
                const rotateY = ((x - centerX) / centerX) * 15;  // Horizontal rotation limits to 15deg

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    ease: 'power1.out',
                    duration: 0.4
                });
            });

            card.addEventListener('mouseleave', () => {
                // Snap back to zero
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: 'elastic.out(1, 0.3)',
                    duration: 1.2
                });
            });
        });

        // 15. Infinite Horizontal Marquee with Scroll Velocity
        const marqueeParts = document.querySelectorAll('.marquee-part');
        // (Infinite Marquee logic successfully migrated to the Unified Handler above)
    }

    // 16. Hero Section 3D Mouse Parallax
    const heroSection = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    if (heroSection && heroContent && window.innerWidth >= 992 && typeof gsap !== 'undefined') {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 35;
            const y = (window.innerHeight / 2 - e.pageY) / 35;

            gsap.to(heroContent, {
                x: x,
                y: y,
                duration: 1,
                ease: 'power2.out'
            });
        });
    }

    // 17. Footer Reveal Effect
    const footer = document.querySelector('.footer');
    const mainContent = document.getElementById('mainContent');

    function initFooterReveal() {
        if (footer && mainContent && window.innerWidth >= 992) {
            // Determine background color fallback
            const bodyBg = getComputedStyle(document.body).backgroundColor;

            mainContent.style.marginBottom = `${footer.offsetHeight}px`;
            mainContent.style.backgroundColor = bodyBg;
            mainContent.style.position = 'relative';
            mainContent.style.zIndex = '2';
            mainContent.style.boxShadow = '0 10px 15px rgba(0,0,0,0.15)';

            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.left = '0';
            footer.style.width = '100%';
            footer.style.zIndex = '1';
        } else if (footer && mainContent) {
            // Reset for mobile
            mainContent.style.marginBottom = '';
            mainContent.style.position = '';
            mainContent.style.zIndex = '';
            mainContent.style.boxShadow = '';
            footer.style.position = '';
        }
    }

    // Initial call and on resize
    initFooterReveal();
    window.addEventListener('resize', initFooterReveal);

    // Listen for theme toggle to update mainContent background
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Wait for color transitions to finish completely before forcing a DOM layout recalculation (avoids stuttering)
            setTimeout(() => {
                requestAnimationFrame(initFooterReveal);
            }, 450);
        });
    }
});
