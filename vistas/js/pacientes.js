/**
 * ==========================================================================
 * PUYASO / Sistema Nacional de Inmunizaciones (SIV)
 * Módulo de Atención y Vacunación de Pacientes
 * Archivo: pacientes.js
 * ==========================================================================
 */

// Base de datos de pacientes registrados en memoria
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
        vacunas: [
            {
                nombre: 'Fiebre Amarilla',
                dosis: 'Dosis Única (0.5ml)',
                fecha: '2026-03-12',
                lote: 'FA-VEN-2026-G1',
                centro: 'Hospital Dr. Israel Ranuárez Balza',
                enfermero: 'Lic. Marlene Requena'
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
    }
};

// Referencia al paciente actualmente seleccionado
let pacienteActivo = baseDatosPacientes['28452190'];

// Alternancia armónica entre vistas (solo una visible a la vez)
function cambiarVista(vistaId) {
    const vistas = ['vista-inicio', 'vista-encontrado', 'vista-no-encontrado', 'vista-aplicar-vacuna'];
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
    window.scrollTo({ top: 120, behavior: 'smooth' });
}

// Estado inicial
function verInicio() {
    const input = document.getElementById('input-cedula');
    if (input) input.value = '';
    limpiarVacunasPrevias();
    const radAdulto = document.querySelector('input[name="cat_paciente"][value="adulto"]');
    if (radAdulto) radAdulto.checked = true;
    actualizarModoCategoria();
    cambiarVista('vista-inicio');
}

// Catálogo de vacunas previas comunes (PAI Venezuela y Esquemas Básicos)
const catalogoVacunasPrevias = [
    { id: 'bcg', nombre: 'BCG (Tuberculosis)', tipo: 'Bacteriana / PAI', dosisDef: 'Dosis Única (Recién Nacido)', dosisOpciones: ['Dosis Única (Recién Nacido)', 'Refuerzo'] },
    { id: 'hepb', nombre: 'Hepatitis B', tipo: 'Viral / PAI', dosisDef: '3ra Dosis (Fin Esquema)', dosisOpciones: ['1ra Dosis', '2da Dosis', '3ra Dosis (Fin Esquema)', 'Dosis Neonatal', 'Refuerzo'] },
    { id: 'polio', nombre: 'Polio (IPV / OPV)', tipo: 'Viral / PAI', dosisDef: 'Esquema Completo (3 Dosis)', dosisOpciones: ['1ra Dosis (IPV)', '2da Dosis (bOPV)', '3ra Dosis (bOPV)', 'Esquema Completo (3 Dosis)', '1er Refuerzo', '2do Refuerzo'] },
    { id: 'penta', nombre: 'Pentavalente (DTP-HB-Hib)', tipo: 'Combinada / PAI', dosisDef: 'Esquema Completo (3 Dosis)', dosisOpciones: ['1ra Dosis', '2da Dosis', '3ra Dosis', 'Esquema Completo (3 Dosis)', '1er Refuerzo (DTP)', '2do Refuerzo (DTP)'] },
    { id: 'fa', nombre: 'Fiebre Amarilla', tipo: 'Endémica / Sanidad', dosisDef: 'Dosis Única (0.5ml)', dosisOpciones: ['Dosis Única (0.5ml)', 'Refuerzo Internacional'] },
    { id: 'tt', nombre: 'Toxoide Tetánico Diftérico', tipo: 'Bacteriana / Adulto', dosisDef: 'Esquema Básico Adulto', dosisOpciones: ['1ra Dosis', '2da Dosis', '3ra Dosis', 'Esquema Básico Adulto', '1er Refuerzo', '2do Refuerzo'] },
    { id: 'covid', nombre: 'COVID-19', tipo: 'Inmunización Especial', dosisDef: '2da Dosis (Esquema Completo)', dosisOpciones: ['1ra Dosis', '2da Dosis (Esquema Completo)', '1er Refuerzo', '2do Refuerzo (Bivalente)'] },
    { id: 'influenza', nombre: 'Influenza Estacional', tipo: 'Viral / Anual', dosisDef: 'Cepa Anual Previa', dosisOpciones: ['Cepa Anual Previa', '1ra Dosis Pediátrica', '2da Dosis Pediátrica'] },
    { id: 'srp', nombre: 'SRP (Sarampión-Rubéola-Parotiditis)', tipo: 'Triple Viral / PAI', dosisDef: '1ra Dosis (1 Año)', dosisOpciones: ['1ra Dosis (1 Año)', '2da Dosis / Refuerzo (5 Años)', 'Esquema Completo'] },
    { id: 'rotavirus', nombre: 'Rotavirus', tipo: 'Pediátrica / PAI', dosisDef: '2da Dosis (Fin Esquema)', dosisOpciones: ['1ra Dosis', '2da Dosis (Fin Esquema)'] },
    { id: 'neumo', nombre: 'Neumococo Conjugada', tipo: 'Bacteriana / PAI', dosisDef: 'Esquema Pediátrico / Adulto', dosisOpciones: ['1ra Dosis', '2da Dosis', 'Refuerzo / Monodosis'] },
    { id: 'vph', nombre: 'VPH (Virus de Papiloma Humano)', tipo: 'Oncológica / PAI', dosisDef: 'Dosis Única / Esquema', dosisOpciones: ['1ra Dosis', '2da Dosis', 'Dosis Única / Esquema'] }
];

// Inicializar tarjetas del catálogo previo
function inicializarCatalogoPrevio() {
    const cont = document.getElementById('contenedor-vacunas-previas');
    if (!cont) return;
    cont.innerHTML = catalogoVacunasPrevias.map(vac => `
        <div class="card-vacuna-previa" id="card-previa-${vac.id}" style="border: 1.5px solid var(--border-color); border-radius: var(--radius-md); padding: 12px 14px; background: #f8fafc; transition: all 0.2s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 600; font-size: 0.9rem; color: var(--color-texto); flex: 1;">
                    <input type="checkbox" class="chk-vacuna-previa" value="${vac.nombre}" data-id="${vac.id}" onchange="toggleVacunaPrevia('${vac.id}')" style="width: 18px; height: 18px; accent-color: var(--color-primario); cursor: pointer;">
                    <span>${vac.nombre}</span>
                </label>
                <span style="font-size: 0.7rem; color: var(--color-texto-muted); background: #ffffff; border: 1px solid var(--border-color); padding: 2px 6px; border-radius: 4px; white-space: nowrap;">
                    ${vac.tipo}
                </span>
            </div>
            <div id="campos-previa-${vac.id}" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid #cbd5e1;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                        <label style="font-size: 0.72rem; font-weight: 700; color: var(--color-texto-secundario); display: block; margin-bottom: 2px;">Dosis Aplicada</label>
                        <select id="dosis-previa-${vac.id}" style="width: 100%; font-size: 0.8rem; padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border-color); background: #ffffff;">
                            ${vac.dosisOpciones.map(opt => `<option value="${opt}" ${opt === vac.dosisDef ? 'selected' : ''}>${opt}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label style="font-size: 0.72rem; font-weight: 700; color: var(--color-texto-secundario); display: block; margin-bottom: 2px;">Fecha / Año Aprox.</label>
                        <input type="date" id="fecha-previa-${vac.id}" style="width: 100%; font-size: 0.8rem; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--border-color); background: #ffffff;">
                    </div>
                    <div>
                        <label style="font-size: 0.72rem; font-weight: 700; color: var(--color-texto-secundario); display: block; margin-bottom: 2px;">Lote de Vacuna</label>
                        <input type="text" id="lote-previa-${vac.id}" value="HISTÓRICO-CARNET" placeholder="Ej: LOT-2023-A" class="font-mono" style="width: 100%; font-size: 0.8rem; padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border-color); background: #ffffff; font-weight: 600; color: var(--color-primario-oscuro);">
                    </div>
                    <div>
                        <label style="font-size: 0.72rem; font-weight: 700; color: var(--color-texto-secundario); display: block; margin-bottom: 2px;">Centro Emisor / Constancia</label>
                        <input type="text" id="centro-previa-${vac.id}" value="Carnet Físico Previo" placeholder="Centro o Municipio emisor" style="width: 100%; font-size: 0.8rem; padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border-color); background: #ffffff;">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Alternar tarjeta de vacuna previa al hacer clic en el checkbox
function toggleVacunaPrevia(id) {
    const chk = document.querySelector(`.chk-vacuna-previa[data-id="${id}"]`);
    const card = document.getElementById(`card-previa-${id}`);
    const campos = document.getElementById(`campos-previa-${id}`);
    if (!chk || !card || !campos) return;

    if (chk.checked) {
        card.style.borderColor = '#86efac';
        card.style.background = '#f0fdf4';
        card.style.boxShadow = '0 2px 6px rgba(34, 197, 94, 0.1)';
        campos.style.display = 'block';
    } else {
        card.style.borderColor = 'var(--border-color)';
        card.style.background = '#f8fafc';
        card.style.boxShadow = 'none';
        campos.style.display = 'none';
    }
    actualizarContadorPrevias();
}

// Actualizar contador visual de vacunas previas seleccionadas
function actualizarContadorPrevias() {
    const numCheck = document.querySelectorAll('.chk-vacuna-previa:checked').length;
    const numExtras = document.querySelectorAll('.fila-vacuna-extra').length;
    const total = numCheck + numExtras;
    const badge = document.getElementById('badge-contador-previas');
    if (badge) {
        badge.textContent = `${total} vacuna${total === 1 ? '' : 's'} previa${total === 1 ? '' : 's'} seleccionada${total === 1 ? '' : 's'}`;
        if (total > 0) {
            badge.style.background = '#86efac';
            badge.style.color = '#166534';
        } else {
            badge.style.background = 'var(--color-primario-claro)';
            badge.style.color = 'var(--color-primario-oscuro)';
        }
    }
}

// Agregar fila dinámica para una vacuna previa adicional personalizada
let contadorExtras = 0;
function agregarFilaVacunaExtra() {
    contadorExtras++;
    const cont = document.getElementById('contenedor-vacunas-extras');
    if (!cont) return;

    const div = document.createElement('div');
    div.className = 'fila-vacuna-extra';
    div.id = `fila-extra-${contadorExtras}`;
    div.style = 'border: 1.5px solid #86efac; background: #f0fdf4; border-radius: var(--radius-md); padding: 12px 14px; display: grid; grid-template-columns: 2fr 1.3fr 1.2fr 1.3fr 1.8fr auto; gap: 8px; align-items: end;';
    div.innerHTML = `
        <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #166534; display: block; margin-bottom: 2px;">Nombre de la Vacuna *</label>
            <input type="text" class="extra-nom" placeholder="Ej: Varicela, Rabia, Hepatitis A" style="width: 100%; font-size: 0.8rem; padding: 6px 8px; border-radius: 6px; border: 1px solid #86efac; background: #ffffff;" required>
        </div>
        <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #166534; display: block; margin-bottom: 2px;">Dosis Aplicada</label>
            <select class="extra-dos" style="width: 100%; font-size: 0.8rem; padding: 6px 8px; border-radius: 6px; border: 1px solid #86efac; background: #ffffff;">
                <option value="Dosis Única">Dosis Única</option>
                <option value="1ra Dosis">1ra Dosis</option>
                <option value="2da Dosis">2da Dosis</option>
                <option value="3ra Dosis">3ra Dosis</option>
                <option value="Refuerzo">Refuerzo</option>
                <option value="Esquema Completo">Esquema Completo</option>
            </select>
        </div>
        <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #166534; display: block; margin-bottom: 2px;">Fecha / Año Aprox.</label>
            <input type="date" class="extra-fec" style="width: 100%; font-size: 0.8rem; padding: 5px 8px; border-radius: 6px; border: 1px solid #86efac; background: #ffffff;">
        </div>
        <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #166534; display: block; margin-bottom: 2px;">Lote de Vacuna</label>
            <input type="text" class="extra-lot" value="HISTÓRICO-CARNET" placeholder="Ej: VAR-2023-A" style="width: 100%; font-size: 0.8rem; padding: 6px 8px; border-radius: 6px; border: 1px solid #86efac; background: #ffffff; font-family: var(--font-mono); font-weight: 600; color: var(--color-primario-oscuro);">
        </div>
        <div>
            <label style="font-size: 0.72rem; font-weight: 700; color: #166534; display: block; margin-bottom: 2px;">Centro Emisor</label>
            <input type="text" class="extra-cen" value="Carnet Físico Previo" style="width: 100%; font-size: 0.8rem; padding: 6px 8px; border-radius: 6px; border: 1px solid #86efac; background: #ffffff;">
        </div>
        <button type="button" onclick="eliminarFilaExtra('fila-extra-${contadorExtras}')" style="background: #fee2e2; border: 1px solid #fca5a5; color: #b91c1c; border-radius: 6px; height: 32px; width: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: bold;" title="Eliminar esta vacuna">
            ✕
        </button>
    `;
    cont.appendChild(div);
    actualizarContadorPrevias();
}

// Eliminar fila de vacuna extra
function eliminarFilaExtra(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
    actualizarContadorPrevias();
}

// Restablecer todas las selecciones de vacunas previas
function limpiarVacunasPrevias() {
    document.querySelectorAll('.chk-vacuna-previa').forEach(chk => {
        chk.checked = false;
        const id = chk.dataset.id;
        const card = document.getElementById(`card-previa-${id}`);
        const campos = document.getElementById(`campos-previa-${id}`);
        if (card) {
            card.style.borderColor = 'var(--border-color)';
            card.style.background = '#f8fafc';
            card.style.boxShadow = 'none';
        }
        if (campos) campos.style.display = 'none';
    });
    const contExtras = document.getElementById('contenedor-vacunas-extras');
    if (contExtras) contExtras.innerHTML = '';
    actualizarContadorPrevias();
}

// Alternar modo según categoría: si es menor de edad, se retira la restricción de cédula propia
function actualizarModoCategoria() {
    const cat = document.querySelector('input[name="cat_paciente"]:checked');
    const esNino = cat && cat.value === 'nino';
    const inpCedula = document.getElementById('inp-cedula');
    const lblCedula = document.getElementById('lbl-inp-cedula');
    const hintMenor = document.getElementById('hint-cedula-menor');
    const seccionRep = document.getElementById('seccion-representante');
    const lblTituloRep = document.getElementById('lbl-titulo-rep');
    const inpRepCedula = document.getElementById('inp-rep-cedula');
    const inpRepNombre = document.getElementById('inp-rep-nombre');

    if (esNino) {
        // En menor de edad: NO es obligatoria la cédula propia
        if (inpCedula) {
            inpCedula.removeAttribute('required');
            inpCedula.placeholder = 'Sin cédula (Bajo C.I. del representante)';
            // Si el campo de cédula del paciente tenía la cédula buscada (que es la del representante) y el representante está vacío, transferirla
            if (inpCedula.value && inpRepCedula && !inpRepCedula.value) {
                inpRepCedula.value = inpCedula.value;
                inpCedula.value = '';
            }
        }
        if (lblCedula) lblCedula.innerHTML = 'Cédula del Menor <span style="font-weight: 400; color: var(--color-texto-secundario); font-size: 0.8rem;">(Opcional - Solo si posee)</span>';
        if (hintMenor) hintMenor.style.display = 'block';
        if (seccionRep) {
            seccionRep.style.borderColor = '#16a34a';
            seccionRep.style.background = '#f0fdf4';
        }
        if (lblTituloRep) lblTituloRep.textContent = '2. Datos del Representante Legal (Obligatorio para Menores de Edad)';
        if (inpRepCedula) inpRepCedula.setAttribute('required', 'required');
        if (inpRepNombre) inpRepNombre.setAttribute('required', 'required');
    } else {
        // Adulto: cédula propia obligatoria
        if (inpCedula) {
            inpCedula.setAttribute('required', 'required');
            inpCedula.placeholder = 'Ej: 14223987';
            if (!inpCedula.value && inpRepCedula && inpRepCedula.value) {
                inpCedula.value = inpRepCedula.value;
            }
        }
        if (lblCedula) lblCedula.innerHTML = 'Cédula de Identidad *';
        if (hintMenor) hintMenor.style.display = 'none';
        if (seccionRep) {
            seccionRep.style.borderColor = '#86efac';
            seccionRep.style.background = '#f0fdf4';
        }
        if (lblTituloRep) lblTituloRep.textContent = '2. Datos del Representante Legal (Solo aplica para Menores de Edad)';
        if (inpRepCedula) inpRepCedula.removeAttribute('required');
        if (inpRepNombre) inpRepNombre.removeAttribute('required');
    }
}

// Renderizar dinámicamente la Tarjeta Oficial y Carnet del Paciente
function renderizarTarjeta(p) {
    document.getElementById('paciente-display-nombre').textContent = p.nombreCompleto;
    if (p.esNino && !p.tieneCedulaPropia) {
        document.getElementById('paciente-display-cedula').textContent = `Bajo C.I. Rep: ${p.repTipo || 'V'}-${p.repCedula || p.cedula}`;
    } else {
        document.getElementById('paciente-display-cedula').textContent = `${p.tipoCedula}-${p.cedula}`;
    }
    document.getElementById('paciente-display-avatar').textContent = p.iniciales;
    document.getElementById('paciente-display-categoria').textContent = p.categoria;
    document.getElementById('paciente-display-sexo').textContent = `Sexo: ${p.sexo}`;
    document.getElementById('paciente-display-telf').textContent = p.telefono || 'No registrado';
    document.getElementById('paciente-display-nac').textContent = p.fechaNac || 'No registrada';
    document.getElementById('paciente-display-ubicacion').textContent = p.ubicacion;
    document.getElementById('badge-total-dosis').textContent = `● ${p.vacunas.length} Dosis Registradas`;

    // Representante legal si aplica
    const boxRep = document.getElementById('box-representante');
    const displayRep = document.getElementById('paciente-display-rep');
    if (boxRep && displayRep) {
        if (p.repNombre) {
            boxRep.style.display = 'block';
            displayRep.textContent = `${p.repNombre} (${p.repParentesco || 'Representante'} - C.I. ${p.repTipo || 'V'}-${p.repCedula || ''})`;
        } else {
            boxRep.style.display = 'none';
        }
    }

    // Actualizar datos en el formulario de aplicación
    const vacNombre = document.getElementById('vacunar-display-nombre');
    if (vacNombre) vacNombre.textContent = p.nombreCompleto;
    const vacCed = document.getElementById('vacunar-display-cedula');
    if (vacCed) {
        vacCed.textContent = (p.esNino && !p.tieneCedulaPropia)
            ? `Bajo C.I. Rep: ${p.repTipo || 'V'}-${p.repCedula || p.cedula}`
            : `${p.tipoCedula}-${p.cedula}`;
    }

    const tbody = document.getElementById('tabla-carnet-body');
    if (!tbody) return;

    if (p.vacunas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 36px 20px; color: var(--color-texto-secundario);">
                    <div style="width: 44px; height: 44px; margin: 0 auto 10px; border-radius: 50%; background: var(--color-primario-claro); color: var(--color-primario); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                        📋
                    </div>
                    <strong style="font-size: 1rem; color: var(--color-texto); display: block; margin-bottom: 4px;">
                        El paciente no posee vacunas registradas en su carnet
                    </strong>
                    <p style="font-size: 0.85rem; margin-bottom: 14px;">
                        Utilice el botón superior para cargar y asentar su primera dosis administrada.
                    </p>
                    <button type="button" onclick="verAplicarVacuna()" class="btn-health btn-health-primary" style="padding: 8px 18px; border: none; font-size: 0.85rem; cursor: pointer;">
                        💉 Cargar Primera Vacuna
                    </button>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = p.vacunas.map((v, idx) => `
            <tr ${idx === 0 && v.esNueva ? 'style="background: #f0fdf4;"' : ''}>
                <td><strong style="color: var(--color-primario-oscuro);">${v.nombre}</strong></td>
                <td><span class="badge-dose-pill">${v.dosis}</span></td>
                <td class="font-mono">${v.fecha}</td>
                <td><span class="font-mono text-primary font-semibold">${v.lote}</span></td>
                <td>${v.centro}</td>
                <td>${v.enfermero}</td>
                <td><span class="health-status-chip chip-verified">● Verificado</span></td>
                <td class="text-right">
                    <a href="reportes.html?cedula=${p.cedula}&vacuna=${encodeURIComponent(v.nombre)}" class="btn-health btn-health-sm btn-health-outline" style="font-size: 0.72rem; padding: 4px 8px; color: #b91c1c; border-color: #fca5a5; text-decoration: none;" title="Registrar evento adverso o problema con esta dosis">
                        ⚠️ Reportar Problema
                    </a>
                </td>
            </tr>
        `).join('');
    }
}

// Búsqueda de paciente por cédula
function consultarPaciente() {
    const input = document.getElementById('input-cedula');
    const tipoDoc = document.getElementById('tipo-doc-select') ? document.getElementById('tipo-doc-select').value : 'V';
    const cedula = input ? input.value.trim().replace(/\D/g, '') : '';

    if (!cedula) {
        alert('Por favor ingrese un número de cédula para consultar.');
        if (input) input.focus();
        return;
    }

    // ¿ESTÁ REGISTRADO? -> SOLAMENTE SU TARJETA Y EL BOTÓN DE CARGAR VACUNA
    if (baseDatosPacientes[cedula]) {
        pacienteActivo = baseDatosPacientes[cedula];
        renderizarTarjeta(pacienteActivo);
        cambiarVista('vista-encontrado');
    }
    // ¿NO ESTÁ REGISTRADO? -> FORMULARIO DE REGISTRO
    else {
        document.getElementById('lbl-cedula-no-encontrada').textContent = `${tipoDoc}-${cedula}`;
        const inpCed = document.getElementById('inp-cedula');
        if (inpCed) inpCed.value = cedula;
        const selTipo = document.getElementById('inp-tipo-cedula');
        if (selTipo) selTipo.value = tipoDoc;

        const inpRepCed = document.getElementById('inp-rep-cedula');
        if (inpRepCed) inpRepCed.value = cedula;
        const selRepTipo = document.getElementById('sel-rep-tipo-cedula');
        if (selRepTipo) selRepTipo.value = tipoDoc;

        // Limpiar campos para nuevo ingreso
        document.getElementById('inp-nombres').value = '';
        document.getElementById('inp-apellidos').value = '';
        document.getElementById('inp-telefono').value = '';
        const inpRepNom = document.getElementById('inp-rep-nombre');
        if (inpRepNom) inpRepNom.value = '';

        // Restablecer selección de vacunas previas
        limpiarVacunasPrevias();

        // Asegurar sincronización con la categoría actual
        actualizarModoCategoria();

        cambiarVista('vista-no-encontrado');
    }
}

// Volver a la tarjeta activa
function verEncontrado() {
    if (pacienteActivo) {
        renderizarTarjeta(pacienteActivo);
    }
    cambiarVista('vista-encontrado');
}

// Mostrar formulario para cargar nueva dosis
function verAplicarVacuna() {
    if (pacienteActivo) {
        const vacNombre = document.getElementById('vacunar-display-nombre');
        if (vacNombre) vacNombre.textContent = pacienteActivo.nombreCompleto;
        const vacCed = document.getElementById('vacunar-display-cedula');
        if (vacCed) {
            vacCed.textContent = (pacienteActivo.esNino && !pacienteActivo.tieneCedulaPropia)
                ? `Bajo C.I. Rep: ${pacienteActivo.repTipo || 'V'}-${pacienteActivo.repCedula || pacienteActivo.cedula}`
                : `${pacienteActivo.tipoCedula}-${pacienteActivo.cedula}`;
        }
    }
    cambiarVista('vista-aplicar-vacuna');
}

// Guardar nuevo paciente con sus vacunas anteriores seleccionadas
function guardarNuevoPaciente() {
    const nombres = document.getElementById('inp-nombres').value.trim();
    const apellidos = document.getElementById('inp-apellidos').value.trim();
    const cedulaInput = document.getElementById('inp-cedula').value.trim().replace(/\D/g, '');
    const tipoDocInput = document.getElementById('inp-tipo-cedula') ? document.getElementById('inp-tipo-cedula').value : 'V';
    const telf = document.getElementById('inp-telefono').value.trim();
    const fechaNac = document.getElementById('inp-fecha-nac').value;
    const sexo = document.getElementById('inp-sexo').value;
    const municipio = document.getElementById('inp-municipio').value;

    const catSeleccionada = document.querySelector('input[name="cat_paciente"]:checked');
    const esNino = catSeleccionada && catSeleccionada.value === 'nino';

    const repCedula = document.getElementById('inp-rep-cedula') ? document.getElementById('inp-rep-cedula').value.trim().replace(/\D/g, '') : '';
    const repNombre = document.getElementById('inp-rep-nombre') ? document.getElementById('inp-rep-nombre').value.trim() : '';
    const repParentesco = document.getElementById('inp-rep-parentesco') ? document.getElementById('inp-rep-parentesco').value : 'Madre';
    const selRepTipo = document.getElementById('sel-rep-tipo-cedula');
    const repTipoDoc = selRepTipo ? selRepTipo.value : 'V';

    if (!nombres || !apellidos) {
        alert('Por favor complete los nombres y apellidos del paciente.');
        return;
    }

    // Identificación según categoría:
    // - Menor de edad: NO requiere cédula propia; se asocia a la cédula del representante legal
    // - Adulto: Requiere su cédula de identidad
    let cedulaRegistrada = '';
    let tipoDocRegistrado = 'V';
    let tieneCedulaPropia = false;

    if (esNino) {
        if (cedulaInput) {
            cedulaRegistrada = cedulaInput;
            tipoDocRegistrado = tipoDocInput;
            tieneCedulaPropia = true;
        } else if (repCedula) {
            cedulaRegistrada = repCedula;
            tipoDocRegistrado = repTipoDoc;
            tieneCedulaPropia = false;
        } else {
            alert('Para menores de edad sin cédula propia, debe indicar la cédula del representante legal.');
            const fRep = document.getElementById('inp-rep-cedula');
            if (fRep) fRep.focus();
            return;
        }
    } else {
        if (!cedulaInput) {
            alert('Por favor complete la cédula de identidad del paciente adulto.');
            const fCed = document.getElementById('inp-cedula');
            if (fCed) fCed.focus();
            return;
        }
        cedulaRegistrada = cedulaInput;
        tipoDocRegistrado = tipoDocInput;
        tieneCedulaPropia = true;
    }

    // 1. Recopilar vacunas del catálogo estándar seleccionadas
    const vacunasPrevias = [];
    document.querySelectorAll('.chk-vacuna-previa:checked').forEach(chk => {
        const id = chk.dataset.id;
        const nombre = chk.value;
        const dosisEl = document.getElementById(`dosis-previa-${id}`);
        const fechaEl = document.getElementById(`fecha-previa-${id}`);
        const loteEl = document.getElementById(`lote-previa-${id}`);
        const centroEl = document.getElementById(`centro-previa-${id}`);

        const dosis = dosisEl ? dosisEl.value : 'Dosis Certificada';
        const fecha = fechaEl && fechaEl.value ? fechaEl.value : 'Antecedente Previo';
        const lote = loteEl && loteEl.value.trim() ? loteEl.value.trim().toUpperCase() : 'HISTÓRICO-CARNET';
        const centro = centroEl && centroEl.value.trim() ? centroEl.value.trim() : 'Carnet Físico Previo';

        vacunasPrevias.push({
            nombre: nombre,
            dosis: dosis,
            fecha: fecha,
            lote: lote,
            centro: centro,
            enfermero: 'Validado en Admisión',
            estado: 'Certificada'
        });
    });

    // 2. Recopilar vacunas adicionales personalizadas
    document.querySelectorAll('.fila-vacuna-extra').forEach(fila => {
        const nomEl = fila.querySelector('.extra-nom');
        const dosEl = fila.querySelector('.extra-dos');
        const fecEl = fila.querySelector('.extra-fec');
        const lotEl = fila.querySelector('.extra-lot');
        const cenEl = fila.querySelector('.extra-cen');

        if (nomEl && nomEl.value.trim()) {
            vacunasPrevias.push({
                nombre: nomEl.value.trim(),
                dosis: dosEl ? dosEl.value : 'Dosis Única',
                fecha: fecEl && fecEl.value ? fecEl.value : 'Antecedente Previo',
                lote: lotEl && lotEl.value.trim() ? lotEl.value.trim().toUpperCase() : 'HISTÓRICO-CARNET',
                centro: cenEl && cenEl.value.trim() ? cenEl.value.trim() : 'Carnet Físico Previo',
                enfermero: 'Validado en Admisión',
                estado: 'Certificada'
            });
        }
    });

    // Crear ficha en el sistema con sus vacunas históricas y datos de filiación
    const nuevo = {
        tipoCedula: tipoDocRegistrado,
        cedula: cedulaRegistrada,
        tieneCedulaPropia: tieneCedulaPropia,
        esNino: esNino,
        repNombre: repNombre,
        repCedula: repCedula,
        repTipo: repTipoDoc,
        repParentesco: repParentesco,
        nombreCompleto: `${nombres} ${apellidos}`,
        iniciales: (nombres[0] || 'P').toUpperCase() + (apellidos[0] || 'N').toUpperCase(),
        categoria: esNino
            ? `Menor de Edad (Pediátrico - Bajo C.I. Rep: ${repTipoDoc}-${repCedula || cedulaRegistrada})`
            : 'Mayor de Edad',
        sexo: sexo || 'No especificado',
        telefono: telf || (repNombre ? `Rep: ${repNombre}` : 'Sin teléfono'),
        fechaNac: fechaNac || 'No registrada',
        ubicacion: municipio || 'San Juan de los Morros, Mcpio. Roscio',
        centro: 'Hospital Dr. Israel Ranuárez Balza',
        vacunas: vacunasPrevias
    };

    baseDatosPacientes[cedulaRegistrada] = nuevo;
    pacienteActivo = nuevo;

    // Actualizar la barra superior con la cédula del paciente o representante
    document.getElementById('input-cedula').value = cedulaRegistrada;

    // Renderizar su tarjeta final con las dosis históricas y mostrarla
    renderizarTarjeta(pacienteActivo);
    cambiarVista('vista-encontrado');

    const resumenDosis = vacunasPrevias.length > 0
        ? `\nSe han registrado ${vacunasPrevias.length} vacunas previas en su carnet oficial.`
        : '';
    const detalleIdent = (esNino && !tieneCedulaPropia)
        ? `asociado a la C.I. del representante ${repTipoDoc}-${repCedula}`
        : `(${nuevo.tipoCedula}-${nuevo.cedula})`;
    alert(`✅ Paciente ${nuevo.nombreCompleto} registrado exitosamente ${detalleIdent}.${resumenDosis}\n\nYa puede visualizar su carnet y hacer clic en "💉 Cargar Nueva Vacuna".`);
}

// Asentar la vacuna administrada y retornar a su Carnet
function asentarVacuna() {
    if (!pacienteActivo) return;

    const vacunaNombre = document.getElementById('vac-biologico').value;
    const vacunaDosis = document.getElementById('vac-dosis').value;
    const vacunaFecha = document.getElementById('vac-fecha').value;
    const vacunaLote = document.getElementById('vac-lote').value;
    const vacunaEnfermero = document.getElementById('vac-enfermero').value;

    if (!vacunaNombre || !vacunaLote) {
        alert('Por favor seleccione la vacuna e ingrese el número de lote del biológico.');
        return;
    }

    // Insertar la nueva vacuna al inicio del carnet del paciente
    pacienteActivo.vacunas.unshift({
        nombre: vacunaNombre,
        dosis: vacunaDosis,
        fecha: vacunaFecha,
        lote: vacunaLote,
        centro: 'Hospital Dr. Israel Ranuárez Balza',
        enfermero: vacunaEnfermero,
        esNueva: true
    });

    // Re-renderizar tarjeta con la nueva dosis cargada
    renderizarTarjeta(pacienteActivo);

    alert(`💉 ¡Vacuna ${vacunaNombre} (Lote: ${vacunaLote}) registrada con éxito en el Carnet Oficial del Paciente!`);

    // Regresar a la tarjeta del paciente
    cambiarVista('vista-encontrado');
}

// Renderizado inicial por si se carga con paciente por defecto
document.addEventListener('DOMContentLoaded', () => {
    inicializarCatalogoPrevio();
    actualizarModoCategoria();
    renderizarTarjeta(pacienteActivo);
});
