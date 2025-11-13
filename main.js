// Variables globales
let seccionActual = 'inicio';
let animacionEstadisticasEjecutada = false;

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', function(evento) {
        evento.preventDefault();
        const idSeccion = this.getAttribute('href');
        const seccion = document.querySelector(idSeccion);
        
        if (seccion) {
            seccion.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Actualizar navegación activa al hacer scroll
window.addEventListener('scroll', function() {
    const secciones = document.querySelectorAll('section[id]');
    const posicionScroll = window.scrollY + 150;
    
    secciones.forEach(seccion => {
        const alturaSeccion = seccion.offsetHeight;
        const offsetSeccion = seccion.offsetTop;
        const idSeccion = seccion.getAttribute('id');
        
        if (posicionScroll >= offsetSeccion && posicionScroll < offsetSeccion + alturaSeccion) {
            document.querySelectorAll('.enlace-nav').forEach(enlace => {
                enlace.classList.remove('activo');
            });
            
            const enlaceActivo = document.querySelector(`.enlace-nav[href="#${idSeccion}"]`);
            if (enlaceActivo) {
                enlaceActivo.classList.add('activo');
            }
            
            seccionActual = idSeccion;
        }
    });
    
    // Animar estadísticas cuando sean visibles
    const seccionEstadisticas = document.querySelector('.estadisticas');
    if (seccionEstadisticas && !animacionEstadisticasEjecutada) {
        const rectEstadisticas = seccionEstadisticas.getBoundingClientRect();
        if (rectEstadisticas.top < window.innerHeight && rectEstadisticas.bottom > 0) {
            animarEstadisticas();
            animacionEstadisticasEjecutada = true;
        }
    }
});

// Animar contadores de estadísticas
function animarEstadisticas() {
    const numerosEstadisticas = document.querySelectorAll('.numero-estadistica');
    
    numerosEstadisticas.forEach(numero => {
        const objetivo = parseInt(numero.getAttribute('data-objetivo'));
        const duracion = 3000; // 2 segundos
        const incremento = objetivo / (duracion / 30); // 60 FPS
        let valorActual = 0;
        
        const actualizarContador = () => {
            valorActual += incremento;
            if (valorActual < objetivo) {
                numero.textContent = Math.floor(valorActual);
                requestAnimationFrame(actualizarContador);
            } else {
                numero.textContent = objetivo + (objetivo === 5 || objetivo === 10 ? '+' : ''); // Añadir '+' a ciertos valores
            }
        };
        
        actualizarContador();
    });
}

// Cambiar servicios
const itemsMenuServicio = document.querySelectorAll('.item-menu-servicio');
const detallesServicio = document.querySelectorAll('.servicio-detalle');

itemsMenuServicio.forEach(item => {
    item.addEventListener('click', function() {
        const servicioSeleccionado = this.getAttribute('data-servicio');
        
        // Remover clase activa de todos los items
        itemsMenuServicio.forEach(i => i.classList.remove('activo'));
        detallesServicio.forEach(d => d.classList.remove('activo'));
        
        // Agregar clase activa al item seleccionado
        this.classList.add('activo');
        const detalleActivo = document.querySelector(`.servicio-detalle[data-servicio="${servicioSeleccionado}"]`);
        if (detalleActivo) {
            detalleActivo.classList.add('activo');
        }
    });
});

// Manejo del formulario de contacto
const formularioContacto = document.getElementById('formulario-contacto');

if (formularioContacto) {
    formularioContacto.addEventListener('submit', function(evento) {
        evento.preventDefault();
        
        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const asunto = document.getElementById('asunto').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica
        if (!nombre || !email || !asunto || !mensaje) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        // Validar email
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            alert('Por favor, ingresa un email válido.');
            return;
        }
        
        // Aquí normalmente enviarías los datos a un servidor
        console.log('Formulario enviado:', { nombre, email, asunto, mensaje });
        
        // Mostrar mensaje de éxito
        alert('¡Mensaje enviado con éxito! Te contactaré pronto.');
        
        // Limpiar formulario
        formularioContacto.reset();
    });
}

// Menú móvil
const botonMenuMovil = document.querySelector('.boton-menu-movil');
const menuNav = document.querySelector('.menu-nav');

if (botonMenuMovil) {
    botonMenuMovil.addEventListener('click', function() {
        menuNav.classList.toggle('activo');
        this.classList.toggle('activo');
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.enlace-nav').forEach(enlace => {
        enlace.addEventListener('click', function() {
            menuNav.classList.remove('activo');
            botonMenuMovil.classList.remove('activo');
        });
    });
}

// Efecto parallax suave en las tarjetas
document.querySelectorAll('.tarjeta-info, .tarjeta-proyecto').forEach(tarjeta => {
    tarjeta.addEventListener('mousemove', function(evento) {
        const rect = this.getBoundingClientRect();
        const x = evento.clientX - rect.left;
        const y = evento.clientY - rect.top;
        
        const centroX = rect.width / 2;
        const centroY = rect.height / 2;
        
        const rotacionX = (y - centroY) / 20;
        const rotacionY = (centroX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotacionX}deg) rotateY(${rotacionY}deg) translateY(-5px)`;
    });
    
    tarjeta.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio cargado correctamente');
    
    // Agregar animación de entrada a las secciones
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('section').forEach(seccion => {
        seccion.style.opacity = '0';
        seccion.style.transform = 'translateY(30px)';
        seccion.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observador.observe(seccion);
    });

    // Theme toggle: respect saved preference or OS preference
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-theme');
            if (themeToggle) themeToggle.classList.add('is-light');
            const icon = themeToggle && themeToggle.querySelector('.tema-icon');
            if (icon) icon.textContent = '☀️';
            themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            body.classList.remove('light-theme');
            if (themeToggle) themeToggle.classList.remove('is-light');
            const icon = themeToggle && themeToggle.querySelector('.tema-icon');
            if (icon) icon.textContent = '🌙';
            themeToggle.setAttribute('aria-pressed', 'false');
        }
    }

    // initialize theme from localStorage or prefers-color-scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        applyTheme(prefersLight ? 'light' : 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isLight = body.classList.contains('light-theme');
            const newTheme = isLight ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Apply background images for .habilidad elements that have data-img
    // Use encodeURI to ensure special characters (e.g. '#') are properly escaped in the URL
    document.querySelectorAll('.habilidad[data-img]').forEach(el => {
        const img = el.getAttribute('data-img');
        if (img) {
            const safeImg = encodeURI(img);
            el.style.backgroundImage = `url("${safeImg}")`;
            el.style.backgroundSize = '70% 70%';
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat = 'no-repeat';
            el.classList.add('has-img');
        }
    });
});