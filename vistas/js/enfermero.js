/**
 * ==============================================================================
 * ESTACIÓN DE ENFERMERÍA - SISTEMA NACIONAL DE VACUNACIÓN (PUYASO / MPPS)
 * Archivo Lógico Modular Exclusivo - Separado Estrictamente del HTML
 * ==============================================================================
 */

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. PLANTEL DE ENFERMERÍA Y ESTADO DE SESIÓN
    // --------------------------------------------------------------------------
    const PLANTILLA_ENFERMEROS = [
        {
            id: 'enf-1',
            nombre: 'Lic. Marlene Requena',
            cedula: 'V-16.890.123',
            mpps: '48.291',
            cargo: 'Enfermera Especialista en Inmunizaciones',
            turno: 'Guardia Diurna (07:00 - 13:00)',
            puesto: 'Box 02 - Inmunizaciones Generales',
            iniciales: 'MR'
        },
        {
            id: 'enf-2',
            nombre: 'Enf. Carlos Alberto Mendoza',
            cedula: 'V-20.145.892',
            mpps: '51.320',
            cargo: 'Enfermero Asistencial',
            turno: 'Guardia Vespertina (13:00 - 19:00)',
            puesto: 'Box 01 - Triage e Inoculación Rápida',
            iniciales: 'CM'
        },
        {
            id: 'enf-3',
            nombre: 'Lic. Carmen Elena Rivas',
            cedula: 'V-14.789.021',
            mpps: '39.182',
            cargo: 'Supervisora de Cadena de Frío y PAI',
            turno: 'Guardia 24 Horas',
            puesto: 'Sala Pediátrica de Inmunización',
            iniciales: 'CR'
        }
    ];

    let sesionActiva = {
        enfermero: PLANTILLA_ENFERMEROS[0],
        dosisHoy: 5,
        pacientesHoy: 4,
        reportesHoy: 1,
        horaInicio: '07:00 AM'
    };

    // --------------------------------------------------------------------------
    // 2. BASE DE DATOS DE PACIENTES SIMULADA
    // --------------------------------------------------------------------------
    let pacientesBD = [
        {
            cedula: "28452190",
            tipoDoc: "V",
            nombre: "Carlos Eduardo Mendoza Peña",
            fechaNac: "1998-04-15",
            fechaNacFormat: "15/04/1998",
            edad: 28,
            esMenor: false,
            sexo: "Masculino",
            telefono: "0414-8901234",
            email: "carlos.mendoza@email.com",
            estado: "Guárico",
            municipio: "Juan Germán Roscio",
            parroquia: "San Juan de los Morros",
            direccion: "Av. Fuerzas Armadas, Sector Centro, Casa #42",
            carnet: [
                {
                    vacuna: "Fiebre Amarilla (Antiamarílica)",
                    dosis: "Dosis Única",
                    fecha: "2024-02-10",
                    lote: "FA-9082",
                    centro: "Hospital Dr. Israel Ranuárez Balza",
                    enfermero: "Lic. Marlene Requena (MPPS 48291)",
                    estado: "Completada"
                },
                {
                    vacuna: "Toxoide Tetánico-Diftérico (dT)",
                    dosis: "Refuerzo Decenal",
                    fecha: "2025-05-18",
                    lote: "TT-4410",
                    centro: "Hospital Dr. Israel Ranuárez Balza",
                    enfermero: "Lic. Marlene Requena (MPPS 48291)",
                    estado: "Completada"
                },
                {
                    vacuna: "COVID-19 (Sinopharm Verocell)",
                    dosis: "1ra Dosis",
                    fecha: "2026-01-12",
                    lote: "SP-202601",
                    centro: "Hospital Dr. Israel Ranuárez Balza",
                    enfermero: "Enf. Carlos Mendoza (MPPS 51320)",
                    estado: "Completada"
                }
            ]
        },
        {
            cedula: "31980112",
            tipoDoc: "V",
            nombre: "Valeria Sofía Gómez Pérez",
            fechaNac: "2021-08-20",
            fechaNacFormat: "20/08/2021",
            edad: 5,
            esMenor: true,
            sexo: "Femenino",
            telefono: "0412-5558912",
            email: "mariana.perez@email.com",
            estado: "Guárico",
            municipio: "Juan Germán Roscio",
            parroquia: "San Juan de los Morros",
            direccion: "Calle Bolívar cruce con Sucre, Edif. Los Morros, Apto 3B",
            representante: {
                nombre: "Mariana del Carmen Pérez de Gómez",
                cedula: "V-15.420.198",
                parentesco: "Madre",
                telefono: "0412-5558912"
            },
            carnet: [
                {
                    vacuna: "BCG (Tuberculosis)",
                    dosis: "Dosis Única Recién Nacido",
                    fecha: "2021-08-22",
                    lote: "BCG-2021",
                    centro: "Hospital Dr. Israel Ranuárez Balza",
                    enfermero: "Lic. Carmen Rivas (MPPS 39182)",
                    estado: "Completada"
                },
                {
                    vacuna: "Pentavalente (DTP-HB-Hib)",
                    dosis: "3ra Dosis",
                    fecha: "2022-02-24",
                    lote: "PV-5521",
                    centro: "Hospital Dr. Israel Ranuárez Balza",
                    enfermero: "Lic. Marlene Requena (MPPS 48291)",
                    estado: "Completada"
                },
                {
                    vacuna: "Sarampión, Rubéola, Parotiditis (SRP)",
                    dosis: "1ra Dosis",
                    fecha: "2022-09-01",
                    lote: "SRP-8812",
                    centro: "Hospital Dr. Israel Ranuárez Balza",
                    enfermero: "Lic. Marlene Requena (MPPS 48291)",
                    estado: "Completada"
                }
            ]
        }
    ];

    let pacienteSeleccionado = null;

    // --------------------------------------------------------------------------
    // 3. BASE DE DATOS DE REPORTES ESAVI DE LA JORNADA
    // --------------------------------------------------------------------------
    let reportesJornada = [
        {
            codigo: "ESAVI-2026-0042",
            cedula: "V-28.452.190",
            paciente: "Carlos Eduardo Mendoza Peña",
            vacuna: "COVID-19 (Sinopharm Verocell)",
            lote: "SP-202601",
            gravedad: "Leve",
            sintomas: "Dolor local, febrícula (37.8°C), mialgias leves",
            acciones: "Reposo relativo, compresas frías en deltoides, paracetamol 500mg VO.",
            enfermero: "Lic. Marlene Requena (MPPS 48291)",
            fecha: "2026-10-22",
            hora: "08:35 AM"
        }
    ];

    // --------------------------------------------------------------------------
    // 4. INICIALIZACIÓN
    // --------------------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        // Sincronizar con la sesión activa autenticada en el login (SIV.centros)
        if (window.SIV && SIV.centros && typeof SIV.centros.sesion === 'function') {
            const ses = SIV.centros.sesion();
            if (ses && ses.nombre) {
                const enfAuth = {
                    id: ses.idPerfil || 'enf-auth',
                    nombre: ses.nombre,
                    cedula: ses.cedula || 'V-16.890.123',
                    mpps: ses.mpps || '48.291',
                    cargo: ses.cargo || 'Enfermero(a) de Inmunización',
                    turno: ses.turno || 'Guardia Diurna (07:00 - 13:00)',
                    puesto: ses.puesto || 'Box 02 - Inmunizaciones Generales',
                    iniciales: ses.iniciales || (window.SIV.centros.iniciales ? window.SIV.centros.iniciales(ses.nombre) : 'EN')
                };

                sesionActiva.enfermero = enfAuth;

                const idx = PLANTILLA_ENFERMEROS.findIndex(function (e) {
                    return e.id === enfAuth.id || e.nombre === enfAuth.nombre;
                });
                if (idx >= 0) {
                    PLANTILLA_ENFERMEROS[idx] = enfAuth;
                } else {
                    PLANTILLA_ENFERMEROS.unshift(enfAuth);
                }
            }
        }

        actualizarCabeceraSesion();
        iniciarReloj();
        renderizarListaEnfermeros();
        renderizarTablaReportes();
        configurarEventos();

        // Si se envió cédula por parámetro URL
        const urlParams = new URLSearchParams(window.location.search);
        const cedulaParam = urlParams.get('cedula');
        if (cedulaParam) {
            const inputCedula = document.getElementById('enf-search-cedula');
            if (inputCedula) {
                inputCedula.value = cedulaParam.replace(/\D/g, '');
                consultarPacienteEnfermeria();
            }
        }
    });

    // --------------------------------------------------------------------------
    // 5. GESTIÓN DE SESIÓN DE ENFERMERÍA
    // --------------------------------------------------------------------------
    function actualizarCabeceraSesion() {
        const enf = sesionActiva.enfermero;
        const elAvatar = document.getElementById('session-avatar');
        const elNombre = document.getElementById('session-nombre');
        const elMpps = document.getElementById('session-mpps');
        const elTurno = document.getElementById('session-turno');
        const elPuesto = document.getElementById('session-puesto');
        const elDosis = document.getElementById('session-dosis-count');
        const elPacientes = document.getElementById('session-pacientes-count');
        const elReportes = document.getElementById('session-reportes-count');
        const elStampEnfermero = document.getElementById('stamp-enfermero-nombre');

        if (elAvatar) elAvatar.textContent = enf.iniciales;
        if (elNombre) elNombre.textContent = enf.nombre;
        if (elMpps) elMpps.textContent = enf.mpps;
        if (elTurno) elTurno.textContent = enf.turno;
        if (elPuesto) elPuesto.textContent = enf.puesto;
        if (elDosis) elDosis.textContent = sesionActiva.dosisHoy;
        if (elPacientes) elPacientes.textContent = sesionActiva.pacientesHoy;
        if (elReportes) elReportes.textContent = sesionActiva.reportesHoy;
        if (elStampEnfermero) elStampEnfermero.textContent = `${enf.nombre} (MPPS #${enf.mpps})`;
    }

    function iniciarReloj() {
        const elReloj = document.getElementById('session-reloj');
        if (!elReloj) return;

        function refrescar() {
            const ahora = new Date();
            const horas = String(ahora.getHours()).padStart(2, '0');
            const minutos = String(ahora.getMinutes()).padStart(2, '0');
            const segundos = String(ahora.getSeconds()).padStart(2, '0');
            elReloj.textContent = `${horas}:${minutos}:${segundos}`;
        }
        refrescar();
        setInterval(refrescar, 1000);
    }

    function renderizarListaEnfermeros() {
        const cont = document.getElementById('auth-staff-list');
        if (!cont) return;

        cont.innerHTML = '';
        PLANTILLA_ENFERMEROS.forEach(function (enf) {
            const isActivo = enf.id === sesionActiva.enfermero.id;
            const item = document.createElement('div');
            item.className = 'nurse-staff-card' + (isActivo ? ' selected' : '');
            item.onclick = function () {
                seleccionarEnfermeroAuth(enf.id);
            };

            item.innerHTML = `
                <div class="nurse-staff-avatar">${enf.iniciales}</div>
                <div class="nurse-staff-info">
                    <div class="nurse-staff-name">${enf.nombre}</div>
                    <div class="nurse-staff-mpps">Matrícula MPPS: #${enf.mpps} • ${enf.puesto}</div>
                </div>
                ${isActivo ? '<span style="font-size:0.75rem; font-weight:700; color:#166534; background:#dcfce7; padding:3px 8px; border-radius:999px;">En Turno</span>' : ''}
            `;
            cont.appendChild(item);
        });
    }

    let enfermeroSeleccionadoAuthId = PLANTILLA_ENFERMEROS[0].id;

    function seleccionarEnfermeroAuth(id) {
        enfermeroSeleccionadoAuthId = id;
        renderizarListaEnfermeros();
    }

    window.abrirModalCambioTurno = function () {
        const modal = document.getElementById('modal-cambio-turno');
        if (modal) modal.classList.add('active');
    };

    window.cerrarModalCambioTurno = function () {
        const modal = document.getElementById('modal-cambio-turno');
        if (modal) modal.classList.remove('active');
    };

    window.confirmarCambioTurno = function (e) {
        if (e) e.preventDefault();
        const enf = PLANTILLA_ENFERMEROS.find(function (n) { return n.id === enfermeroSeleccionadoAuthId; });
        if (enf) {
            sesionActiva.enfermero = enf;
            actualizarCabeceraSesion();
            cerrarModalCambioTurno();
            mostrarToast(`Sesión activa actualizada: ${enf.nombre}`);
        }
    };

    // --------------------------------------------------------------------------
    // 6. GESTIÓN DE PESTAÑAS (TABS)
    // --------------------------------------------------------------------------
    window.cambiarModuloEnfermeria = function (modulo) {
        const tabPacientes = document.getElementById('tab-btn-pacientes');
        const tabReportes = document.getElementById('tab-btn-reportes');
        const panePacientes = document.getElementById('pane-pacientes');
        const paneReportes = document.getElementById('pane-reportes');
        const navItemPacientes = document.getElementById('enf-nav-item-pacientes');
        const navItemReportes = document.getElementById('enf-nav-item-reportes');

        if (modulo === 'pacientes') {
            if (tabPacientes) tabPacientes.classList.add('active');
            if (tabReportes) tabReportes.classList.remove('active');
            if (navItemPacientes) navItemPacientes.classList.add('active');
            if (navItemReportes) navItemReportes.classList.remove('active');
            if (panePacientes) panePacientes.classList.add('active');
            if (paneReportes) paneReportes.classList.remove('active');
        } else if (modulo === 'reportes') {
            if (tabReportes) tabReportes.classList.add('active');
            if (tabPacientes) tabPacientes.classList.remove('active');
            if (navItemReportes) navItemReportes.classList.add('active');
            if (navItemPacientes) navItemPacientes.classList.remove('active');
            if (paneReportes) paneReportes.classList.add('active');
            if (panePacientes) panePacientes.classList.remove('active');
            // Si hay un paciente seleccionado, pre-llenar en reportes
            if (pacienteSeleccionado) {
                prepararReporteConPaciente(pacienteSeleccionado);
            }
        }
    };

    // --------------------------------------------------------------------------
    // 7. BÚSQUEDA Y GESTIÓN DE PACIENTES
    // --------------------------------------------------------------------------
    window.consultarPacienteEnfermeria = function () {
        const input = document.getElementById('enf-search-cedula');
        if (!input) return;

        const val = input.value.trim().replace(/\D/g, '');
        if (!val || val.length < 5) {
            alert('Por favor ingrese un número de cédula válido (mínimo 5 dígitos).');
            input.focus();
            return;
        }

        const encontrado = pacientesBD.find(function (p) {
            return p.cedula === val;
        });

        const vistaInicial = document.getElementById('enf-vista-inicial');
        const vistaEncontrado = document.getElementById('enf-vista-encontrado');
        const vistaNoEncontrado = document.getElementById('enf-vista-no-encontrado');
        const vistaFormDosis = document.getElementById('enf-form-aplicar-dosis');

        if (vistaInicial) vistaInicial.style.display = 'none';
        if (vistaFormDosis) vistaFormDosis.style.display = 'none';

        if (encontrado) {
            pacienteSeleccionado = encontrado;
            renderizarTarjetaPaciente(encontrado);
            renderizarCarnetPaciente(encontrado);
            if (vistaEncontrado) vistaEncontrado.style.display = 'block';
            if (vistaNoEncontrado) vistaNoEncontrado.style.display = 'none';
        } else {
            pacienteSeleccionado = null;
            const lblCedula = document.getElementById('enf-lbl-cedula-nueva');
            if (lblCedula) lblCedula.textContent = `V-${val}`;
            const inputCedulaNueva = document.getElementById('reg-cedula-input');
            if (inputCedulaNueva) inputCedulaNueva.value = val;
            if (vistaEncontrado) vistaEncontrado.style.display = 'none';
            if (vistaNoEncontrado) vistaNoEncontrado.style.display = 'block';
        }
    };

    window.limpiarBusquedaEnfermeria = function () {
        pacienteSeleccionado = null;
        const input = document.getElementById('enf-search-cedula');
        if (input) input.value = '';

        const vistaInicial = document.getElementById('enf-vista-inicial');
        const vistaEncontrado = document.getElementById('enf-vista-encontrado');
        const vistaNoEncontrado = document.getElementById('enf-vista-no-encontrado');
        const vistaFormDosis = document.getElementById('enf-form-aplicar-dosis');

        if (vistaInicial) vistaInicial.style.display = 'block';
        if (vistaEncontrado) vistaEncontrado.style.display = 'none';
        if (vistaNoEncontrado) vistaNoEncontrado.style.display = 'none';
        if (vistaFormDosis) vistaFormDosis.style.display = 'none';
    };

    function renderizarTarjetaPaciente(paciente) {
        const elAvatar = document.getElementById('enf-card-avatar');
        const elNombre = document.getElementById('enf-card-nombre');
        const elCedula = document.getElementById('enf-card-cedula');
        const elEdad = document.getElementById('enf-card-edad');
        const elSexo = document.getElementById('enf-card-sexo');
        const elTelf = document.getElementById('enf-card-telf');
        const elNac = document.getElementById('enf-card-nac');
        const elUbic = document.getElementById('enf-card-ubic');
        const boxRep = document.getElementById('enf-box-representante');
        const elRep = document.getElementById('enf-card-rep');

        const iniciales = paciente.nombre.split(' ').map(function (n) { return n[0]; }).slice(0, 2).join('');
        if (elAvatar) elAvatar.textContent = iniciales;
        if (elNombre) elNombre.textContent = paciente.nombre;
        if (elCedula) elCedula.textContent = `${paciente.tipoDoc}-${paciente.cedula}`;
        if (elEdad) elEdad.textContent = `${paciente.edad} años ${paciente.esMenor ? '(Pediátrico)' : '(Adulto)'}`;
        if (elSexo) elSexo.textContent = `Sexo: ${paciente.sexo}`;
        if (elTelf) elTelf.textContent = paciente.telefono;
        if (elNac) elNac.textContent = paciente.fechaNacFormat;
        if (elUbic) elUbic.textContent = `${paciente.parroquia}, Mcpio. ${paciente.municipio}, Edo. ${paciente.estado}`;

        if (paciente.esMenor && paciente.representante) {
            if (boxRep) boxRep.style.display = 'block';
            if (elRep) elRep.textContent = `${paciente.representante.nombre} (${paciente.representante.parentesco} - ${paciente.representante.cedula})`;
        } else {
            if (boxRep) boxRep.style.display = 'none';
        }
    }

    function renderizarCarnetPaciente(paciente) {
        const tbody = document.getElementById('enf-tabla-carnet-body');
        const badgeTotal = document.getElementById('enf-badge-total-dosis');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (badgeTotal) badgeTotal.textContent = `● ${paciente.carnet.length} Dosis Registradas`;

        if (paciente.carnet.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--color-texto-muted);">Sin vacunas previas registradas.</td></tr>';
            return;
        }

        paciente.carnet.forEach(function (dosis, idx) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight:700; color:var(--color-primario-oscuro);">${dosis.vacuna}</div>
                    <div style="font-size:0.75rem; color:var(--color-texto-muted);">Registro Oficial PAI-MPPS</div>
                </td>
                <td><span class="meta-chip font-mono">${dosis.dosis}</span></td>
                <td><span class="font-mono">${dosis.fecha}</span></td>
                <td><span class="meta-chip font-mono" style="background:#f1f5f9;">${dosis.lote}</span></td>
                <td><span style="font-size:0.8rem;">${dosis.enfermero}</span></td>
                <td><span class="meta-chip" style="background:#dcfce7; color:#166534; font-weight:700;">✓ Aplicada</span></td>
                <td class="text-right">
                    <button type="button" class="btn-health btn-health-outline" style="font-size:0.75rem; padding:4px 8px;"
                        onclick="window.iniciarReporteDesdeDosis('${encodeURIComponent(dosis.vacuna)}', '${encodeURIComponent(dosis.lote)}')">
                        ⚠️ Notificar ESAVI
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // --------------------------------------------------------------------------
    // 8. FORMULARIO DE APLICACIÓN DE NUEVA VACUNA (ENFERMERO)
    // --------------------------------------------------------------------------
    window.mostrarFormularioNuevaDosis = function () {
        if (!pacienteSeleccionado) {
            alert('Debe consultar un paciente primero.');
            return;
        }

        const vistaFormDosis = document.getElementById('enf-form-aplicar-dosis');
        const elPacienteNombre = document.getElementById('dosis-paciente-nombre');
        const elFecha = document.getElementById('dosis-fecha-input');
        const elLote = document.getElementById('dosis-lote-input');

        if (elPacienteNombre) {
            elPacienteNombre.textContent = `${pacienteSeleccionado.nombre} (${pacienteSeleccionado.tipoDoc}-${pacienteSeleccionado.cedula})`;
        }

        if (elFecha) {
            const hoy = new Date().toISOString().split('T')[0];
            elFecha.value = hoy;
        }

        if (elLote && !elLote.value) {
            elLote.value = 'LOTE-2026-N' + Math.floor(1000 + Math.random() * 9000);
        }

        if (vistaFormDosis) {
            vistaFormDosis.style.display = 'block';
            vistaFormDosis.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.cancelarFormularioDosis = function () {
        const vistaFormDosis = document.getElementById('enf-form-aplicar-dosis');
        if (vistaFormDosis) vistaFormDosis.style.display = 'none';
    };

    window.guardarDosisEnfermeria = function (e) {
        if (e) e.preventDefault();
        if (!pacienteSeleccionado) return;

        const vacuna = document.getElementById('dosis-vacuna-select').value;
        const dosis = document.getElementById('dosis-esquema-select').value;
        const fecha = document.getElementById('dosis-fecha-input').value;
        const lote = document.getElementById('dosis-lote-input').value;
        const via = document.getElementById('dosis-via-select').value;
        const sitio = document.getElementById('dosis-sitio-select').value;

        if (!vacuna || !dosis || !fecha || !lote) {
            alert('Por favor complete los campos obligatorios del registro de vacuna.');
            return;
        }

        const nuevaDosis = {
            vacuna: vacuna,
            dosis: dosis,
            fecha: fecha,
            lote: lote,
            centro: "Hospital Dr. Israel Ranuárez Balza",
            enfermero: `${sesionActiva.enfermero.nombre} (MPPS #${sesionActiva.enfermero.mpps})`,
            estado: "Completada",
            via: via,
            sitio: sitio
        };

        pacienteSeleccionado.carnet.push(nuevaDosis);
        sesionActiva.dosisHoy += 1;
        sesionActiva.pacientesHoy += 1;

        actualizarCabeceraSesion();
        renderizarCarnetPaciente(pacienteSeleccionado);
        cancelarFormularioDosis();

        mostrarToast(`Dosis registrada con éxito: ${vacuna} (${dosis})`);
    };

    // --------------------------------------------------------------------------
    // 9. REGISTRO EN-SITU DE NUEVO PACIENTE POR ENFERMERÍA
    // --------------------------------------------------------------------------
    window.guardarNuevoPacienteEnfermeria = function (e) {
        if (e) e.preventDefault();

        const cedula = document.getElementById('reg-cedula-input').value.trim();
        const tipoDoc = document.getElementById('reg-tipodoc-select').value;
        const nombre = document.getElementById('reg-nombre-input').value.trim();
        const fechaNac = document.getElementById('reg-fechanac-input').value;
        const sexo = document.getElementById('reg-sexo-select').value;
        const telefono = document.getElementById('reg-telefono-input').value.trim();
        const esMenor = document.getElementById('reg-esmenor-check').checked;

        if (!cedula || !nombre || !fechaNac) {
            alert('Por favor complete los campos de Cédula, Nombres y Fecha de Nacimiento.');
            return;
        }

        const nuevo = {
            cedula: cedula,
            tipoDoc: tipoDoc,
            nombre: nombre,
            fechaNac: fechaNac,
            fechaNacFormat: fechaNac.split('-').reverse().join('/'),
            edad: 25,
            esMenor: esMenor,
            sexo: sexo,
            telefono: telefono || '0414-0000000',
            email: 'sin_correo@mpps.gob.ve',
            estado: 'Guárico',
            municipio: 'Juan Germán Roscio',
            parroquia: 'San Juan de los Morros',
            direccion: 'San Juan de los Morros',
            carnet: []
        };

        if (esMenor) {
            nuevo.representante = {
                nombre: document.getElementById('reg-rep-nombre-input').value.trim() || 'Representante Legal',
                cedula: document.getElementById('reg-rep-cedula-input').value.trim() || 'V-00.000.000',
                parentesco: document.getElementById('reg-rep-parentesco-select').value || 'Madre',
                telefono: telefono || '0414-0000000'
            };
        }

        pacientesBD.push(nuevo);
        pacienteSeleccionado = nuevo;

        const inputSearch = document.getElementById('enf-search-cedula');
        if (inputSearch) inputSearch.value = cedula;

        const vistaNoEncontrado = document.getElementById('enf-vista-no-encontrado');
        const vistaEncontrado = document.getElementById('enf-vista-encontrado');
        if (vistaNoEncontrado) vistaNoEncontrado.style.display = 'none';
        if (vistaEncontrado) vistaEncontrado.style.display = 'block';

        renderizarTarjetaPaciente(nuevo);
        renderizarCarnetPaciente(nuevo);
        mostrarToast(`Paciente ${nuevo.nombre} registrado con carnet habilitado.`);
    };

    // --------------------------------------------------------------------------
    // 10. MÓDULO DE REPORTES ESAVI (ENFERMERÍA)
    // --------------------------------------------------------------------------
    window.iniciarReporteDesdeDosis = function (vacunaEnc, loteEnc) {
        const vacuna = decodeURIComponent(vacunaEnc);
        const lote = decodeURIComponent(loteEnc);

        cambiarModuloEnfermeria('reportes');

        const elVacunaSelect = document.getElementById('esavi-vacuna-select');
        const elLoteInput = document.getElementById('esavi-lote-input');

        if (elVacunaSelect) {
            // Si la vacuna existe en las opciones, seleccionarla; si no, agregarla
            let encontrada = false;
            for (let i = 0; i < elVacunaSelect.options.length; i++) {
                if (elVacunaSelect.options[i].text.includes(vacuna) || elVacunaSelect.options[i].value.includes(vacuna)) {
                    elVacunaSelect.selectedIndex = i;
                    encontrada = true;
                    break;
                }
            }
            if (!encontrada) {
                const opt = new Option(vacuna, vacuna, true, true);
                elVacunaSelect.add(opt);
            }
        }

        if (elLoteInput) {
            elLoteInput.value = lote;
        }

        mostrarToast(`Datos de ${vacuna} pre-cargados para reporte.`);
    };

    function prepararReporteConPaciente(paciente) {
        const elPacienteLabel = document.getElementById('esavi-paciente-display');
        const elCedulaHidden = document.getElementById('esavi-paciente-cedula-hidden');
        if (elPacienteLabel) {
            elPacienteLabel.innerHTML = `<strong>${paciente.nombre}</strong> (${paciente.tipoDoc}-${paciente.cedula}) • ${paciente.edad} años`;
        }
        if (elCedulaHidden) {
            elCedulaHidden.value = `${paciente.tipoDoc}-${paciente.cedula}`;
        }

        // Llenar selector de vacunas del carnet de este paciente
        const selectVacuna = document.getElementById('esavi-vacuna-select');
        if (selectVacuna && paciente.carnet && paciente.carnet.length > 0) {
            selectVacuna.innerHTML = '<option value="">-- Seleccione biológico del historial del paciente --</option>';
            paciente.carnet.forEach(function (c) {
                const opt = new Option(`${c.vacuna} (Lote: ${c.lote})`, c.vacuna);
                selectVacuna.add(opt);
            });
        }
    }

    window.guardarReporteESAVI = function (e) {
        if (e) e.preventDefault();

        const cedula = document.getElementById('esavi-paciente-cedula-hidden').value;
        const pacienteNom = document.getElementById('esavi-paciente-display').innerText || 'Paciente';
        const vacuna = document.getElementById('esavi-vacuna-select').value;
        const lote = document.getElementById('esavi-lote-input').value;
        const gravedad = document.querySelector('input[name="esavi-gravedad"]:checked');
        const sintomasDesc = document.getElementById('esavi-sintomas-text').value.trim();
        const accionesDesc = document.getElementById('esavi-acciones-text').value.trim();

        if (!vacuna) {
            alert('Por favor seleccione la vacuna implicada en el evento adverso.');
            return;
        }

        if (!gravedad) {
            alert('Por favor seleccione el nivel de gravedad clínica.');
            return;
        }

        if (!sintomasDesc) {
            alert('Por favor describa los signos y síntomas clínicos observados.');
            return;
        }

        const nuevoReporte = {
            codigo: 'ESAVI-2026-00' + Math.floor(45 + Math.random() * 50),
            cedula: cedula || 'V-28.452.190',
            paciente: pacienteNom.split('•')[0].trim(),
            vacuna: vacuna,
            lote: lote || 'LOTE-PAI-2026',
            gravedad: gravedad.value,
            sintomas: sintomasDesc,
            acciones: accionesDesc || 'Observación clínica y soporte ambulatorio.',
            enfermero: `${sesionActiva.enfermero.nombre} (MPPS #${sesionActiva.enfermero.mpps})`,
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        reportesJornada.unshift(nuevoReporte);
        sesionActiva.reportesHoy += 1;
        actualizarCabeceraSesion();
        renderizarTablaReportes();

        // Limpiar formulario
        document.getElementById('form-esavi-enfermero').reset();
        mostrarModalComprobanteReporte(nuevoReporte);
        mostrarToast(`Reporte ${nuevoReporte.codigo} transmitido al Sistema Nacional.`);
    };

    function renderizarTablaReportes() {
        const tbody = document.getElementById('tabla-reportes-enfermeria-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (reportesJornada.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--color-texto-muted);">Sin reportes de eventos adversos emitidos en la guardia.</td></tr>';
            return;
        }

        reportesJornada.forEach(function (rep) {
            const tr = document.createElement('tr');
            let colorBadge = 'color:#15803d; background:#dcfce7;';
            if (rep.gravedad === 'Moderado') {
                colorBadge = 'color:#b45309; background:#fef3c7;';
            } else if (rep.gravedad === 'Grave') {
                colorBadge = 'color:#b91c1c; background:#fee2e2;';
            }

            tr.innerHTML = `
                <td><strong class="font-mono" style="color:var(--color-primario-oscuro);">${rep.codigo}</strong></td>
                <td>
                    <div style="font-weight:600;">${rep.paciente}</div>
                    <div class="font-mono" style="font-size:0.75rem; color:var(--color-texto-muted);">${rep.cedula}</div>
                </td>
                <td>
                    <div>${rep.vacuna}</div>
                    <span class="meta-chip font-mono" style="font-size:0.7rem;">${rep.lote}</span>
                </td>
                <td>
                    <span class="meta-chip" style="${colorBadge} font-weight:700;">
                        ● ${rep.gravedad}
                    </span>
                </td>
                <td><span style="font-size:0.8rem;">${rep.enfermero}</span></td>
                <td><span class="font-mono" style="font-size:0.78rem;">${rep.fecha} ${rep.hora}</span></td>
                <td class="text-right">
                    <button type="button" class="btn-health btn-health-outline" style="font-size:0.74rem; padding:4px 8px;"
                        onclick="window.verDetalleReporte('${rep.codigo}')">
                        👁️ Ver Ficha
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.verDetalleReporte = function (codigo) {
        const rep = reportesJornada.find(function (r) { return r.codigo === codigo; });
        if (rep) {
            mostrarModalComprobanteReporte(rep);
        }
    };

    function mostrarModalComprobanteReporte(rep) {
        const modal = document.getElementById('modal-comprobante-reporte');
        const cont = document.getElementById('comprobante-contenido-modal');
        if (!modal || !cont) return;

        let badgeClass = 'kpi-badge-blue';
        if (rep.gravedad === 'Grave') badgeClass = 'kpi-badge-red';
        else if (rep.gravedad === 'Moderado') badgeClass = 'kpi-badge-amber';

        cont.innerHTML = `
            <div style="border-bottom: 2px solid var(--border-color); padding-bottom: 14px; margin-bottom: 16px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span class="kpi-category-badge ${badgeClass}">CASO ${rep.gravedad.toUpperCase()}</span>
                    <h3 style="font-size:1.15rem; font-weight:800; color:var(--color-primario-oscuro); margin-top:6px;">
                        Expediente ESAVI: ${rep.codigo}
                    </h3>
                </div>
                <div style="text-align:right; font-family:var(--font-mono); font-size:0.78rem; color:var(--color-texto-muted);">
                    <div>${rep.fecha}</div>
                    <div>${rep.hora}</div>
                </div>
            </div>

            <div class="patient-details-grid" style="margin-bottom:16px;">
                <div class="detail-data-box">
                    <div class="detail-label">Paciente Afectado</div>
                    <div class="detail-value">${rep.paciente}</div>
                </div>
                <div class="detail-data-box">
                    <div class="detail-label">Identificación Oficial</div>
                    <div class="detail-value font-mono">${rep.cedula}</div>
                </div>
                <div class="detail-data-box">
                    <div class="detail-label">Biológico Notificado</div>
                    <div class="detail-value">${rep.vacuna}</div>
                </div>
                <div class="detail-data-box">
                    <div class="detail-label">Lote Administrado</div>
                    <div class="detail-value font-mono">${rep.lote}</div>
                </div>
            </div>

            <div style="background:#f8fafc; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; margin-bottom:14px;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--color-texto-muted); text-transform:uppercase;">Signos y Síntomas Clínicos:</div>
                <p style="margin:4px 0 0 0; font-size:0.88rem; color:var(--color-texto);">${rep.sintomas}</p>
            </div>

            <div style="background:#f8fafc; border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; margin-bottom:14px;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--color-texto-muted); text-transform:uppercase;">Conducta Terapéutica Adoptada:</div>
                <p style="margin:4px 0 0 0; font-size:0.88rem; color:var(--color-texto);">${rep.acciones}</p>
            </div>

            <div class="nurse-signature-stamp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div>
                    <div><strong>Notificado y firmado por:</strong> ${rep.enfermero}</div>
                    <div style="font-size:0.75rem;">Hospital Dr. Israel Ranuárez Balza • San Juan de los Morros, Estado Guárico</div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    window.cerrarModalComprobante = function () {
        const modal = document.getElementById('modal-comprobante-reporte');
        if (modal) modal.classList.remove('active');
    };

    window.imprimirComprobante = function () {
        window.print();
    };

    // --------------------------------------------------------------------------
    // 11. UTILIDADES Y TOAST ALERTS
    // --------------------------------------------------------------------------
    function mostrarToast(mensaje) {
        let toast = document.getElementById('nurse-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'nurse-toast';
            toast.className = 'nurse-toast-alert';
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

    function configurarEventos() {
        // Toggle pediátrico en formulario de nuevo paciente
        const checkEsMenor = document.getElementById('reg-esmenor-check');
        const boxRepFields = document.getElementById('reg-rep-fields-box');
        if (checkEsMenor && boxRepFields) {
            checkEsMenor.addEventListener('change', function () {
                boxRepFields.style.display = this.checked ? 'block' : 'none';
            });
        }
    }

})();
