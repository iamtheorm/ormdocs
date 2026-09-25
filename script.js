// --- User Preferences (Theme, Font Size, Reader Mode) ---
(function() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') document.documentElement.setAttribute('data-theme', 'light');

    const currentFontSize = localStorage.getItem('fontSize') || '16';
    document.documentElement.style.setProperty('--base-font-size', currentFontSize + 'px');

    if (localStorage.getItem('readerMode') === 'true') {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.classList.add('reader-mode-active');
        });
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // --- Setup Controls ---
    const btnTheme = document.getElementById('theme-toggle') || document.getElementById('btn-theme');
    const btnReader = document.getElementById('reader-toggle') || document.getElementById('btn-reader');
    const btnTextMinus = document.getElementById('zoom-out') || document.getElementById('btn-text-minus');
    const btnTextPlus = document.getElementById('zoom-in') || document.getElementById('btn-text-plus');

    const updateThemeText = () => {
        if (btnTheme && btnTheme.classList.contains('text-btn')) {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            btnTheme.textContent = isLight ? 'Dark Mode' : 'Light Mode';
        }
    };
    
    const updateReaderText = () => {
        if (btnReader && btnReader.classList.contains('text-btn')) {
            const isReader = document.body.classList.contains('reader-mode-active');
            btnReader.textContent = isReader ? 'Exit Reader' : 'Reader Mode';
        }
    };

    updateThemeText();
    updateReaderText();

    if (btnTheme) btnTheme.addEventListener('click', () => {
        const target = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', target);
        localStorage.setItem('theme', target);
        updateThemeText();
    });

    if (btnReader) btnReader.addEventListener('click', () => {
        localStorage.setItem('readerMode', document.body.classList.toggle('reader-mode-active'));
        updateReaderText();
    });

    const updateFontSize = (delta) => {
        let size = parseInt(localStorage.getItem('fontSize') || '16', 10) + delta;
        if (size >= 12 && size <= 26) {
            document.documentElement.style.setProperty('--base-font-size', size + 'px');
            localStorage.setItem('fontSize', size);
        }
    };
    if (btnTextMinus) btnTextMinus.addEventListener('click', () => updateFontSize(-2));
    if (btnTextPlus) btnTextPlus.addEventListener('click', () => updateFontSize(2));

    // Clone marquee items for infinite scroll effect
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const clone = marqueeContent.cloneNode(true);
        document.querySelector('.marquee').appendChild(clone);
    }

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // Progress Bar and Scroll Spy for Dossier
    const progressBar = document.getElementById('progress-bar');
    const sections = document.querySelectorAll('.prose-section');
    const navLinks = document.querySelectorAll('.section-rail nav a');

    const updateDossierScroll = () => {
        // Progress bar
        if (progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        }

        // Scroll spy
        if (sections.length > 0 && navLinks.length > 0) {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(a => {
                a.classList.remove('is-active');
                if (a.getAttribute('href') === `#${current}`) {
                    a.classList.add('is-active');
                }
            });
        }
    };

    // Check on scroll
    window.addEventListener('scroll', () => {
        revealOnScroll();
        updateDossierScroll();
    });
    
    // Initial call
    updateDossierScroll();

    // --- Code Syntax Highlighting (Prism.js) ---
    const prismCss = document.createElement('link');
    prismCss.rel = 'stylesheet';
    prismCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
    document.head.appendChild(prismCss);

    // Auto-add language-javascript class to code blocks if missing
    document.querySelectorAll('pre code').forEach(block => {
        if (!block.className.includes('language-')) {
            block.classList.add('language-javascript');
        }
    });

    const loadScript = (src) => new Promise(resolve => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        document.body.appendChild(s);
    });

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js').then(() => {
        Promise.all([
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js'),
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js')
        ]).then(() => {
            if (window.Prism) {
                Prism.highlightAll();
            }
        });
    });

    // --- Apply Custom CodeBlock UI Wrapper ---
    document.querySelectorAll('.prose-section pre').forEach(pre => {
        // Skip if already wrapped
        if (pre.parentElement.classList.contains('code-block-wrapper')) return;

        // Extract potential filename from previous paragraph or default
        let filename = 'terminal';
        if (pre.previousElementSibling && pre.previousElementSibling.tagName === 'P') {
            const strongTag = pre.previousElementSibling.querySelector('strong');
            if (strongTag && strongTag.textContent.includes('.')) {
                filename = strongTag.textContent;
            }
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        
        const header = document.createElement('div');
        header.className = 'code-block-header';
        
        const filenameSpan = document.createElement('span');
        filenameSpan.className = 'code-block-filename';
        filenameSpan.textContent = filename;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-block-copy';
        copyBtn.title = 'Copy code';
        copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        
        copyBtn.addEventListener('click', () => {
            const code = pre.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                }, 2000);
            });
        });
        
        header.appendChild(filenameSpan);
        header.appendChild(copyBtn);
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
    });
});
