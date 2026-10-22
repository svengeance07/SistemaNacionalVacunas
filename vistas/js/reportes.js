/**
 * ==========================================================================
 * PUYASO / Sistema Nacional de Inmunizaciones (SIV)
 * Módulo de Vigilancia Epidemiológica y Notificación de Problemas / ESAVI
 * Archivo: reportes.js
 * ==========================================================================
 */

// --- 1. Base de Datos de Pacientes (Consistente con pacientes.html) ---
const baseDatosPacientes = {
    '28452190': {
        tipoCedula: 'V',
        cedula: '28452190',
        nombreCompleto: 'Carlos Eduardo Mendoza Peña',
        iniciales: 'CM',
        categoria: 'Mayor de Edad (28 años)',
        sexo: 'Masculino',
        telefono: '0414-8901234',
        fechaNac: '15/04/1998',
        ubicacion: 'San Juan de los Morros, Mcpio. Roscio',
        centro: 'Hospital Dr. Israel Ranuárez Balza',
        esNino: false,
        vacunas: [
            {
                nombre: 'Fiebre Amarilla',
                dosis: 'Dosis Única (0.5ml)',
                fecha: '2026-03-12',
                lote: 'FA-VEN-2026-G1',
                centro: 'Hospital Dr. Israel Ranuárez Balza',
                enfermero: 'Lic. Marlene Requena',
                esUltima: true
            },
            {
                nombre: 'Toxoide Tetánico Diftérico',
                dosis: '1er Refuerzo',
                fecha: '2025-11-20',
                lote: 'TT-VEN-88',
                centro: 'CDI Che Guevara',
                enfermero: 'Enf. Jonathan Silva'
            },
            {
                nombre: 'Hepatitis B Adulto',
                dosis: '3ra Dosis (Fin Esquema)',
                fecha: '2025-05-10',
                lote: 'HB-VEN-118',
                centro: 'Hospital Dr. Israel Ranuárez Balza',
                enfermero: 'Lic. Marlene Requena'
            }
        ]
    },
    '24119504': {
        tipoCedula: 'V',
        cedula: '24119504',
        nombreCompleto: 'Ana Victoria Rojas Silva',
        iniciales: 'AR',
        categoria: 'Madre / Representante Legal',
        sexo: 'Femenino',
        telefono: '0412-4455667',
        fechaNac: '08/09/1994',
        ubicacion: 'San Juan de los Morros, Mcpio. Roscio',
        centro: 'Hospital Dr. Israel Ranuárez Balza',
        esNino: false,
        hijos: [
            {
                nombreCompleto: 'Mateo Alejandro Rojas Silva',
                iniciales: 'MR',
                categoria: 'Menor de Edad (Pediátrico, 2 años)',
                sexo: 'Masculino',
                esNino: true,
                repNombre: 'Ana Victoria Rojas Silva',
                repCedula: '24119504',
                repTipo: 'V',
                vacunas: [
                    {
                        nombre: 'Pentavalente (DTP-HB-Hib)',
                        dosis: '3ra Dosis Refuerzo',
                        fecha: '2026-02-15',
                        lote: 'PTA-VEN-99',
                        centro: 'Hospital Dr. Israel Ranuárez Balza',
                        enfermero: 'Lic. Marlene Requena',
                        esUltima: true
                    },
                    {
                        nombre: 'Polio Oral (bOPV)',
                        dosis: '2da Dosis',
                        fecha: '2025-10-10',
                        lote: 'POL-VEN-42',
                        centro: 'CDI Che Guevara',
                        enfermero: 'Enf. Jonathan Silva'
                    }
                ]
            }
        ],
        vacunas: [
            {
                nombre: 'Toxoide Tetánico Diftérico',
                dosis: 'Refuerzo Quinquenal',
                fecha: '2024-06-18',
                lote: 'TT-VEN-50',
                centro: 'Hospital Dr. Israel Ranuárez Balza',
                enfermero: 'Lic. Marlene Requena',
                esUltima: true
            }
        ]
    }
};

// --- 2. Listado Histórico de Reportes Registrados en Memoria y Storage ---
let reportesRegistrados = [
    {
        id: 'REP-GUA-2026-001',
        fechaNotif: '2026-03-12',
        horaNotif: '14:30',
        pacienteNombre: 'Carlos Eduardo Mendoza Peña',
        pacienteCedula: 'V-28.452.190',
        pacienteEdad: '28 años',
        pacienteTelf: '0414-8901234',
        vacuna: 'Fiebre Amarilla (Dosis Adulto 0.5ml)',
        lote: 'FA-VEN-2026-G1',
        fechaAplicacion: '2026-03-12',
        fechaSintomas: '2026-03-12',
        intervalo: '1 a 6 horas (+4h)',
        gravedad: 'Moderado',
        sintomas: ['Fiebre alta (> 38.5°C)', 'Reacción local severa / Dolor intenso'],
        descripcion: 'Paciente refiere fiebre de 38.8°C y dolor intenso en deltoides izquierdo con induración de 4cm a las 4 horas de la vacunación.',
        conducta: 'Administrado antipirético vía oral, compresa fría local y reposo.',
        enfermero: 'Lic. Marlene Requena',
        centro: 'Hospital Dr. Israel Ranuárez Balza',
        destino: 'Subregión Guárico (Pendiente Consolidación)'
    },
    {
        id: 'REP-GUA-2026-002',
        fechaNotif: '2026-02-16',
        horaNotif: '09:15',
        pacienteNombre: 'Mateo Alejandro Rojas Silva',
        pacienteCedula: 'Menor • Rep: Ana Rojas (V-24.119.504)',
        pacienteEdad: '2 años',
        pacienteTelf: '0412-4455667',
        vacuna: 'Pentavalente (DTP-HB-Hib) 3ra Dosis Refuerzo',
        lote: 'PTA-VEN-99',
        fechaAplicacion: '2026-02-15',
        fechaSintomas: '2026-02-16',
        intervalo: '6 a 24 horas (+18h)',
        gravedad: 'Leve',
        sintomas: ['Fiebre alta (> 38.5°C)', 'Llanto persistente e inconsolable'],
        descripcion: 'Madre acude al centro por irritabilidad y febrícula de 38.2°C al día siguiente de la administración de la pentavalente.',
        conducta: 'Tratamiento con gotas de acetaminofén según peso corporal.',
        enfermero: 'Lic. Marlene Requena',
        centro: 'Hospital Dr. Israel Ranuárez Balza',
        destino: 'Subregión Guárico (Pendiente Consolidación)'
    }
];

// Cargar desde sessionStorage si existen reportes previos
try {
    const saved = sessionStorage.getItem('puyaso_reportes_cache');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
            reportesRegistrados = parsed;
        }
    }
} catch (e) {
    console.warn('No se pudo acceder al cache de reportes');
}

// Variables de estado del flujo actual
let pacienteActualReporte = null;
let vacunaSeleccionadaReporte = null;

// --- 3. Control de Vistas (Igual que en pacientes.html) ---
function cambiarVista(vistaId) {
    const vistas = ['vista-listado', 'vista-nuevo-reporte'];
    vistas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === vistaId) {
                el.classList.add('active');
                el.style.display = 'block';
            } else {
                el.classList.remove('active');
                el.style.display = 'none';
            }
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function irAListado() {
    cambiarVista('vista-listado');
    renderizarTablaReportes();
    actualizarKPIs();
}

function irANuevoReporte() {
    cambiarVista('vista-nuevo-reporte');
    actualizarPasosNav(1);
    // Si ya hay una fecha por defecto hoy
    const hoy = new Date().toISOString().split('T')[0];
    const inpFecha = document.getElementById('inp-fecha-sintomas');
    if (inpFecha && !inpFecha.value) inpFecha.value = hoy;
}

function actualizarPasosNav(pasoActivo) {
    for (let i = 1; i <= 3; i++) {
        const el = document.getElementById(`step-nav-${i}`);
        if (!el) continue;
        el.classList.remove('active', 'completed');
        if (i < pasoActivo) {
            el.classList.add('completed');
        } else if (i === pasoActivo) {
            el.classList.add('active');
        }
    }
}

// --- 4. Renderizado de la Tabla y Filtros ---
function renderizarTablaReportes(filtroTexto = '', filtroGravedad = 'todas') {
    const tbody = document.getElementById('cuerpo-tabla-reportes');
    const contadorEl = document.getElementById('txt-contador-tabla-reportes');
    if (!tbody) return;

    const q = filtroTexto.toLowerCase().trim();
    const g = filtroGravedad;

    const filtrados = reportesRegistrados.filter(rep => {
        const coincideTexto = !q ||
            rep.id.toLowerCase().includes(q) ||
            rep.pacienteNombre.toLowerCase().includes(q) ||
            rep.pacienteCedula.toLowerCase().includes(q) ||
            rep.vacuna.toLowerCase().includes(q) ||
            rep.lote.toLowerCase().includes(q);

        const coincideGravedad = (g === 'todas') || (rep.gravedad === g);

        return coincideTexto && coincideGravedad;
    });

    if (filtrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 42px 20px; color: var(--color-texto-secundario);">
                    <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
                    <strong style="font-size: 1.05rem; color: var(--color-texto); display: block; margin-bottom: 4px;">
                        No se encontraron reportes con los criterios indicados
                    </strong>
                    <p style="font-size: 0.85rem; margin-bottom: 14px;">
                        Intente buscar con otra cédula, vacuna o limpie los filtros.
                    </p>
                    <button type="button" class="btn-health btn-health-primary" onclick="irANuevoReporte()" style="font-size: 0.85rem;">
                        + Registrar Nuevo Problema
                    </button>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = filtrados.map(rep => {
            const badgeGravedad = rep.gravedad === 'Grave'
                ? `<span class="esavi-severity-pill pill-grave">🔴 Grave</span>`
                : (rep.gravedad === 'Moderado'
                    ? `<span class="esavi-severity-pill pill-moderado">🟡 Moderado</span>`
                    : `<span class="esavi-severity-pill pill-leve">🟢 Leve</span>`);

            return `
                <tr>
                    <td>
                        <div class="font-mono font-semibold" style="color: var(--color-primario-oscuro);">${rep.id}</div>
                        <small style="color: var(--color-texto-muted);">Centro Local</small>
                    </td>
                    <td>
                        <div>${rep.fechaNotif}</div>
                        <small style="color: var(--color-texto-muted);">${rep.horaNotif || '10:00'} hrs</small>
                    </td>
                    <td>
                        <strong>${rep.pacienteNombre}</strong>
                        <div style="font-size: 0.75rem; color: var(--color-texto-secundario);">${rep.pacienteCedula} (${rep.pacienteEdad})</div>
                    </td>
                    <td>
                        <strong>${rep.vacuna}</strong>
                    </td>
                    <td><span class="font-mono text-primary font-semibold">${rep.lote}</span></td>
                    <td>
                        <div style="font-size: 0.78rem;">Aplic: <strong>${rep.fechaAplicacion}</strong></div>
                        <div style="font-size: 0.78rem; color: #b45309;">Sint: <strong>${rep.fechaSintomas}</strong> (${rep.intervalo.split(' ')[0]})</div>
                    </td>
                    <td>${badgeGravedad}</td>
                    <td>
                        <span class="health-status-chip chip-verified" style="font-size: 0.72rem;">● Subregión Guárico</span>
                    </td>
                    <td class="text-right">
                        <button class="btn-health btn-health-sm btn-health-outline" type="button"
                            onclick="verFichaDetalle('${rep.id}')" style="padding: 5px 12px; font-size: 0.75rem;">
                            Ver Ficha
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (contadorEl) {
        contadorEl.textContent = `Mostrando ${filtrados.length} de ${reportesRegistrados.length} reportes registrados en este centro (Destino Subregión Guárico)`;
    }
}

function filtrarReportes() {
    const txt = document.getElementById('filtro-busqueda-tabla') ? document.getElementById('filtro-busqueda-tabla').value : '';
    const grav = document.getElementById('filtro-gravedad-tabla') ? document.getElementById('filtro-gravedad-tabla').value : 'todas';
    renderizarTablaReportes(txt, grav);
}

function actualizarKPIs() {
    const total = reportesRegistrados.length;
    const graves = reportesRegistrados.filter(r => r.gravedad === 'Grave').length;
    const levesMod = reportesRegistrados.filter(r => r.gravedad !== 'Grave').length;

    const elTotal = document.getElementById('kpi-total-reportes');
    const elGraves = document.getElementById('kpi-reportes-graves');
    const elLeves = document.getElementById('kpi-reportes-leves');

    if (elTotal) elTotal.textContent = total;
    if (elGraves) elGraves.textContent = graves;
    if (elLeves) elLeves.textContent = levesMod;
}

// --- 5. Búsqueda y Manejo del Paciente en el Reporte ---
function autocompletarBusqueda(cedula) {
    const inp = document.getElementById('rep-busq-cedula');
    if (inp) {
        inp.value = cedula;
        buscarPacienteReporte();
    }
}

function buscarPacienteReporte() {
    const inp = document.getElementById('rep-busq-cedula');
    const tipo = document.getElementById('rep-busq-tipo-doc') ? document.getElementById('rep-busq-tipo-doc').value : 'V';
    const cedula = inp ? inp.value.trim().replace(/\D/g, '') : '';
    const alerta = document.getElementById('alerta-busqueda-paciente');
    const bloqueHijos = document.getElementById('bloque-seleccion-afectado');

    if (!cedula) {
        mostrarAlerta('Por favor ingrese un número de cédula para consultar.', 'warning');
        return;
    }

    const paciente = baseDatosPacientes[cedula];

    if (paciente) {
        if (alerta) alerta.style.display = 'none';

        // Si tiene menores a su cargo (ej: Ana Rojas con hijo Mateo)
        if (paciente.hijos && paciente.hijos.length > 0) {
            if (bloqueHijos) {
                bloqueHijos.style.display = 'block';
                const contenedor = document.getElementById('contenedor-opciones-afectado');
                contenedor.innerHTML = `
                    <button type="button" class="btn-health btn-health-outline" onclick="seleccionarSujetoAfectado('${cedula}', 'adulto')" style="border-color: #86efac; background: #f0fdf4;">
                        👤 <strong>${paciente.nombreCompleto}</strong> (Adulto)
                    </button>
                    ${paciente.hijos.map((h, i) => `
                        <button type="button" class="btn-health btn-health-primary" onclick="seleccionarSujetoAfectado('${cedula}', 'hijo', ${i})" style="cursor: pointer;">
                            👶 <strong>${h.nombreCompleto}</strong> (${h.categoria})
                        </button>
                    `).join('')}
                `;
            }
            // Por defecto seleccionar al menor o al adulto
            seleccionarSujetoAfectado(cedula, 'hijo', 0);
        } else {
            if (bloqueHijos) bloqueHijos.style.display = 'none';
            establecerPacienteActivo(paciente);
        }
    } else {
        // Paciente no registrado previamente en mock: permitir reporte directo para no bloquear la atención de emergencia
        if (bloqueHijos) bloqueHijos.style.display = 'none';
        mostrarAlerta(`Cédula ${tipo}-${cedula} no posee carnet digital previo en este centro. Puede crear la ficha clínica directa para reportar el evento.`, 'info');

        const nuevoTemporal = {
            tipoCedula: tipo,
            cedula: cedula,
            nombreCompleto: `Paciente C.I. ${tipo}-${cedula}`,
            iniciales: 'PC',
            categoria: 'Paciente en Atención',
            sexo: 'No especificado',
            telefono: 'No registrado',
            ubicacion: 'San Juan de los Morros, Mcpio. Roscio',
            vacunas: [
                {
                    nombre: 'Vacuna por Notificar',
                    dosis: 'Dosis Reciente',
                    fecha: new Date().toISOString().split('T')[0],
                    lote: 'LOTE-POR-VERIFICAR',
                    centro: 'Hospital Dr. Israel Ranuárez Balza',
                    enfermero: 'Lic. Marlene Requena',
                    esUltima: true
                }
            ]
        };
        establecerPacienteActivo(nuevoTemporal);
    }
}

function seleccionarSujetoAfectado(cedulaRep, rol, indexHijo = 0) {
    const rep = baseDatosPacientes[cedulaRep];
    if (!rep) return;

    if (rol === 'hijo' && rep.hijos && rep.hijos[indexHijo]) {
        const hijo = rep.hijos[indexHijo];
        const p = {
            tipoCedula: rep.tipoCedula,
            cedula: rep.cedula,
            nombreCompleto: hijo.nombreCompleto,
            iniciales: hijo.iniciales,
            categoria: `${hijo.categoria} • Rep: ${rep.nombreCompleto}`,
            sexo: hijo.sexo,
            telefono: rep.telefono,
            ubicacion: rep.ubicacion,
            vacunas: hijo.vacunas
        };
        establecerPacienteActivo(p);
    } else {
        establecerPacienteActivo(rep);
    }
}

function establecerPacienteActivo(p) {
    pacienteActualReporte = p;

    // Renderizar ficha resumen
    document.getElementById('rep-display-avatar').textContent = p.iniciales || 'P';
    document.getElementById('rep-display-nombre').textContent = p.nombreCompleto;
    document.getElementById('rep-display-cedula').textContent = `${p.tipoCedula}-${p.cedula}`;
    document.getElementById('rep-display-categoria').textContent = p.categoria;
    document.getElementById('rep-display-sexo').textContent = p.sexo || 'No especificado';
    document.getElementById('rep-display-telf').textContent = p.telefono || 'Sin teléfono';

    document.getElementById('ficha-paciente-seleccionado').style.display = 'block';

    // Mostrar Paso 2 (Vacunas)
    document.getElementById('paso-2-vacuna').style.display = 'block';
    renderizarVacunasPaciente(p);

    actualizarPasosNav(2);
}

function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.getElementById('alerta-busqueda-paciente');
    if (!alerta) return;

    const bg = tipo === 'warning' ? '#fef3c7' : (tipo === 'info' ? '#eff6ff' : '#fee2e2');
    const border = tipo === 'warning' ? '#fde68a' : (tipo === 'info' ? '#bfdbfe' : '#fca5a5');
    const color = tipo === 'warning' ? '#92400e' : (tipo === 'info' ? '#1e40af' : '#991b1b');

    alerta.style.display = 'block';
    alerta.style.background = bg;
    alerta.style.border = `1px solid ${border}`;
    alerta.style.color = color;
    alerta.style.padding = '10px 14px';
    alerta.style.borderRadius = 'var(--radius-md)';
    alerta.style.fontSize = '0.84rem';
    alerta.innerHTML = `<strong>Aviso:</strong> ${mensaje}`;
}

// --- 6. Renderizado de Vacunas del Paciente (Cero Redundancia) ---
function renderizarVacunasPaciente(paciente, preseleccionarNombre = null) {
    const cont = document.getElementById('contenedor-vacunas-paciente');
    const badgeCount = document.getElementById('badge-contador-vacunas-paciente');
    if (!cont) return;

    const vacunas = paciente.vacunas || [];
    if (badgeCount) badgeCount.textContent = `${vacunas.length} Dosis en Historial`;

    if (vacunas.length === 0) {
        cont.innerHTML = `
            <div style="grid-column: 1 / -1; padding: 20px; text-align: center; color: var(--color-texto-secundario); background: #f8fafc; border-radius: var(--radius-md);">
                El paciente no tiene vacunas cargadas en su carnet digital. Utilice el botón inferior para ingresar los datos del biológico.
            </div>
        `;
        return;
    }

    // Encontrar cuál preseleccionar: la indicada por URL o la última administrada
    let seleccionIndice = 0;
    if (preseleccionarNombre) {
        const idx = vacunas.findIndex(v => v.nombre.toLowerCase().includes(preseleccionarNombre.toLowerCase()));
        if (idx !== -1) seleccionIndice = idx;
    } else {
        const idxUltima = vacunas.findIndex(v => v.esUltima);
        if (idxUltima !== -1) seleccionIndice = idxUltima;
    }

    cont.innerHTML = vacunas.map((v, idx) => {
        const esUltima = v.esUltima || idx === 0;
        const esSeleccionada = idx === seleccionIndice;

        return `
            <div class="vaccine-card-select ${esUltima ? 'is-latest' : ''} ${esSeleccionada ? 'selected' : ''}"
                id="card-vacuna-${idx}" onclick="seleccionarVacunaReporte(${idx})">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                    <span style="font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; ${esUltima ? 'background: #15803d; color: #ffffff;' : 'background: #e2e8f0; color: #475569;'} text-transform: uppercase;">
                        ${esUltima ? '🟢 ÚLTIMA APLICADA' : 'HISTORIAL PREVIO'}
                    </span>
                    <input type="radio" name="radio_vacuna_reporte" ${esSeleccionada ? 'checked' : ''} style="cursor: pointer; accent-color: var(--color-primario);">
                </div>

                <div style="font-size: 1rem; font-weight: 700; color: var(--color-texto); margin-bottom: 2px;">
                    ${v.nombre}
                </div>
                <div style="font-size: 0.8rem; color: var(--color-texto-secundario); margin-bottom: 8px;">
                    ${v.dosis}
                </div>

                <div style="font-size: 0.78rem; display: flex; flex-direction: column; gap: 3px; border-top: 1px solid rgba(0,0,0,0.06); padding-top: 8px;">
                    <div>📅 <strong>Fecha:</strong> <span class="font-mono">${v.fecha}</span></div>
                    <div>🏷️ <strong>Lote:</strong> <span class="font-mono font-semibold" style="color: var(--color-primario-oscuro);">${v.lote}</span></div>
                    <div style="color: var(--color-texto-muted);">🏥 ${v.centro || 'Hospital Dr. Israel Ranuárez Balza'}</div>
                </div>
            </div>
        `;
    }).join('');

    // Seleccionar por defecto la marcada
    seleccionarVacunaReporte(seleccionIndice, false);
}

function seleccionarVacunaReporte(index, hacerScroll = true) {
    if (!pacienteActualReporte || !pacienteActualReporte.vacunas[index]) return;

    vacunaSeleccionadaReporte = pacienteActualReporte.vacunas[index];

    // Resaltar tarjeta seleccionada
    document.querySelectorAll('.vaccine-card-select').forEach((c, i) => {
        c.classList.toggle('selected', i === index);
        const radio = c.querySelector('input[type="radio"]');
        if (radio) radio.checked = (i === index);
    });

    // Actualizar datos en el Paso 3
    document.getElementById('sel-vacuna-nombre').textContent = `${vacunaSeleccionadaReporte.nombre} (${vacunaSeleccionadaReporte.dosis})`;
    document.getElementById('sel-vacuna-fecha').textContent = vacunaSeleccionadaReporte.fecha;
    document.getElementById('sel-vacuna-lote').textContent = vacunaSeleccionadaReporte.lote;
    document.getElementById('sel-vacuna-centro').textContent = vacunaSeleccionadaReporte.centro || 'Hospital Dr. Israel Ranuárez Balza';

    // Mostrar Paso 3
    const p3 = document.getElementById('paso-3-interrogatorio');
    p3.style.display = 'block';

    actualizarPasosNav(3);

    if (hacerScroll) {
        p3.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function desplazarAVacunas() {
    const p2 = document.getElementById('paso-2-vacuna');
    if (p2) p2.scrollIntoView({ behavior: 'smooth' });
}

function mostrarModalVacunaExterna() {
    const nombre = prompt('Ingrese el nombre de la vacuna externa administrada:');
    if (!nombre || !nombre.trim()) return;

    const lote = prompt('Ingrese el número de lote (si se conoce):', 'LOTE-EXTERNO') || 'LOTE-EXTERNO';
    const dosis = prompt('Ingrese la dosis administrada:', 'Dosis Única') || 'Dosis Única';
    const fecha = prompt('Ingrese la fecha de aplicación (AAAA-MM-DD):', new Date().toISOString().split('T')[0]) || new Date().toISOString().split('T')[0];

    const nuevaEx = {
        nombre: nombre.trim(),
        dosis: dosis.trim(),
        fecha: fecha.trim(),
        lote: lote.trim().toUpperCase(),
        centro: 'Jornada Externa / Otro Centro',
        esUltima: true
    };

    if (pacienteActualReporte) {
        pacienteActualReporte.vacunas.unshift(nuevaEx);
        renderizarVacunasPaciente(pacienteActualReporte);
        seleccionarVacunaReporte(0, true);
    }
}

// --- 7. Guardar Reporte Final y Transmitir a la Subregión ---
function guardarReporteFinal() {
    if (!pacienteActualReporte || !vacunaSeleccionadaReporte) {
        alert('Debe seleccionar un paciente y la vacuna objeto del reporte.');
        return;
    }

    const fechaSint = document.getElementById('inp-fecha-sintomas').value;
    const intervalo = document.getElementById('sel-intervalo-tiempo').value;
    const gravedad = document.getElementById('sel-nivel-gravedad').value;
    const descripcion = document.getElementById('inp-descripcion-reaccion').value.trim();
    const conducta = document.getElementById('inp-conducta-medica').value.trim();
    const enfermero = document.getElementById('inp-enfermero-notificante').value.trim();

    if (!fechaSint || !descripcion) {
        alert('Por favor complete la fecha de inicio de los síntomas y la descripción clínica.');
        return;
    }

    // Recopilar síntomas marcados
    const sintomasSeleccionados = [];
    document.querySelectorAll('input[name="sintoma"]:checked').forEach(chk => {
        sintomasSeleccionados.push(chk.value);
    });

    // Generar código correlativo de reporte
    const anio = new Date().getFullYear();
    const correlativo = String(reportesRegistrados.length + 1).padStart(3, '0');
    const codigo = `#REP-GUA-${anio}-${correlativo}`;

    const ahora = new Date();
    const fechaNotif = ahora.toISOString().split('T')[0];
    const horaNotif = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;

    const nuevoReporte = {
        id: codigo,
        fechaNotif: fechaNotif,
        horaNotif: horaNotif,
        pacienteNombre: pacienteActualReporte.nombreCompleto,
        pacienteCedula: `${pacienteActualReporte.tipoCedula}-${pacienteActualReporte.cedula}`,
        pacienteEdad: pacienteActualReporte.categoria,
        pacienteTelf: pacienteActualReporte.telefono,
        vacuna: `${vacunaSeleccionadaReporte.nombre} (${vacunaSeleccionadaReporte.dosis})`,
        lote: vacunaSeleccionadaReporte.lote,
        fechaAplicacion: vacunaSeleccionadaReporte.fecha,
        fechaSintomas: fechaSint,
        intervalo: intervalo,
        gravedad: gravedad,
        sintomas: sintomasSeleccionados,
        descripcion: descripcion,
        conducta: conducta || 'Manejo ambulatorio sintomático',
        enfermero: enfermero || 'Lic. Marlene Requena',
        centro: 'Hospital Dr. Israel Ranuárez Balza',
        destino: 'Subregión Guárico (En cola de transmisión)'
    };

    // Guardar al inicio del historial
    reportesRegistrados.unshift(nuevoReporte);

    try {
        sessionStorage.setItem('puyaso_reportes_cache', JSON.stringify(reportesRegistrados));
    } catch (e) {
        console.warn('Error al guardar en cache');
    }

    // Mostrar toast de éxito y volver al listado
    mostrarToast(`✅ Reporte ${codigo} registrado con éxito y transmitido a la Subregión Guárico`);
    irAListado();
}

function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22c55e" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${mensaje}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3800);
}

// --- 8. Modal de Ficha Epidemiológica Oficial ---
function verFichaDetalle(reporteId) {
    const rep = reportesRegistrados.find(r => r.id === reporteId);
    if (!rep) return;

    document.getElementById('modal-titulo-ficha').textContent = `Ficha Epidemiológica Oficial ESAVI ${rep.id}`;

    const badgeGravedad = rep.gravedad === 'Grave'
        ? `<span class="esavi-severity-pill pill-grave" style="font-size: 0.85rem;">🔴 Grave / Urgente</span>`
        : (rep.gravedad === 'Moderado'
            ? `<span class="esavi-severity-pill pill-moderado" style="font-size: 0.85rem;">🟡 Moderado</span>`
            : `<span class="esavi-severity-pill pill-leve" style="font-size: 0.85rem;">🟢 Leve</span>`);

    const listaSintomas = (rep.sintomas && rep.sintomas.length > 0)
        ? rep.sintomas.map(s => `<li style="margin-bottom: 4px;">${s}</li>`).join('')
        : '<li>No se marcaron signos específicos</li>';

    const contenidoHtml = `
        <div style="background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <div>
                    <span style="font-size: 0.72rem; color: var(--color-texto-muted); text-transform: uppercase; font-weight: 700;">Nivel de Severidad:</span>
                    <div style="margin-top: 4px;">${badgeGravedad}</div>
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 0.72rem; color: var(--color-texto-muted); text-transform: uppercase; font-weight: 700;">Fecha Notificación:</span>
                    <div style="font-weight: 700; color: var(--color-texto);">${rep.fechaNotif} (${rep.horaNotif || '10:00'})</div>
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
            <div>
                <strong style="display: block; font-size: 0.75rem; color: var(--color-texto-muted); text-transform: uppercase;">Datos del Paciente:</strong>
                <div style="font-size: 1rem; font-weight: 700; color: var(--color-texto);">${rep.pacienteNombre}</div>
                <div style="font-size: 0.82rem; color: var(--color-texto-secundario);">${rep.pacienteCedula} • ${rep.pacienteEdad}</div>
                <div style="font-size: 0.8rem; color: var(--color-texto-muted);">Contacto: ${rep.pacienteTelf || 'No registrado'}</div>
            </div>
            <div>
                <strong style="display: block; font-size: 0.75rem; color: var(--color-texto-muted); text-transform: uppercase;">Vacuna y Lote:</strong>
                <div style="font-size: 1rem; font-weight: 700; color: var(--color-primario-oscuro);">${rep.vacuna}</div>
                <div style="font-size: 0.82rem; color: var(--color-texto);">Lote: <strong class="font-mono text-primary">${rep.lote}</strong></div>
                <div style="font-size: 0.8rem; color: var(--color-texto-secundario);">Aplicada el: ${rep.fechaAplicacion}</div>
            </div>
        </div>

        <div style="margin-bottom: 14px; border-top: 1px solid var(--border-color); padding-top: 12px;">
            <strong style="display: block; font-size: 0.75rem; color: var(--color-texto-muted); text-transform: uppercase; margin-bottom: 4px;">
                Cronología e Inicio de los Síntomas:
            </strong>
            <div style="font-size: 0.85rem; color: var(--color-texto);">
                Inicio: <strong>${rep.fechaSintomas}</strong> • Intervalo transcurrido: <strong>${rep.intervalo}</strong>
            </div>
        </div>

        <div style="margin-bottom: 14px;">
            <strong style="display: block; font-size: 0.75rem; color: var(--color-texto-muted); text-transform: uppercase; margin-bottom: 6px;">
                Signos y Manifestaciones Clínicas Referidas:
            </strong>
            <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--color-texto); margin: 0;">
                ${listaSintomas}
            </ul>
        </div>

        <div style="margin-bottom: 14px;">
            <strong style="display: block; font-size: 0.75rem; color: var(--color-texto-muted); text-transform: uppercase; margin-bottom: 4px;">
                Descripción del Cuadro Clínico:
            </strong>
            <p style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 10px; font-size: 0.84rem; margin: 0; line-height: 1.5;">
                ${rep.descripcion}
            </p>
        </div>

        <div style="margin-bottom: 16px;">
            <strong style="display: block; font-size: 0.75rem; color: var(--color-texto-muted); text-transform: uppercase; margin-bottom: 4px;">
                Conducta Médica / Tratamiento Aplicado:
            </strong>
            <div style="font-size: 0.85rem; color: var(--color-texto);">
                ${rep.conducta || 'Manejo ambulatorio y observación sintomática.'}
            </div>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: var(--radius-md); padding: 12px; font-size: 0.8rem; color: #1e40af;">
            <div>🏛️ <strong>Jurisdicción:</strong> Hospital Dr. Israel Ranuárez Balza • San Juan de los Morros, Mcpio. Roscio</div>
            <div>👨‍⚕️ <strong>Notificante:</strong> ${rep.enfermero}</div>
            <div style="margin-top: 4px; font-weight: 600;">📡 Destino: Subregión Guárico (Sistema Nacional de Vigilancia Epidemiológica)</div>
        </div>
    `;

    document.getElementById('modal-contenido-ficha').innerHTML = contenidoHtml;
    const modal = document.getElementById('modal-detalle-reporte');
    modal.style.display = 'flex';
}

function cerrarModalFicha() {
    const modal = document.getElementById('modal-detalle-reporte');
    if (modal) modal.style.display = 'none';
}

// --- 9. Exportación a CSV ---
function exportarReportesCSV() {
    if (reportesRegistrados.length === 0) {
        alert('No hay reportes para exportar.');
        return;
    }

    let csv = 'Codigo,FechaNotif,Paciente,Cedula,Vacuna,Lote,FechaAplicacion,FechaSintomas,Intervalo,Gravedad,Enfermero,Centro\n';
    reportesRegistrados.forEach(r => {
        csv += `"${r.id}","${r.fechaNotif}","${r.pacienteNombre}","${r.pacienteCedula}","${r.vacuna}","${r.lote}","${r.fechaAplicacion}","${r.fechaSintomas}","${r.intervalo}","${r.gravedad}","${r.enfermero}","${r.centro}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Reportes_ESAVI_Hospital_RanuarezBalza_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- 10. Inicialización y Lectura de Parámetros URL (Desde pacientes.html) ---
document.addEventListener('DOMContentLoaded', () => {
    renderizarTablaReportes();
    actualizarKPIs();

    // Detectar si venimos desde pacientes.html con parámetros ?cedula=...&vacuna=...
    const urlParams = new URLSearchParams(window.location.search);
    const cedulaParam = urlParams.get('cedula');
    const vacunaParam = urlParams.get('vacuna');

    if (cedulaParam) {
        // Abrir directamente el flujo de nuevo reporte
        irANuevoReporte();
        const inpCed = document.getElementById('rep-busq-cedula');
        if (inpCed) {
            inpCed.value = cedulaParam;
            buscarPacienteReporte();

            // Si además se indicó la vacuna específica en la URL
            if (vacunaParam && pacienteActualReporte) {
                setTimeout(() => {
                    renderizarVacunasPaciente(pacienteActualReporte, vacunaParam);
                }, 100);
            }
        }
    }
});
