// trayectoria.js
document.addEventListener('DOMContentLoaded', () => {

    // Año en footer
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // Cerrar navbar en móvil
    const navbarCollapse = document.querySelector('.navbar-collapse');
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
            }
        });
    });

    // Botón volver arriba
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Años de experiencia (desde 2000)
    const startYear = 2000;
    const yearsExp = new Date().getFullYear() - startYear;
    document.querySelectorAll('.js-years-exp').forEach(el => {
        el.dataset.count = String(yearsExp);
    });
});
