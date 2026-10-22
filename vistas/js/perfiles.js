/* ==========================================================================
   SIV-GUÁRICO // Almacén simulado de centros y perfiles (tipo 2)
   --------------------------------------------------------------------------
   MODELO DE NEGOCIO SIMULADO que sustituye, por ahora, a la capa de datos:

   · El sistema tiene UNA CUENTA por CENTRO DE SALUD (tipo 2). Esa cuenta la
     crea el Administrador General (tipo 1) y la usan varias personas.
   · Cada persona que usa la cuenta tiene un PERFIL PROPIO con correo y
     contraseña personales (equivalente a los perfiles de Netflix, pero en vez
     de un PIN se pide correo + contraseña).
   · El primer perfil de la cuenta es siempre el del JEFE DEL CENTRO, creado
     por el tipo 1. Sólo el jefe puede crear perfiles adicionales.

   Los datos se guardan en `localStorage` para que el flujo recorra varias
   páginas sin servidor. Cuando exista la capa C (Controladores) este archivo
   se sustituye por llamadas a endpoints y deja de ser un almacén local.
   ========================================================================== */
(function (window, document) {
    'use strict';

    var SIV = window.SIV = window.SIV || {};

    var CLAVE_CENTROS = 'siv-guarico.centros.v1';
    var CLAVE_SESION = 'siv-guarico.sesion.v1';

    /* ------------------------------------------------------------------
       Datos iniciales: la cuenta de centro de demostración ya existe con
       su perfil base de jefe (creado por el master tipo 1) y dos perfiles
       de trabajadores.
       ------------------------------------------------------------------ */
    var CENTROS_INICIALES = {
        'control.vacunacion@sivguarico.ve': {
            id: 'CTR-CAL-01',
            centro: 'Ambulatorio Tipo II Calabozo Centro',
            municipio: 'Francisco de Miranda',
            claveCuenta: 'ControlVacunacion2026!',
            creado: '12/03/2026',
            ultimoAcceso: '22/10/2026 08:14',
            estado: 'activo',
            perfiles: [
                {
                    id: 'PER-CAL-01',
                    nombre: 'Dra. Yajaira Colmenares',
                    cargo: 'Jefe de Centro de Salud',
                    correo: 'jefe.calabozo@sivguarico.ve',
                    clave: 'JefeCentro2026!',
                    rol: 'jefe',
                    estado: 'activo',
                    creado: '12/03/2026'
                },
                {
                    id: 'PER-CAL-02',
                    nombre: 'Lic. Marlene Requena',
                    cargo: 'Enfermera(o) de inmunización',
                    correo: 'marlene.requena@sivguarico.ve',
                    clave: 'Vacunacion2026!',
                    rol: 'trabajador',
                    estado: 'activo',
                    creado: '04/05/2026'
                },
                {
                    id: 'PER-CAL-03',
                    nombre: 'Enf. Jonathan Silva',
                    cargo: 'Auxiliar de inmunización',
                    correo: 'jonathan.silva@sivguarico.ve',
                    clave: 'Inmunizacion2026!',
                    rol: 'trabajador',
                    estado: 'activo',
                    creado: '19/07/2026'
                }
            ]
        }
    };

    /* ------------------------------------------------------------------
       Acceso al almacén (con respaldo en memoria si localStorage falla)
       ------------------------------------------------------------------ */
    var memoria = {};

    function leerBruto(clave) {
        try {
            return window.localStorage.getItem(clave);
        } catch (e) {
            return Object.prototype.hasOwnProperty.call(memoria, clave) ? memoria[clave] : null;
        }
    }

    function escribirBruto(clave, valor) {
        memoria[clave] = valor;
        try {
            window.localStorage.setItem(clave, valor);
        } catch (e) {
            /* sin persistencia entre páginas: se conserva solo en memoria */
        }
    }

    function leerCentros() {
        var crudo = leerBruto(CLAVE_CENTROS);
        if (!crudo) {
            escribirBruto(CLAVE_CENTROS, JSON.stringify(CENTROS_INICIALES));
            return JSON.parse(JSON.stringify(CENTROS_INICIALES));
        }
        try {
            return JSON.parse(crudo);
        } catch (e) {
            return JSON.parse(JSON.stringify(CENTROS_INICIALES));
        }
    }

    function guardarCentros(centros) {
        escribirBruto(CLAVE_CENTROS, JSON.stringify(centros));
    }

    function ahora() {
        var d = new Date();
        var mes = String(d.getMonth() + 1).padStart(2, '0');
        var dia = String(d.getDate()).padStart(2, '0');
        return dia + '/' + mes + '/' + d.getFullYear();
    }

    function iniciales(nombre) {
        return String(nombre || '').trim().split(/\s+/).slice(0, 2).map(function (parte) {
            return parte.charAt(0).toUpperCase();
        }).join('') || '—';
    }

    /* ==================================================================
       API PÚBLICA
       ================================================================== */
    var centros = SIV.centros = {

        /* --- Consulta de centros (tipo 2) --- */
        listar: function () {
            var datos = leerCentros();
            return Object.keys(datos).map(function (correo) {
                var centro = datos[correo];
                centro.correoCuenta = correo;
                centro.totalPerfiles = centro.perfiles.length;
                return centro;
            });
        },

        obtener: function (correoCuenta) {
            var datos = leerCentros();
            var clave = String(correoCuenta || '').trim().toLowerCase();
            if (!Object.prototype.hasOwnProperty.call(datos, clave)) { return null; }

            var centro = datos[clave];
            centro.correoCuenta = clave;
            centro.totalPerfiles = centro.perfiles.length;
            return centro;
        },

        /* --- Validación de la CUENTA del centro (primer paso del acceso) --- */
        validarCuenta: function (correo, clave) {
            var centro = this.obtener(correo);
            if (!centro) { return null; }
            if (String(centro.claveCuenta) !== String(clave)) { return null; }
            return centro;
        },

        /* --- Listado de perfiles de un centro --- */
        perfiles: function (correoCuenta) {
            var centro = this.obtener(correoCuenta);
            return centro ? centro.perfiles : [];
        },

        /* --- Validación del PERFIL personal (segundo paso del acceso) --- */
        validarPerfil: function (correoCuenta, correoPerfil, clave) {
            var centro = this.obtener(correoCuenta);
            if (!centro) { return null; }
            var correo = String(correoPerfil || '').trim().toLowerCase();
            for (var i = 0; i < centro.perfiles.length; i++) {
                var perfil = centro.perfiles[i];
                if (perfil.correo.toLowerCase() === correo) {
                    if (perfil.estado !== 'activo') { return null; }
                    if (String(perfil.clave) !== String(clave)) { return null; }
                    return perfil;
                }
            }
            return null;
        },

        /* --- Alta de una cuenta de centro (lo hace el master tipo 1) --- */
        crearCentro: function (datos) {
            var centrosActuales = leerCentros();
            var correo = String(datos.correoCuenta || '').trim().toLowerCase();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                return { ok: false, error: 'El correo de la cuenta del centro no tiene un formato válido.' };
            }
            if (Object.prototype.hasOwnProperty.call(centrosActuales, correo)) {
                return { ok: false, error: 'Ya existe una cuenta activa con ese correo de centro.' };
            }
            if (!String(datos.claveCuenta || '').trim() || String(datos.claveCuenta).trim().length < 8) {
                return { ok: false, error: 'La contraseña de la cuenta del centro debe tener 8 caracteres o más.' };
            }

            var nombreJefe = String(datos.nombreJefe || '').trim();
            var correoJefe = String(datos.correoJefe || '').trim().toLowerCase();
            var claveJefe = String(datos.claveJefe || '').trim();

            if (!nombreJefe) {
                return { ok: false, error: 'Indique el nombre completo del jefe del centro.' };
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoJefe)) {
                return { ok: false, error: 'El correo personal del jefe no tiene un formato válido.' };
            }
            if (claveJefe.length < 8) {
                return { ok: false, error: 'La contraseña personal del jefe debe tener 8 caracteres o más.' };
            }
            if (correoJefe === correo) {
                return { ok: false, error: 'El correo del jefe debe ser distinto del correo de la cuenta del centro.' };
            }

            centrosActuales[correo] = {
                id: datos.id || ('CTR-NUE-' + Math.floor(Math.random() * 900 + 100)),
                centro: String(datos.centro || '').trim(),
                municipio: String(datos.municipio || '').trim(),
                claveCuenta: String(datos.claveCuenta).trim(),
                creado: String(datos.creado || '').trim() || ahora(),
                ultimoAcceso: '—',
                estado: 'activo',
                perfiles: [
                    {
                        id: 'PER-NUE-01',
                        nombre: nombreJefe,
                        cargo: String(datos.cargoJefe || 'Jefe de Centro de Salud').trim(),
                        cedula: String(datos.cedulaJefe || '').trim(),
                        correo: correoJefe,
                        clave: claveJefe,
                        rol: 'jefe',
                        estado: 'activo',
                        creado: ahora()
                    }
                ]
            };

            guardarCentros(centrosActuales);

            var creado = centrosActuales[correo];
            creado.correoCuenta = correo;
            creado.totalPerfiles = creado.perfiles.length;
            return { ok: true, centro: creado };
        },

        /* --- Alta de un perfil de trabajador (sólo el jefe del centro) --- */
        crearPerfil: function (correoCuenta, datos) {
            var centrosActuales = leerCentros();
            var clave = String(correoCuenta || '').trim().toLowerCase();
            var centro = centrosActuales[clave];

            if (!centro) {
                return { ok: false, error: 'No se encontró la cuenta del centro.' };
            }

            var correo = String(datos.correo || '').trim().toLowerCase();
            var nombre = String(datos.nombre || '').trim();

            if (!nombre) { return { ok: false, error: 'Indique el nombre completo de la persona.' }; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
                return { ok: false, error: 'El correo personal no tiene un formato válido.' };
            }
            if (!String(datos.clave || '').trim() || String(datos.clave).trim().length < 8) {
                return { ok: false, error: 'La contraseña personal debe tener 8 caracteres o más.' };
            }

            for (var i = 0; i < centro.perfiles.length; i++) {
                if (centro.perfiles[i].correo.toLowerCase() === correo) {
                    return { ok: false, error: 'Ese correo personal ya está registrado en este centro.' };
                }
            }

            var perfil = {
                id: 'PER-NUE-' + String(centro.perfiles.length + 1).padStart(2, '0'),
                nombre: nombre,
                cargo: String(datos.cargo || 'Enfermera(o) de inmunización').trim(),
                correo: correo,
                clave: String(datos.clave).trim(),
                rol: 'trabajador',
                estado: 'activo',
                creado: ahora()
            };

            centro.perfiles.push(perfil);
            guardarCentros(centrosActuales);

            return { ok: true, perfil: perfil };
        },

        /* --- Cambio de estado de un perfil (habilitar / deshabilitar) --- */
        cambiarEstadoPerfil: function (correoCuenta, idPerfil) {
            var centrosActuales = leerCentros();
            var clave = String(correoCuenta || '').trim().toLowerCase();
            var centro = centrosActuales[clave];
            if (!centro) { return { ok: false, error: 'No se encontró la cuenta del centro.' }; }

            for (var i = 0; i < centro.perfiles.length; i++) {
                if (centro.perfiles[i].id === idPerfil) {
                    var perfil = centro.perfiles[i];
                    if (perfil.rol === 'jefe') {
                        return { ok: false, error: 'El perfil del jefe del centro no puede deshabilitarse.' };
                    }
                    perfil.estado = perfil.estado === 'activo' ? 'inactivo' : 'activo';
                    guardarCentros(centrosActuales);
                    return { ok: true, perfil: perfil };
                }
            }
            return { ok: false, error: 'No se encontró el perfil indicado.' };
        },

        /* --- Utilidades --- */
        iniciales: iniciales,

        /* ==================================================================
           SESIÓN (tipo 2): la persona que inició sesión dentro de la cuenta
           del centro. Se guarda en `localStorage` para que las vistas la
           lean al cargar.
           ================================================================== */
        sesion: function () {
            var crudo = leerBruto(CLAVE_SESION);
            if (!crudo) { return null; }
            try {
                return JSON.parse(crudo);
            } catch (e) {
                return null;
            }
        },

        iniciarSesion: function (centro, perfil) {
            var datos = {
                tipo: '2',
                correoCuenta: centro.correoCuenta || centro.correo,
                centro: centro.centro,
                municipio: centro.municipio,
                idPerfil: perfil.id,
                nombre: perfil.nombre,
                cargo: perfil.cargo,
                correo: perfil.correo,
                rol: perfil.rol,
                esJefe: perfil.rol === 'jefe',
                iniciales: iniciales(perfil.nombre)
            };
            escribirBruto(CLAVE_SESION, JSON.stringify(datos));

            var centrosActuales = leerCentros();
            var clave = String(datos.correoCuenta).toLowerCase();
            if (centrosActuales[clave]) {
                var d = new Date();
                var hh = String(d.getHours()).padStart(2, '0');
                var mm = String(d.getMinutes()).padStart(2, '0');
                centrosActuales[clave].ultimoAcceso = ahora() + ' ' + hh + ':' + mm;
                guardarCentros(centrosActuales);
            }

            return datos;
        },

        cerrarSesion: function () {
            try {
                window.localStorage.removeItem(CLAVE_SESION);
            } catch (e) {
                delete memoria[CLAVE_SESION];
            }
        }
    };

})(window, document);
