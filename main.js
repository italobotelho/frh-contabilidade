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
            // Pill toggle: ícones são estáticos, CSS controla o estado via [data-theme]
            themeToggleBtn.setAttribute('aria-checked', String(isDark));
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
    const globalBg = document.querySelector('.fixed-global-bg');

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



        // 3. Scroll Progress Bar Update
        if (scrollProgress) {
            const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0;
            const scrollRatio = docHeight > 0 ? (currentScrollY / docHeight) : 0;
            
            scrollProgress.style.width = scrollPercent + '%';
            
            // Dynamic Background Intensity Effect
            if (globalBg) {
                globalBg.style.setProperty('--scroll-ratio', scrollRatio);
            }
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

    // 5. Active Link Highlighting (Modern ScrollSpy)
    const spyOptions = {
        root: null,
        rootMargin: '-40% 0px -60% 0px', // Detecção no centro-topo da tela
        threshold: 0
    };

    // Fix 7: Rastreia quantas seções estão atualmente intersectando
    let intersectingCount = 0;

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                intersectingCount++;
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
                });
            } else {
                intersectingCount = Math.max(0, intersectingCount - 1);
            }
        });

        // Se nenhuma seção estiver na zona de detecção (ex: topo da página),
        // limpa todos os links ativos para não deixar o último "preso"
        if (intersectingCount === 0) {
            navItems.forEach(item => item.classList.remove('active'));
        }
    }, spyOptions);

    sections.forEach(section => {
        if (section.getAttribute('id')) spyObserver.observe(section);
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

                    const modalBody = modal.querySelector('.modal-body');
                    if (modalBody) modalBody.scrollTop = 0;
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

    // 9. Magnetic Buttons Logic (GSAP)
    if (typeof gsap !== 'undefined') {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 992px) and (pointer: fine)", () => {
            const magneticBtns = document.querySelectorAll('.magnetic-btn');

            magneticBtns.forEach((btn) => {
                const xTo = gsap.quickTo(btn, "x", {duration: 0.5, ease: "power2.out"});
                const yTo = gsap.quickTo(btn, "y", {duration: 0.5, ease: "power2.out"});

                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    xTo(x * 0.3);
                    yTo(y * 0.3);
                });

                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
                });
            });
        });
    }

    // 10. Text Reveal Animation (GSAP + SplitType)
    if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        let mm = gsap.matchMedia();

        mm.add("(min-width: 992px)", () => {
            const revealTexts = document.querySelectorAll('.reveal-text');

            revealTexts.forEach((textElement) => {
                const split = new SplitType(textElement, { types: 'lines, chars' });
                textElement.classList.add('split-ready');

                gsap.from(split.chars, {
                    scrollTrigger: {
                        trigger: textElement,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.015,
                    ease: 'power2.out'
                });
            });
        });
    }

    // 11. Image/Map Curtain Reveal (Parallax)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 992px)", () => {
            const curtains = document.querySelectorAll('.reveal-curtain');

            curtains.forEach(curtain => {
                const overlay = curtain.querySelector('.curtain-overlay');
                const media = curtain.querySelector('iframe') || curtain.querySelector('img');

                if (overlay && media) {
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
                    }).to(media, {
                        scale: 1,
                        ease: 'power2.out',
                        duration: 1.0
                    }, "-=0.5");
                }
            });
        });
    }

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
                const interactiveElements = document.querySelectorAll('a, button, .service-card');
                interactiveElements.forEach(el => {
                    el.addEventListener('mouseenter', () => customCursor.classList.add('active'));
                    el.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
                });

                // Add active state to Text (Letreiros e Ícones vazados)
                const textElements = document.querySelectorAll('h1, h2, h3, .modal-icon-wrapper');
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
    if (typeof gsap !== 'undefined') {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 992px) and (pointer: fine)", () => {
            const tiltCards = document.querySelectorAll('.service-card');

            tiltCards.forEach(card => {
                gsap.set(card, { transformPerspective: 1000 });
                
                const yTo = gsap.quickTo(card, "y", {duration: 0.4, ease: "power1.out"});
                const rotXTo = gsap.quickTo(card, "rotationX", {duration: 0.4, ease: "power1.out"});
                const rotYTo = gsap.quickTo(card, "rotationY", {duration: 0.4, ease: "power1.out"});

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    card.style.setProperty('--mouseX', `${x}px`);
                    card.style.setProperty('--mouseY', `${y}px`);

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -15;
                    const rotateY = ((x - centerX) / centerX) * 15;

                    yTo(-10);
                    rotXTo(rotateX);
                    rotYTo(rotateY);
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        y: 0,
                        rotationX: 0,
                        rotationY: 0,
                        ease: 'elastic.out(1, 0.3)',
                        duration: 1.2
                    });
                });
            });
        });
    }

    // 15. History Scrollytelling
    const historySection = document.querySelector('.history');
    if (historySection && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && window.innerWidth >= 992) {
        const historyCards = document.querySelectorAll('.history-card');
        const historyImages = document.querySelectorAll('.history-image');
        const progressLine = document.querySelector('.history-line-progress');

        // History Progress Line Filling Effect
        if (progressLine) {
            gsap.to(progressLine, {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.history-cards-wrapper',
                    start: 'top 50%',
                    end: 'bottom 50%',
                    scrub: true
                }
            });
        }

        // Mapping images to cards scroll progress
        historyCards.forEach((card, index) => {
            // Determine which image should show for this card
            // Card 0 & 1 (Initial stages) -> Image 1
            // Card 2 (Digital/Innovation) -> Image 2
            // Card 3 (Present day) -> Image 3
            let imageIndex = 0;
            if (index === 2) imageIndex = 1;
            if (index === 3) imageIndex = 2;

            ScrollTrigger.create({
                trigger: card,
                start: 'top 60%',
                onEnter: () => transitionHistoryImage(imageIndex),
                onEnterBack: () => transitionHistoryImage(imageIndex)
            });
        });

        function transitionHistoryImage(targetIndex) {
            historyImages.forEach((img, i) => {
                const isTarget = i === targetIndex;
                if (isTarget) {
                    gsap.to(img, { 
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: 'power3.out'
                    });
                } else {
                    // Check if it's currently visible to avoid redundant animations
                    if (parseFloat(gsap.getProperty(img, "opacity")) > 0) {
                        gsap.to(img, { 
                            opacity: 0,
                            scale: 1.1,
                            duration: 1,
                            ease: 'power3.inOut'
                        });
                    }
                }
            });
        }
    }

    // 16. Hero Section 3D Mouse Parallax
    if (typeof gsap !== 'undefined') {
        let mm = gsap.matchMedia();

        mm.add("(min-width: 992px) and (pointer: fine)", () => {
            const heroSection = document.querySelector('.hero');
            const heroContent = document.querySelector('.hero-content');
            
            if (heroSection && heroContent) {
                const xTo = gsap.quickTo(heroContent, "x", {duration: 1, ease: "power2.out"});
                const yTo = gsap.quickTo(heroContent, "y", {duration: 1, ease: "power2.out"});

                heroSection.addEventListener('mousemove', (e) => {
                    const x = (window.innerWidth / 2 - e.pageX) / 35;
                    const y = (window.innerHeight / 2 - e.pageY) / 35;

                    xTo(x);
                    yTo(y);
                });
            }
        });
    }

    // Funcionalidade de Footer Reveal Removida (A nova Arquitetura Single-Page Fixed Background exige fundo transparente global inviabilizando uso de z-index de sobreposição do mainContent)

    // 17. FAQ Accordion
    const faqList = document.querySelector('.faq-list');
    if (faqList) {
        faqList.addEventListener('click', (e) => {
            const btn = e.target.closest('.faq-question');
            if (!btn) return;

            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('is-open');

            // Fecha todos os outros itens abertos (accordion behavior)
            document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('is-open');
                    openItem.querySelector('.faq-answer').style.maxHeight = '0';
                    openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Alterna o item clicado
            if (isOpen) {
                item.classList.remove('is-open');
                answer.style.maxHeight = '0';
                btn.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('is-open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // 18. Badge de Horário — LED verde/vermelho conforme expediente (Brasília)
    function updateScheduleBadge() {
        const dot        = document.querySelector('.badge-dot');
        const statusText = document.querySelector('.trust-status-text');
        if (!dot || !statusText) return;

        // Hora atual no fuso horário de São Paulo (UTC-3 / UTC-2 no horário de verão)
        const now   = new Date();
        const spNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
        const day   = spNow.getDay();   // 0 = Dom, 1 = Seg … 6 = Sáb
        const mins  = spNow.getHours() * 60 + spNow.getMinutes();

        const isBusinessDay  = day >= 1 && day <= 5;        // Seg a Sex
        const isBusinessHour = mins >= 8 * 60 && mins < 17 * 60; // 08:00 – 17:00
        const isOpen         = isBusinessDay && isBusinessHour;

        dot.classList.toggle('badge-dot--closed', !isOpen);
        statusText.textContent = isOpen ? 'Aberto agora' : 'Fechado agora';
    }

    updateScheduleBadge();
    // Re-verifica a cada minuto (para páginas abertas durante a virada de horário)
    setInterval(updateScheduleBadge, 60_000);
});
