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


