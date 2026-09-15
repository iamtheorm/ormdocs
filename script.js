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
    const btnTheme = document.getElementById('btn-theme');
    const btnReader = document.getElementById('btn-reader');
    const btnTextMinus = document.getElementById('btn-text-minus');
    const btnTextPlus = document.getElementById('btn-text-plus');

    if (btnTheme) btnTheme.addEventListener('click', () => {
        const target = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', target);
        localStorage.setItem('theme', target);
    });

    if (btnReader) btnReader.addEventListener('click', () => {
        localStorage.setItem('readerMode', document.body.classList.toggle('reader-mode-active'));
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

    // --- Interactive Node Background ---
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '1';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const maxParticles = 80;
    const connectionDistance = 140;
    let mouse = { x: null, y: null, radius: 180 };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
            ctx.fill();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            if (mouse.x != null && mouse.y != null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${1 - distance / mouse.radius})`;
                    ctx.lineWidth = 1.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
});
