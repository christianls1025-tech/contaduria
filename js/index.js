// main.js
document.addEventListener('DOMContentLoaded', () => {

    /* Año actual en el footer */
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    /* Cerrar el navbar al hacer clic en un enlace (móviles) */
    const navbarCollapse = document.querySelector('.navbar-collapse');
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
            }
        });
    });

    /* Navbar reacciona al scroll */
    const navbar = document.querySelector('.navbar-main');
    const onScrollNavbar = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    };
    onScrollNavbar();
    window.addEventListener('scroll', onScrollNavbar, { passive: true });

    /* Botón volver arriba */
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 500);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* Revelado suave al hacer scroll (una sola coreografía, sin exagerar) */
    const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window && revealTargets.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealTargets.forEach(el => io.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('is-visible'));
    }

    /* Contador animado para las estadísticas del hero */
    const counters = document.querySelectorAll('[data-count]');
    const animateCount = (el) => {
        const target = parseFloat(el.dataset.count);
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
        const prefix = el.dataset.prefix || '';
        const duration = 1400;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = target * eased;
            el.textContent = prefix + value.toFixed(decimals);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = prefix + target.toFixed(decimals);
            }
        };
        requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window && counters.length) {
        const counterIo = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    counterIo.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(el => counterIo.observe(el));
    } else {
        counters.forEach(el => {
            el.textContent = (el.dataset.prefix || '') + el.dataset.count;
        });
    }

    /* Años de experiencia calculados desde el año 2000 hasta la fecha actual */
    const startYear = 2000;
    const yearsExp = new Date().getFullYear() - startYear;

    // Actualizar el span en el hero (con clase js-years-exp)
    document.querySelectorAll('.js-years-exp').forEach(el => {
        el.dataset.count = String(yearsExp);
    });

    // Actualizar el span en la presentación (id="years-exp")
    const yearsExpElement = document.getElementById('years-exp');
    if (yearsExpElement) {
        yearsExpElement.textContent = yearsExp;
    }
});