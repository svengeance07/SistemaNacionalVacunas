/* ==========================================================================
   SIV-GUÁRICO // Capa de Interfaz (UI compartida)
   --------------------------------------------------------------------------
   Archivo EXCLUSIVAMENTE de presentación. Contiene únicamente utilidades
   visuales reutilizadas por las vistas (notificaciones flotantes, ayudas de
   formulario, etc.).

   NO contiene lógica de negocio, NO habla con la base de datos y NO decide
   permisos. Eso corresponde a las capas M (Modelos) y C (Controladores) que
   se integrarán más adelante (arquitectura MVC).
   ========================================================================== */
(function (window, document) {
    'use strict';

    var SIV = window.SIV = window.SIV || {};

    /* --- Catálogo de iconos de notificación (mismo trazo SVG del sistema) --- */
    var ICONOS = {
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
            'stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle>' +
            '<line x1="12" y1="7" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
            'stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
            'stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle>' +
            '<line x1="12" y1="12" x2="12" y2="16"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    var TITULOS = {
        error: 'Acción no permitida',
        success: 'Operación completada',
        info: 'Información del sistema'
    };

    /* --- Contenedor de notificaciones flotantes (esquina superior derecha) --- */
    function obtenerPila() {
        var pila = document.querySelector('.toast-stack');
        if (!pila) {
            pila = document.createElement('div');
            pila.className = 'toast-stack';
            pila.setAttribute('role', 'status');
            pila.setAttribute('aria-live', 'polite');
            document.body.appendChild(pila);
        }
        return pila;
    }

    /* --- Cierre manual de una notificación --- */
    function cerrar(elemento) {
        if (!elemento || elemento.classList.contains('is-leaving')) { return; }
        elemento.classList.add('is-leaving');
        window.setTimeout(function () {
            if (elemento.parentNode) { elemento.parentNode.removeChild(elemento); }
        }, 240);
    }

    /**
     * Muestra una notificación flotante en la esquina superior derecha.
     * Se oculta automáticamente tras `duracion` milisegundos.
     *
     * @param {string} mensaje  Texto principal de la notificación.
     * @param {string} [tipo]   'error' (por defecto), 'success' o 'info'.
     * @param {number} [duracion] Milisegundos antes del auto-cierre (4.500 por defecto).
     * @param {string} [titulo] Título visible (opcional).
     */
    SIV.toast = function (mensaje, tipo, duracion, titulo) {
        tipo = tipo || 'error';
        duracion = duracion || 4500;

        var pila = obtenerPila();

        var item = document.createElement('div');
        item.className = 'toast-item toast-' + tipo;

        var icono = document.createElement('div');
        icono.className = 'toast-icon';
        icono.innerHTML = ICONOS[tipo] || ICONOS.info;

        var cuerpo = document.createElement('div');
        cuerpo.className = 'toast-body';

        var encabezado = document.createElement('span');
        encabezado.className = 'toast-title';
        encabezado.textContent = titulo || TITULOS[tipo] || TITULOS.info;

        var texto = document.createElement('span');
        texto.className = 'toast-message';
        texto.textContent = mensaje;

        cuerpo.appendChild(encabezado);
        cuerpo.appendChild(texto);

        var cerrarBtn = document.createElement('button');
        cerrarBtn.type = 'button';
        cerrarBtn.className = 'toast-close';
        cerrarBtn.setAttribute('aria-label', 'Cerrar notificación');
        cerrarBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ' +
            'stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        cerrarBtn.addEventListener('click', function () { cerrar(item); });

        var progreso = document.createElement('span');
        progreso.className = 'toast-progress';
        progreso.style.animationDuration = duracion + 'ms';

        item.appendChild(icono);
        item.appendChild(cuerpo);
        item.appendChild(cerrarBtn);
        item.appendChild(progreso);

        pila.appendChild(item);

        window.setTimeout(function () { cerrar(item); }, duracion);

        return item;
    };

    /* --- Atajo: marcar el enlace de navegación activo según la URL actual --- */
    SIV.marcarNavegacionActiva = function (selector) {
        var enlaces = document.querySelectorAll(selector || '.health-nav-link');
        var actual = window.location.pathname.split('/').pop() || 'index.html';

        Array.prototype.forEach.call(enlaces, function (enlace) {
            var destino = (enlace.getAttribute('href') || '').split('/').pop();
            if (destino === actual) {
                var item = enlace.closest('.health-nav-item');
                if (item) { item.classList.add('active'); }
            }
        });
    };

    /* --- Cierre de sesión: descarta la sesión simulada y vuelve al acceso --- */
    SIV.cerrarSesion = function () {
        /* Si el almacén de perfiles está cargado, se descarta la sesión de tipo 2. */
        if (window.SIV && window.SIV.centros && typeof window.SIV.centros.cerrarSesion === 'function') {
            window.SIV.centros.cerrarSesion();
        }
    };

    /* --- Enlaza los botones de cierre de sesión (atributo data-siv-logout) --- */
    SIV.enlazarCierreSesion = function (raiz) {
        var nodos = (raiz || document).querySelectorAll('[data-siv-logout]');

        Array.prototype.forEach.call(nodos, function (nodo) {
            if (nodo.getAttribute('data-siv-logout-listo') === '1') { return; }
            nodo.setAttribute('data-siv-logout-listo', '1');

            nodo.addEventListener('click', function (evento) {
                evento.preventDefault();
                SIV.cerrarSesion();

                var destino = nodo.getAttribute('data-siv-logout') || 'login.html';
                if (window.SIV && window.SIV.toast) {
                    SIV.toast('Sesión cerrada correctamente.', 'success', 2200);
                }

                window.setTimeout(function () { window.location.href = destino; }, 260);
            });
        });
    };

})(window, document);
