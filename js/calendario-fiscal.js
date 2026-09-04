// calendario-fiscal.js
document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Boilerplate común (igual que las demás páginas) ---------- */
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

    /* ---------- Motor del calendario fiscal ---------- */
    const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const anioActual = hoy.getFullYear();

    // Si una fecha cae en sábado o domingo, se recorre al siguiente día hábil
    function ajustarDiaHabil(fecha) {
        const dia = fecha.getDay(); // 0 = domingo, 6 = sábado
        if (dia === 6) fecha.setDate(fecha.getDate() + 2);
        else if (dia === 0) fecha.setDate(fecha.getDate() + 1);
        return fecha;
    }

    function formatearFecha(fecha) {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    }

    // Genera todas las obligaciones fiscales para uno o varios años
    function generarObligaciones(anios) {
        const obligaciones = [];

        anios.forEach((anio) => {
            // Declaraciones mensuales: día 17 del mes siguiente al periodo
            for (let m = 0; m < 12; m++) {
                let declMes = m + 1;
                let declAnio = anio;
                if (declMes > 11) { declMes = 0; declAnio += 1; }
                const fecha = ajustarDiaHabil(new Date(declAnio, declMes, 17));
                obligaciones.push({
                    fecha,
                    tipo: 'Mensual',
                    icono: 'fa-calendar-day',
                    titulo: 'Declaración mensual (ISR, IVA, retenciones y DIOT)',
                    detalle: `Corresponde al periodo de ${MESES[m]} de ${anio}.`
                });
            }

            // Obligaciones anuales de fecha fija: [mes(0-11), día, título, detalle, icono]
            const anuales = [
                [1, 15, 'Entrega de constancias de retenciones', 'Para trabajadores a los que se les pagó sueldo el año anterior.', 'fa-file-invoice-dollar'],
                [1, 28, 'Declaración informativa anual de retenciones', 'Cierre informativo del ejercicio anterior ante el SAT.', 'fa-file-circle-check'],
                [2, 31, 'Declaración Anual de Personas Morales', 'Del ejercicio fiscal anterior.', 'fa-building'],
                [3, 30, 'Declaración Anual de Personas Físicas', 'Del ejercicio fiscal anterior.', 'fa-user'],
                [4, 30, 'Reparto de PTU (Personas Morales)', 'A más tardar 60 días después de la declaración anual.', 'fa-hand-holding-dollar'],
                [11, 20, 'Pago de aguinaldo', 'Equivalente a al menos 15 días de salario por trabajador.', 'fa-gift']
            ];

            anuales.forEach(([mes, dia, titulo, detalle, icono]) => {
                let diaReal = dia;
                // Ajuste para el 28/29 de febrero según año bisiesto
                if (mes === 1 && dia === 28) {
                    diaReal = new Date(anio, 2, 0).getDate();
                }
                const fecha = ajustarDiaHabil(new Date(anio, mes, diaReal));
                obligaciones.push({ fecha, tipo: 'Anual', icono, titulo, detalle });
            });
        });

        return obligaciones.sort((a, b) => a.fecha - b.fecha);
    }

    // Generamos el año actual y el siguiente para no quedarnos sin datos en diciembre
    const obligaciones = generarObligaciones([anioActual, anioActual + 1]);
    const proximas = obligaciones.filter(o => o.fecha >= hoy);

    /* ---------- Hero: año y cuenta regresiva ---------- */
    document.querySelectorAll('#hero-year, #calendario-year').forEach(el => {
        el.textContent = anioActual;
    });

    if (proximas.length) {
        const siguiente = proximas[0];
        const diasRestantes = Math.round((siguiente.fecha - hoy) / (1000 * 60 * 60 * 24));
        const diasEl = document.getElementById('dias-restantes');
        const diasLabelEl = document.getElementById('dias-restantes-label');
        const tituloEl = document.getElementById('proxima-obligacion-titulo');
        const fechaEl = document.getElementById('proxima-obligacion-fecha');

        if (diasEl) diasEl.textContent = diasRestantes === 0 ? '¡Hoy!' : diasRestantes;
        if (diasLabelEl) diasLabelEl.textContent = diasRestantes === 0
            ? 'es la fecha límite'
            : (diasRestantes === 1 ? 'día restante' : 'días restantes');
        if (tituloEl) tituloEl.textContent = siguiente.titulo;
        if (fechaEl) fechaEl.textContent = formatearFecha(siguiente.fecha);
    }

    /* ---------- Sección: próximas fechas (las 4 más cercanas) ---------- */
    const proximasContainer = document.getElementById('proximas-fechas');
    if (proximasContainer) {
        proximasContainer.innerHTML = proximas.slice(0, 4).map((o) => {
            const dias = Math.round((o.fecha - hoy) / (1000 * 60 * 60 * 24));
            const badge = dias <= 7 ? '<span class="badge bg-danger ms-2">Urgente</span>' : '';
            return `
                <div class="col-md-3 col-6">
                    <div class="deadline-card text-center p-4 h-100 reveal-item">
                        <i class="fa-solid ${o.icono} fa-2x text-primary mb-3"></i>
                        <span class="badge bg-primary bg-opacity-10 text-primary mb-2">${o.tipo}</span>
                        <h6 class="fw-bold">${o.titulo}</h6>
                        <p class="text-muted small mb-1">${formatearFecha(o.fecha)}</p>
                        <p class="fw-semibold small mb-0">${dias === 0 ? 'Es hoy' : `En ${dias} día${dias === 1 ? '' : 's'}`}${badge}</p>
                    </div>
                </div>`;
        }).join('');
    }

    /* ---------- Sección: calendario mensual completo del año actual ---------- */
    const mesesGrid = document.getElementById('meses-grid');
    if (mesesGrid) {
        const mesActualIndex = hoy.getMonth();
        const obligacionesDelAnio = obligaciones.filter(o => o.fecha.getFullYear() === anioActual);

        mesesGrid.innerHTML = MESES.map((nombreMes, index) => {
            const obligacionesMes = obligacionesDelAnio
                .filter(o => o.fecha.getMonth() === index)
                .sort((a, b) => a.fecha - b.fecha);

            const esMesActual = index === mesActualIndex;

            const items = obligacionesMes.map(o => `
                <li class="mb-2">
                    <span class="fw-bold text-primary">${o.fecha.getDate()}</span>
                    <span class="text-muted small"> — ${o.titulo}</span>
                </li>`).join('');

            return `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="month-card p-3 h-100 reveal-item ${esMesActual ? 'month-card-active' : ''}">
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <h5 class="mb-0">${nombreMes}</h5>
                            ${esMesActual ? '<span class="badge bg-accent text-dark">Mes actual</span>' : ''}
                        </div>
                        <ul class="list-unstyled mb-0">
                            ${items || '<li class="text-muted small">Sin fechas específicas.</li>'}
                        </ul>
                    </div>
                </div>`;
        }).join('');
    }
});
