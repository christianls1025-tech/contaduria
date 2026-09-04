// contactanos.js
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const apellidos = document.getElementById('apellidos').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !apellidos || !correo || !mensaje) {
                alert('Por favor, completa todos los campos obligatorios (*).');
                return;
            }

            let texto = 'Hola, soy ';
            texto += nombre + ' ' + apellidos + '.';
            texto += '\nMi correo es: ' + correo;
            if (telefono) {
                texto += '\nMi teléfono es: ' + telefono;
            }
            texto += '\n\nMensaje:\n' + mensaje;

            const mensajeCodificado = encodeURIComponent(texto);
            const numero = '527761231352';
            window.open('https://wa.me/' + numero + '?text=' + mensajeCodificado, '_blank');
        });
    }

    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    const navbarCollapse = document.querySelector('.navbar-collapse');
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
            }
        });
    });

    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('show', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});