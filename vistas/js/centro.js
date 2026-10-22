/**
 * ==============================================================================
 * GESTIÓN DEL CENTRO DE SALUD Y CONTROL DE ENFERMEROS (PUYASO / MPPS)
 * Lógica para el Jefe del Centro de Salud - Separada Estrictamente del HTML
 * ==============================================================================
 */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. PLANTEL DE ENFERMERÍA DEL CENTRO DE SALUD
    // --------------------------------------------------------------------------
    const cuentaCentro = (window.SIV && SIV.centros && SIV.centros.sesion && SIV.centros.sesion() && SIV.centros.sesion().correoCuenta)
        ? SIV.centros.sesion().correoCuenta
        : 'control.vacunacion@sivguarico.ve';

    let personalEnfermeria = [
        {
            id: 'PER-CAL-02',
            nombre: 'Lic. Marlene Requena',
            cedula: 'V-16.890.123',
            correo: 'marlene.requena@sivguarico.ve',
            mpps: '48.291',
            cargo: 'Enfermera Especialista en Inmunizaciones (PAI)',
            turno: 'Mañana (07:00 - 13:00)',
            puesto: 'Box 02 - Inmunizaciones Generales',
            estado: 'Permitido', // 'Permitido' | 'En Espera' | 'Inhabilitado'
            dosisHoy: 5,
            fechaRegistro: '2024-01-15'
        },
        {
            id: 'PER-CAL-03',
            nombre: 'Enf. Jonathan Silva',
            cedula: 'V-20.145.892',
            correo: 'jonathan.silva@sivguarico.ve',
            mpps: '51.320',
            cargo: 'Auxiliar de Inmunización',
            turno: 'Tarde (13:00 - 19:00)',
            puesto: 'Box 01 - Triage e Inoculación Rápida',
            estado: 'Permitido',
            dosisHoy: 3,
            fechaRegistro: '2024-03-20'
        },
        {
            id: 'enf-3',
            nombre: 'Lic. Carmen Elena Rivas',
            cedula: 'V-14.789.021',
            correo: 'carmen.rivas@sivguarico.ve',
            mpps: '39.182',
            cargo: 'Supervisora de Cadena de Frío y PAI',
            turno: 'Guardia 24 Horas',
            puesto: 'Sala Pediátrica de Inmunización',
            estado: 'Permitido',
            dosisHoy: 4,
            fechaRegistro: '2023-11-05'
        },
        {
            id: 'enf-4',
            nombre: 'Enf. Diego Alejandro Blanco',
            cedula: 'V-26.712.450',
            correo: 'diego.blanco@sivguarico.ve',
            mpps: '58.914',
            cargo: 'Enfermero Contratado',
            turno: 'Mañana (07:00 - 13:00)',
            puesto: 'Box 03 - Refuerzos y Campañas',
            estado: 'En Espera',
            dosisHoy: 0,
            fechaRegistro: '2026-10-20'
        }
    ];

    function sincronizarPerfilesAlmacenados() {
        if (!window.SIV || !SIV.centros) return;
        const perfilesGuardados = SIV.centros.perfiles(cuentaCentro);
        if (!perfilesGuardados || !Array.isArray(perfilesGuardados)) return;

        perfilesGuardados.forEach(function (p) {
            if (p.rol === 'jefe') return;
            const existe = personalEnfermeria.some(function (en) {
                return (en.correo && en.correo.toLowerCase() === p.correo.toLowerCase()) || en.id === p.id;
            });
            if (!existe) {
                personalEnfermeria.push({
                    id: p.id,
                    nombre: p.nombre,
                    cedula: p.cedula || 'V-00.000.000',
                    correo: p.correo,
                    mpps: p.mpps || 'S/N',
                    cargo: p.cargo || 'Enfermero(a) de Inmunización',
                    turno: p.turno || 'Mañana (07:00 - 13:00)',
                    puesto: p.puesto || 'Box de Inmunizaciones',
                    estado: p.estado === 'activo' ? 'Permitido' : 'Inhabilitado',
                    dosisHoy: 0,
                    fechaRegistro: p.creado || new Date().toISOString().split('T')[0]
                });
            } else {
                const en = personalEnfermeria.find(function (e) {
                    return (e.correo && e.correo.toLowerCase() === p.correo.toLowerCase()) || e.id === p.id;
                });
                if (en && p.estado) {
                    en.estado = (p.estado === 'activo') ? 'Permitido' : 'Inhabilitado';
                }
            }
        });
    }

    // --------------------------------------------------------------------------
    // 2. INICIALIZACIÓN
    // --------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        sincronizarPerfilesAlmacenados();
        renderizarTablaEnfermeros();
        actualizarMetricasEnfermeros();

        // Si la URL contiene el hash o parámetro para enfermeros
        if (window.location.hash === '#seccion-enfermeros') {
            alternarSeccionCentro('enfermeros');
        }
    });

    // --------------------------------------------------------------------------
    // 3. CAMBIO DE SECCIÓN EN CENTRO DE SALUD (DASHBOARD VS GESTIÓN DE ENFERMEROS)
    // --------------------------------------------------------------------------
    window.alternarSeccionCentro = function (seccion) {
        const vistaDashboard = document.getElementById('vista-dashboard');
        const vistaEnfermeros = document.getElementById('vista-gestion-enfermeros');
        const navDashboard = document.getElementById('nav-item-dashboard');
        const navEnfermeros = document.getElementById('nav-item-enfermeros');

        if (seccion === 'enfermeros') {
            if (vistaDashboard) vistaDashboard.style.display = 'none';
            if (vistaEnfermeros) vistaEnfermeros.style.display = 'block';
            if (navDashboard) navDashboard.classList.remove('active');
            if (navEnfermeros) navEnfermeros.classList.add('active');
            window.location.hash = 'seccion-enfermeros';
        } else {
            if (vistaDashboard) vistaDashboard.style.display = 'block';
            if (vistaEnfermeros) vistaEnfermeros.style.display = 'none';
            if (navDashboard) navDashboard.classList.add('active');
            if (navEnfermeros) navEnfermeros.classList.remove('active');
            window.location.hash = '';
        }
    };

    // --------------------------------------------------------------------------
    // 4. MÉTRICAS DEL JEFE DE CENTRO
    // --------------------------------------------------------------------------
    function actualizarMetricasEnfermeros() {
        const total = personalEnfermeria.length;
        const permitidos = personalEnfermeria.filter(function (e) { return e.estado === 'Permitido'; }).length;
        const enEspera = personalEnfermeria.filter(function (e) { return e.estado === 'En Espera' || e.estado === 'Inhabilitado'; }).length;
        const dosisTotal = personalEnfermeria.reduce(function (acc, e) { return acc + (e.dosisHoy || 0); }, 0);

        const elTotal = document.getElementById('kpi-total-enfermeros');
        const elPermitidos = document.getElementById('kpi-enfermeros-permitidos');
        const elEspera = document.getElementById('kpi-enfermeros-espera');
        const elDosis = document.getElementById('kpi-dosis-equipo');

        if (elTotal) elTotal.textContent = total;
        if (elPermitidos) elPermitidos.textContent = permitidos;
        if (elEspera) elEspera.textContent = enEspera;
        if (elDosis) elDosis.textContent = dosisTotal;
    }

    // --------------------------------------------------------------------------
    // 5. RENDERIZADO Y FILTRADO DE LA TABLA DE ENFERMEROS
    // --------------------------------------------------------------------------
    window.renderizarTablaEnfermeros = function () {
        const tbody = document.getElementById('tabla-enfermeros-centro-body');
        if (!tbody) return;

        const inputFiltro = document.getElementById('filtro-enfermero-busqueda');
        const selectEstado = document.getElementById('filtro-enfermero-estado');
        const query = inputFiltro ? inputFiltro.value.toLowerCase().trim() : '';
        const estadoFiltro = selectEstado ? selectEstado.value : 'TODOS';

        tbody.innerHTML = '';

        const filtrados = personalEnfermeria.filter(function (enf) {
            const coincideTexto = enf.nombre.toLowerCase().includes(query) ||
                                  enf.cedula.toLowerCase().includes(query) ||
                                  enf.mpps.includes(query) ||
                                  enf.puesto.toLowerCase().includes(query);
            const coincideEstado = (estadoFiltro === 'TODOS') || (enf.estado === estadoFiltro);
            return coincideTexto && coincideEstado;
        });

        if (filtrados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:28px; color:var(--color-texto-muted);">No se encontraron enfermeros con los criterios indicados.</td></tr>';
            return;
        }

        filtrados.forEach(function (enf) {
            const tr = document.createElement('tr');

            let badgeHtml = '';
            let btnActionHtml = '';

            if (enf.estado === 'Permitido') {
                badgeHtml = '<span class="badge-nurse-status badge-nurse-allowed">● Permitido / Habilitado</span>';
                btnActionHtml = `
                    <button type="button" class="btn-toggle-permit revoke-action" onclick="togglePermisoEnfermero('${enf.id}')" title="Revocar autorización">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                        </svg>
                        <span>Inhabilitar</span>
                    </button>
                `;
            } else if (enf.estado === 'En Espera') {
                badgeHtml = '<span class="badge-nurse-status badge-nurse-pending">● En Espera de Validación</span>';
                btnActionHtml = `
                    <button type="button" class="btn-toggle-permit permit-action" onclick="togglePermisoEnfermero('${enf.id}')" title="Aprobar y permitir acceso">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Permitir / Habilitar</span>
                    </button>
                `;
            } else {
                badgeHtml = '<span class="badge-nurse-status badge-nurse-disabled">● Acceso Inhabilitado</span>';
                btnActionHtml = `
                    <button type="button" class="btn-toggle-permit permit-action" onclick="togglePermisoEnfermero('${enf.id}')" title="Reactivar permiso">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Reactivar Permiso</span>
                    </button>
                `;
            }

            tr.innerHTML = `
                <td>
                    <div style="font-weight:700; color:var(--color-primario-oscuro);">${enf.nombre}</div>
                    <div class="font-mono" style="font-size:0.75rem; color:var(--color-texto-muted);">${enf.cedula}</div>
                    ${enf.correo ? `<div class="font-mono" style="font-size:0.72rem; color:var(--color-primario); margin-top:2px;">✉ ${enf.correo}</div>` : ''}
                </td>
                <td><strong class="font-mono" style="color:var(--color-texto);">${enf.mpps}</strong></td>
                <td>
                    <div style="font-size:0.82rem; font-weight:600;">${enf.puesto}</div>
                    <div style="font-size:0.74rem; color:var(--color-texto-secundario);">${enf.turno}</div>
                </td>
                <td>
                    <span class="meta-chip font-mono" style="font-weight:700; background:#f1f5f9;">
                        ${enf.dosisHoy} dosis hoy
                    </span>
                </td>
                <td>${badgeHtml}</td>
                <td><span class="font-mono" style="font-size:0.75rem; color:var(--color-texto-muted);">${enf.fechaRegistro}</span></td>
                <td class="text-right">
                    ${btnActionHtml}
                </td>
            `;
            tbody.appendChild(tr);
        });
    };

    // --------------------------------------------------------------------------
    // 6. PERMITIR / INHABILITAR UN ENFERMERO (ACCIÓN DEL JEFE DE CENTRO)
    // --------------------------------------------------------------------------
    window.togglePermisoEnfermero = function (id) {
        const enf = personalEnfermeria.find(function (e) { return e.id === id || e.correo === id; });
        if (!enf) return;

        if (enf.estado === 'Permitido') {
            const confirmar = confirm(`¿Está seguro de que desea inhabilitar al enfermero(a) ${enf.nombre}? No podrá iniciar sesión ni certificar dosis.`);
            if (!confirmar) return;
            enf.estado = 'Inhabilitado';
            if (window.SIV && SIV.centros && (enf.id || enf.correo)) {
                SIV.centros.cambiarEstadoPerfil(cuentaCentro, enf.id || enf.correo, 'inactivo');
            }
            mostrarToastCentro(`Acceso revocado a: ${enf.nombre}`);
        } else {
            enf.estado = 'Permitido';
            if (window.SIV && SIV.centros && (enf.id || enf.correo)) {
                SIV.centros.cambiarEstadoPerfil(cuentaCentro, enf.id || enf.correo, 'activo');
            }
            mostrarToastCentro(`Enfermero(a) ${enf.nombre} autorizado y habilitado para iniciar sesión.`);
        }

        actualizarMetricasEnfermeros();
        renderizarTablaEnfermeros();
    };

    // --------------------------------------------------------------------------
    // 7. REGISTRO Y ALTA DE UN NUEVO ENFERMERO POR EL JEFE DE CENTRO
    // --------------------------------------------------------------------------
    window.abrirModalNuevoEnfermero = function () {
        const modal = document.getElementById('modal-crear-enfermero');
        if (modal) modal.classList.add('active');
    };

    window.cerrarModalNuevoEnfermero = function () {
        const modal = document.getElementById('modal-crear-enfermero');
        if (modal) modal.classList.remove('active');
    };

    window.guardarNuevoEnfermero = function (e) {
        if (e) e.preventDefault();

        const cedula = document.getElementById('nuevo-enf-cedula').value.trim();
        const tipoDoc = document.getElementById('nuevo-enf-tipodoc').value;
        const nombre = document.getElementById('nuevo-enf-nombre').value.trim();
        const mpps = document.getElementById('nuevo-enf-mpps').value.trim();
        const cargo = document.getElementById('nuevo-enf-cargo').value;
        const correo = document.getElementById('nuevo-enf-correo').value.trim().toLowerCase();
        const clave = document.getElementById('nuevo-enf-clave').value.trim();
        const turno = document.getElementById('nuevo-enf-turno').value;
        const puesto = document.getElementById('nuevo-enf-puesto').value;
        const permitirInmediato = document.getElementById('nuevo-enf-permitir-check').checked;

        if (!cedula || !nombre || !mpps || !correo || !clave) {
            alert('Por favor complete los campos obligatorios: Cédula, Nombre, MPPS, Correo y Contraseña.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            alert('Por favor ingrese un formato de correo electrónico válido (ejemplo: enfermero@sivguarico.ve).');
            return;
        }

        if (clave.length < 8) {
            alert('La contraseña para el inicio de sesión del enfermero debe tener al menos 8 caracteres.');
            return;
        }

        // Verificar duplicados por cédula, matrícula o correo
        const existe = personalEnfermeria.some(function (en) {
            return en.mpps === mpps || en.cedula.includes(cedula) || (en.correo && en.correo.toLowerCase() === correo);
        });

        if (existe) {
            alert('Ya existe un enfermero registrado con esa cédula, matrícula MPPS o correo electrónico.');
            return;
        }

        // Persistir en el almacén de perfiles (SIV.centros) para que pueda iniciar sesión en login.html
        let perfilId = 'enf-' + (personalEnfermeria.length + 1);
        if (window.SIV && SIV.centros) {
            const resp = SIV.centros.crearPerfil(cuentaCentro, {
                nombre: nombre,
                cargo: cargo,
                cedula: `${tipoDoc}-${cedula}`,
                mpps: mpps,
                turno: turno,
                puesto: puesto,
                correo: correo,
                clave: clave,
                permitirInmediato: permitirInmediato,
                estado: permitirInmediato ? 'activo' : 'inactivo'
            });

            if (!resp.ok) {
                alert(resp.error || 'No se pudo crear el usuario en el sistema.');
                return;
            }
            if (resp.perfil && resp.perfil.id) {
                perfilId = resp.perfil.id;
            }
        }

        const nuevoEnf = {
            id: perfilId,
            nombre: nombre,
            cedula: `${tipoDoc}-${cedula}`,
            correo: correo,
            mpps: mpps,
            cargo: cargo,
            turno: turno,
            puesto: puesto,
            estado: permitirInmediato ? 'Permitido' : 'En Espera',
            dosisHoy: 0,
            fechaRegistro: new Date().toISOString().split('T')[0]
        };

        personalEnfermeria.unshift(nuevoEnf);

        actualizarMetricasEnfermeros();
        renderizarTablaEnfermeros();
        cerrarModalNuevoEnfermero();
        document.getElementById('form-crear-enfermero').reset();

        mostrarToastCentro(`Usuario creado para: ${nuevoEnf.nombre}. Inicio de sesión habilitado con ${correo}.`);
    };

    // --------------------------------------------------------------------------
    // 8. TOAST NOTIFICACIONES
    // --------------------------------------------------------------------------
    function mostrarToastCentro(mensaje) {
        let toast = document.getElementById('centro-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'centro-toast';
            toast.className = 'nurse-mgmt-toast';
            document.body.appendChild(toast);
        }

        toast.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22c55e" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${mensaje}</span>
        `;
        toast.classList.add('active');

        setTimeout(function () {
            toast.classList.remove('active');
        }, 3500);
    }

})();
