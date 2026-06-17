# FRH Contabilidade e Assessoria

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-success)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue)

Site institucional moderno, dinâmico e altamente otimizado para a **FRH Contabilidade**, escritório especializado em gestão contábil, tributária e assessoria empresarial localizado em Jaguariúna - SP.

## 🚀 Visão Geral

O projeto consiste em uma Landing Page sofisticada focada em conversão, apresentação de serviços e construção de autoridade da marca. Possui navegação suave, suporte a *Dark Mode*, e um formulário de contato integrado.

**Principais Serviços Destacados:**
- Contabilidade em Geral
- Abertura e Regularização de Empresas
- Imposto de Renda (IRPF e IRPJ)
- Regularização de CPF
- Regularização de Obra (DISO)
- INCRA e ITR
- Planejamento Previdenciário

## 🛠️ Tecnologias Utilizadas

Este site foi construído com as melhores práticas de desenvolvimento front-end moderno, sem a dependência de frameworks pesados, garantindo carregamento instantâneo.

- **HTML5 Semântico:** Estrutura otimizada para SEO e Acessibilidade.
- **CSS3 Vanilla (Minificado):** Estilização customizada com suporte nativo a Tema Claro/Escuro (CSS Variables).
- **JavaScript Vanilla (Minificado):** Controle de interações e formulários.
- **GSAP & ScrollTrigger:** Biblioteca de animações profissionais para efeitos de fade-in e scroll suave.
- **Split-Type:** Animações tipográficas avançadas.
- **Web3Forms:** Integração do formulário de contato via API sem necessidade de back-end próprio.

## ⚡ Otimizações de Performance

Uma atenção rigorosa foi dada ao desempenho (Core Web Vitals):

- **Imagens WebP:** Conversão de todas as imagens pesadas para o formato `.webp`, reduzindo drasticamente o consumo de banda.
- **Lazy Loading:** Carregamento sob demanda de imagens fora da viewport inicial (`loading="lazy"`).
- **Minificação de Assets:** Scripts e Estilos comprimidos (`style.min.css` e `main.min.js`).
- **Self-Hosting de Fontes:** As fontes do Google (`Inter` e `Playfair Display`) são hospedadas localmente, reduzindo requisições de DNS e garantindo total conformidade com a LGPD (sem vazamento de IPs).
- **Defer/Async Loading:** O carregamento de bibliotecas externas (GSAP, FontAwesome) ocorre sem bloquear a renderização da página (`defer` e truque `media="print"`).
- **.htaccess:** Políticas restritas de *Browser Caching* para ativos estáticos e compactação Gzip/Deflate (mod_deflate) ativadas.

## 📂 Estrutura de Arquivos

```text
/
├── index.html                 # Página Principal
├── politica-de-privacidade.html # Página de Política de Privacidade e LGPD
├── style.css                  # Arquivo CSS original
├── style.min.css              # Arquivo CSS otimizado para produção
├── main.js                    # Script original
├── main.min.js                # Script otimizado para produção
├── .htaccess                  # Configurações Apache (Cache e Gzip)
└── assets/                    # Ativos Estáticos
    ├── fonts/                 # Arquivos físicos das fontes (.woff2)
    ├── icons/                 # Favicons
    └── images/                # Imagens em WebP otimizadas
```

## 👨‍💻 Autor

Desenvolvido por **Ítalo Botelho**
