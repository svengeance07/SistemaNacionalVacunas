# SIV-NACIONAL // Sistema Nacional de Inmunizaciones y Salud Pública

Plataforma asistencial y de control epidemiológico para la gestión del **Programa Ampliado de Inmunizaciones (PAI)** en la **República Bolivariana de Venezuela (MPPS - SPNS)**, con el centro piloto **Hospital Dr. Israel Ranuárez Balza** (Subregión Guárico).

> **Este archivo es CONTEXTO PERMANENTE del proyecto.**
> Antes de incorporar cualquier cambio, vista o funcionalidad nueva, lea este documento completo y
> luego revise **[`PLAN.md`](./PLAN.md)** (checklist de avances y pendientes).
> Las vistas nuevas **deben** respetar el sistema de diseño y las convenciones aquí descritos.

---

## 📌 Estado Actual del Proyecto

| Aspecto | Estado |
|---|---|
| Fase actual | **Vistas + navegación básica entre páginas** (sin backend) |
| Capa M (Modelos / BD) | ❌ No implementada — datos simulados en el HTML |
| Capa C (Controladores / backend) | ❌ No implementada — la lógica vive inline en la UI |
| Capa V (Vistas) | ✅ En construcción activa |
| Autenticación | ⚠️ Simulada en el cliente (`PERFILES` en `vistas/login.html` + `SIV.centros` en `vistas/js/perfiles.js`) |
| Persistencia de centros/perfiles | ⚠️ `localStorage` (simulación temporal de la capa C) |

---

## 🏛️ Arquitectura MVC (Modelo - Vista - Controlador)

El proyecto está diseñado bajo el patrón arquitectónico **M.V.C.**:

* **Modelos (M)**: *Capa de Backend / Datos* (desacoplada; a integrar con la base de datos y lógica de negocio).
* **Vistas (V)**: *Capa de Presentación / Frontend* (**en desarrollo actual**). Compuesta por interfaces HTML5 semánticas, hojas de estilo CSS clínicas desacopladas y JavaScript **exclusivamente de presentación**.
* **Controladores (C)**: *Capa de Backend / Enrutamiento* (desacoplada; procesará las peticiones HTTP entre los modelos y las vistas).

> **Regla de oro:** el JavaScript que existe hoy (`vistas/js/ui.js`, `vistas/js/perfiles.js` y los
> `<script>` inline de cada vista) **NO contiene lógica de negocio ni habla con la base de datos**.
> Es UI pura: notificaciones, filtros, validaciones de formulario en el navegador y redirecciones.
> `perfiles.js` es un **almacén simulado** de centros/perfiles en `localStorage` que existe solo
> para poder recorrer el flujo sin backend; al llegar la capa **C** se sustituye por endpoints.

---

## 👥 Tipos de Usuario y Jerarquía

El sistema contempla **3 perfiles de usuario**, seleccionados en la pantalla de login mediante un
**triple switch** (segmented control):

| Tipo | Perfil | Nombre del perfil | Responsabilidad | Módulo de entrada |
|---|---|---|---|---|
| **1** | Administración General | `Administrador General` | Sede física administradora: da de alta **centros de salud** (cuenta tipo 2), audita acciones y entrega lotes de vacunas | `vistas/admin/index.html` |
| **2** | Control de Vacunación | `Control de Vacunación` | **Una cuenta por centro de salud**, compartida por su personal mediante **perfiles personales**; registra vacunas, pacientes e inventario, reporta ESAVI y recibe lotes del tipo 1 | `vistas/centro.html` |
| **3** | Control de Salud | `Control de Salud` | Vigilancia epidemiológica y control de cobertura | *Pendiente de definir (ver `PLAN.md`)* |

### Credenciales de demostración (hardcodeadas)

Vive en el objeto `PERFILES` de `vistas/login.html` y se muestra en la tarjeta fija de la
**esquina inferior derecha** de la pantalla de login.

| Tipo | Correo | Contraseña |
|---|---|---|
| 1 | `admin.general@sivguarico.ve` | `AdminGeneral2026!` |
| 2 | `control.vacunacion@sivguarico.ve` | `ControlVacunacion2026!` |
| 3 | `control.salud@sivguarico.ve` | `ControlSalud2026!` |

### Modelo de cuenta del tipo 2 (una cuenta por centro)

- El **tipo 1** da de alta el centro en `vistas/admin/usuarios-nuevos.html` con dos juegos de
  credenciales: la **cuenta del centro** (correo + contraseña institucional) y el **perfil base
  del jefe del centro**.
- Al iniciar sesión, el tipo 2 pasa por **dos pasos**: primero se valida la cuenta del centro y
  luego cada persona elige su **perfil** e ingresa con su **correo y contraseña personales**
  (como los perfiles de un servicio de streaming, pero con credenciales en vez de PIN).
- El **jefe del centro** administra los perfiles en `vistas/perfiles.html`: crea, habilita y
  deshabilita. Los **trabajadores no pueden crear perfiles** (ven la vista en solo lectura).
- Mientras no exista la capa C, estos datos viven en `localStorage` a través de
  `vistas/js/perfiles.js` (`SIV.centros`).

**Perfiles de la cuenta demo del centro** (`control.vacunacion@sivguarico.ve` /
`ControlVacunacion2026!`):

| Perfil | Rol | Correo personal | Contraseña |
|---|---|---|---|
| Dra. Yajaira Colmenares | Jefe del centro | `jefe.calabozo@sivguarico.ve` | `JefeCentro2026!` |
| Lic. Marlene Requena | Trabajadora | `marlene.requena@sivguarico.ve` | `Vacunacion2026!` |
| Enf. Jonathan Silva | Trabajador | `jonathan.silva@sivguarico.ve` | `Inmunizacion2026!` |

> La tarjeta de credenciales de la esquina inferior derecha del login está **plegada por
> defecto**; al desplegarla, un clic en cualquier credencial autocompleta el formulario
> (y en los perfiles del tipo 2 también selecciona el perfil correspondiente).

> Al fallar el inicio de sesión se muestra una **notificación flotante en la esquina superior derecha**
> (`SIV.toast`) que se descarta sola tras ~4,5 s.

---

## 📁 Estructura de Carpetas y Archivos

```text
SistemaNacionalVacunas/
│
├── index.html                   # Punto de acceso: redirige a vistas/login.html
├── README.md                    # ← ESTE ARCHIVO: contexto permanente del proyecto
├── PLAN.md                      # ← Checklist de planes, avances y pendientes
│
├── vistas/                      # Capa de VISTAS (Views) puras del sistema MVC
│   ├── login.html               # Acceso institucional (triple switch de tipo de usuario)
│   │
│   ├── centro.html              # [TIPO 2] Panel General / Sala Situacional del centro
│   ├── pacientes.html           # [TIPO 2] Consulta por cédula y registro de pacientes
│   ├── reportes.html            # [TIPO 2] Vigilancia epidemiológica y reporte ESAVI
│   ├── inventario.html          # [TIPO 2] Catálogo de Biológicos y Cadena de Frío
│   ├── personal.html            # [TIPO 2] Directorio de Personal de Enfermería y Brigadas
│   ├── perfiles.html            # [TIPO 2] Perfiles personales del centro (jefe del centro)
│   │
│   ├── admin/                   # Módulos del ADMINISTRADOR GENERAL (tipo 1)
│   │   ├── index.html           # Panel de Supervisión Institucional
│   │   ├── usuarios-nuevos.html # Alta de centro de salud (cuenta tipo 2 + perfil base del jefe)
│   │   ├── usuarios-activos.html# Registro de centros y cuentas activas
│   │   ├── auditoria.html       # Bitácora de cambios/acciones sobre los registros
│   │   └── lotes-entrega.html   # Registro de entrega de lotes de vacunación
│   │
│   ├── css/
│   │   └── centro.css           # Hoja de estilos clínica ÚNICA (paleta, tipografía, grid, responsivo)
│   │
│   └── js/
│       ├── ui.js                # Utilidades de UI compartidas (SIV.toast, sesión) — sin lógica de negocio
│       └── perfiles.js          # Almacén SIMULADO de centros/perfiles (localStorage) — sustituye a la capa C
```

---

## 🧭 Mapa de Navegación (rutas entre vistas)

```text
index.html
   └──► vistas/login.html
          ├── TIPO 1 ──► vistas/admin/index.html
          │                 ├── usuarios-nuevos.html
          │                 ├── usuarios-activos.html
          │                 ├── auditoria.html
          │                 └── lotes-entrega.html
          ├── TIPO 2 ──► vistas/centro.html
          │                 ├── pacientes.html
          │                 ├── reportes.html
          │                 ├── inventario.html
          │                 ├── personal.html
          │                 └── perfiles.html   (el jefe crea; el trabajador solo consulta)
          └── TIPO 3 ──► (pendiente de definir)
```

> **Regla de navegación:** cada tipo de usuario tiene **una sola barra lateral**. El tipo 1 no
> muestra enlaces a las vistas del tipo 2; la supervisión de la red se hace desde la tabla del
> panel, que ofrece los accesos de gestión sin cambiar de menú. Todas las barras cierran con el
> bloque de sesión y el botón **Cerrar sesión**.

---

## 🩺 Módulos de Vistas Disponibles (`vistas/`)

### 0. Acceso Institucional (`vistas/login.html`)
   - Panel izquierdo institucional con la identidad del programa (PUYASO-NACIONAL).
   - **Triple switch** de tipo de usuario (1 / 2 / 3) con tarjeta del perfil seleccionado.
   - Campos: correo institucional + contraseña, con mostrar/ocultar clave.
   - **Tipo 2 en dos pasos**: validación de la cuenta del centro → selección de perfil personal
     (`#paso-2`) → correo y contraseña propios del perfil.
   - Credenciales de prueba en tarjeta fija de la **esquina inferior derecha**, plegada por
     defecto; al desplegarla, un clic autocompleta el formulario.
   - Error de acceso → notificación flotante superior derecha con auto-cierre.

### 1. Panel General (`vistas/centro.html`) — *Tipo 2*
   - KPIs de jornada mensual y vigilancia de eventos adversos (ESAVI).
   - Tabla clínica de pacientes inmunizados con trazabilidad nacional (#VAC-…).
   - Accesos directos a registrar pacientes y reportar problemas de vacunas.
   - Barra lateral con los grupos *Operación del Centro* / *Cuenta del Centro* y sesión activa.

### 2. Atención de Pacientes (`vistas/pacientes.html`) — *Tipo 2*
   - Selector de categoría: adulto / niño(a) con búsqueda por cédula del representante.
   - Carnet individual con historial de dosis, lote, centro y enfermero(a).
   - Registro de nuevo paciente y carga de una nueva vacuna al carnet.

### 3. Reporte de Problemas / ESAVI (`vistas/reportes.html`) — *Tipo 2*
   - Búsqueda por cédula y resaltado de la última vacuna aplicada.
   - Clasificación de severidad (leve / moderado / grave) y nube de síntomas.
   - Ficha epidemiológica con identificador oficial (#REP-GUA-…), exportación e impresión.

### 4. Inventario de Biológicos (`vistas/inventario.html`) — *Tipo 2*
   - Catálogo de vacunas (Fiebre Amarilla, Pentavalente, BCG, Polio Oral, VPH, Toxoide).
   - Indicadores de temperatura de almacenamiento, días para caducidad y estado de stock.
   - Buscador rápido por nombre o lote de vacuna.

### 5. Directorio de Personal y Brigadas (`vistas/personal.html`) — *Tipo 2*
   - Fichas de enfermeros, enfermeras y coordinadores de campo.
   - Asignación territorial por ambulatorio, termos PQS y registro de dosis administradas.
   - Buscador por nombre, cargo o municipio.

### 6. Perfiles del Centro (`vistas/perfiles.html`) — *Tipo 2*
   - Tabla de perfiles personales de la cuenta del centro (avatar, cargo, rol, alta, estado).
   - El **jefe del centro** crea perfiles (nombre, cargo, correo y contraseña personales) y
     habilita/deshabilita a los existentes.
   - Un **trabajador** ve la misma tabla y un aviso de solo lectura, sin formulario de alta.

### 7. Panel de Supervisión Institucional (`vistas/admin/index.html`) — *Tipo 1*
   - KPIs de supervisión: cuentas y centros, lotes entregados, acciones auditadas, sedes vigiladas.
   - Panel segmentado en bloques verticales: **Red Asistencial bajo supervisión**, **Actividad
     reciente de la red** y **Logística de lotes**.
   - Tabla de la red con centro, municipio, cuenta tipo 2, cantidad de perfiles, último acceso y estado.

### 8. Alta de Centro de Salud (`vistas/admin/usuarios-nuevos.html`) — *Tipo 1*
   - Formulario en bloques: datos del centro, **cuenta del centro** (correo + contraseña) y
     **perfil base del jefe** (nombre, cargo, correo y contraseña personales).
   - Selección del municipio de adscripción y fecha de alta.
   - Al enviar, crea el centro en `SIV.centros` y añade la tarjeta a *Altas de la Sesión*.

### 9. Registro de Centros y Cuentas Activas (`vistas/admin/usuarios-activos.html`) — *Tipo 1*
   - KPIs de cuentas y centros habilitados, centros de salud, cuentas tipo 3 y claves expiradas.
   - Tabla con centro/cuenta, tipo, responsable y cantidad de perfiles, municipio, último acceso y estado.
   - Filtros combinables: buscador de texto, tipo de cuenta y estado.

### 10. Bitácora de Acciones (`vistas/admin/auditoria.html`) — *Tipo 1*
   - KPIs de creations / modificaciones / eliminaciones y trazabilidad del actor.
   - Tabla con fecha-hora, actor, rol, **tipo de acción**, entidad, registro, IP y resultado.
   - Filtros por tipo de acción (todas / creación / modificación / eliminación).
   - Línea de tiempo de los eventos más recientes.

### 11. Entrega de Lotes (`vistas/admin/lotes-entrega.html`) — *Tipo 1*
   - KPIs de despacho, dosis transferidas, entregas sin confirmar e incidencias de cadena de frío.
   - Formulario de despacho (**sede física tipo 1 → sede tipo 2**) con condición de traslado.
   - Tabla histórica con flujo de origen → destino y estado de recepción.

---

## 🎨 Sistema de Diseño (reglas de estilo obligatorias)

Todo el sistema se apoya en **una sola hoja de estilos** (`vistas/css/centro.css`), organizada
en secciones numeradas. **Reutilice las clases existentes; no genere duplicados.**

### Paleta (variables CSS en `:root`)

| Variable | Valor | Uso |
|---|---|---|
| `--color-primario` | `#0284c7` | Azul clínico / acciones primarias |
| `--color-primario-oscuro` | `#0369a1` | Hover de acciones primarias |
| `--color-primario-claro` | `#e0f2fe` | Fondos de badges y superficies suaves |
| `--color-primario-subtle` | `#f0f9ff` | Fondos muy suaves (hover de filas, chips) |
| `--salud-verde` | `#0d9488` | Estado óptimo / éxito |
| `--salud-azul` | `#2563eb` | Estado estable / informativo |
| `--salud-ambar` | `#d97706` | Precaución / advertencias |
| `--salud-rojo` | `#e11d48` | Alerta médica / crítico |
| `--salud-morado` | `#7c3aed` | Logística / administración |
| `--bg-app` | `#f8fafc` | Fondo general de la aplicación |
| `--border-color` | `#e2e8f0` | Bordes estándar |
| `--font-sans` | Inter | Tipografía principal |
| `--font-mono` | JetBrains Mono | Códigos, lotes, IPs, horas |

### Componentes reutilizables (NO duplicar, reutilizar)

| Grupo | Clases clave |
|---|---|
| Layout | `.health-layout`, `.health-sidebar`, `.health-sidebar-inner`, `.health-main-viewport` |
| Navegación | `.health-nav`, `.health-nav-list`, `.health-nav-item`, `.health-nav-link`, `.nav-group-label`, `.nav-tag-badge` |
| Marca / Perfil | `.sidebar-brand`, `.brand-cross-icon`, `.brand-text-block`, `.center-perfil-card`, `.center-avatar-circle` |
| Sesión / Salida | `.health-sidebar-inner`, `.sidebar-footer-block`, `.sidebar-session-card`, `.sidebar-session-avatar`, `.sidebar-session-name`, `.sidebar-shared-badge`, `.sidebar-logout` |
| Perfiles del centro | `.profile-identity-cell`, `.profile-identity-avatar`, `.profile-identity-name`, `.profile-identity-mail`, `.profile-role-chip`, `.profile-manage-banner`, `.profile-notice`, `.alta-sesion-item` |
| Acceso en dos pasos | `.auth-step`, `.auth-step-center`, `.auth-step-note`, `.profile-picker-grid`, `.profile-card`, `.profile-credentials-panel` |
| Cabecera | `.health-header`, `.health-breadcrumbs`, `.health-main-heading`, `.header-right-tools`, `.shift-time-indicator` |
| Botones | `.btn-health` + `.btn-health-primary` / `-outline` / `-danger` / `-block` |
| KPI | `.health-kpi-grid`, `.kpi-health-card`, `.kpi-category-badge`, `.kpi-badge-{blue,green,red,purple,amber}`, `.kpi-metric-number`, `.kpi-health-progress`, `.kpi-progress-bar`, `.bar-{blue,green,purple}` |
| Paneles | `.health-panel`, `.health-panel-header`, `.panel-title-with-icon`, `.panel-heading`, `.panel-subheading` |
| Tablas | `.health-table-panel`, `.health-table-container`, `.health-table`, `.health-table-footer`, `.pagination-controls`, `.pagination-btn` |
| Badges | `.badge-health-pill` + `.badge-optimal` / `.badge-warning` / `.badge-danger` / `.badge-stable` |
| Roles | `.role-chip` + `.role-chip-admin` / `.role-chip-vacunacion` / `.role-chip-salud` |
| Auditoría | `.audit-action` + `.audit-create` / `.audit-update` / `.audit-delete` / `.audit-read` |
| Formularios | `.input-group` (login legacy), `.admin-form-grid`, `.admin-form-field`, `.admin-input`, `.admin-select`, `.admin-textarea`, `.admin-hint`, `.admin-check-grid`, `.admin-check-item`, `.admin-form-actions` |
| Filtros | `.geo-filter-pills` + `.geo-filter-btn` (píldoras), `.health-search-box`, `.table-filter-bar` |
| Notificaciones | `.toast-stack`, `.toast-item` + `.toast-success` / `.toast-info`, `.toast-progress` |
| Utilidades | `.text-primary`, `.text-success`, `.text-danger`, `.text-warning`, `.text-muted`, `.text-right`, `.font-mono`, `.font-semibold`, `.icon-14/16/22` |

### Reglas de implementación

1. **Una sola hoja de estilos.** Todo CSS nuevo va en `vistas/css/centro.css`, dentro de una
   sección numerada y comentada. No cree archivos `*.css` adicionales salvo que se solicite.
2. **SVG inline.** Los iconos son SVG inline de trazo (`stroke="currentColor"`, `stroke-width="2"`),
   nunca imágenes ni fuentes de iconos externas.
3. **Rutas relativas.** Desde `vistas/` se enlaza `css/centro.css` y `js/ui.js`; desde `vistas/admin/`
   se enlaza `../css/centro.css` y `../js/ui.js`. Mantenga el CSS al **inicio** del `<head>`.
4. **Fuentes.** Solo `Inter` (texto) y `JetBrains Mono` (datos), cargadas con `preconnect` a Google Fonts.
5. **Encabezado y pie.** Toda vista del sistema repite el `.health-header` (con `.health-breadcrumbs`)
   y el `.health-footer` institucional con el ente rector y la versión.
6. **Tablas.** Siempre dentro de `.health-table-container` (permite scroll horizontal responsivo);
   encabezado en mayúsculas con `text-transform` aplicado por CSS.
7. **Notificaciones.** Para avisar al usuario use `SIV.toast(mensaje, tipo, duracion, titulo)`
   desde `vistas/js/ui.js`. No implemente su propio sistema de avisos.
8. **Datos simulados.** Use valores verosímiles del contexto del PAI en Guárico y márquelos
   visualmente como datos de demostración (los KPIs lo hacen con notas al pie).
9. **Idioma.** Toda la interfaz, comentarios y textos están en **español**.
10. **Responsividad.** Ninguna vista debe desbordar horizontalmente. Verifique sus cambios en
    1440 / 1280 / 1024 / 820 / 420 px: `document.documentElement.scrollWidth` debe ser igual a
    `clientWidth`. Las barras de filtro (`.table-filter-bar`) son filas flexibles con
    `flex-wrap: wrap`; el buscador (`.health-search-box`) usa `flex: 1 1 auto` con
    `min-width: 250px`, y los `<select>` de filtro (`.admin-select`) se dimensionan por su
    contenido (`width: auto`), nunca al 100 % del panel. Por debajo de 640 px la barra pasa a
    columna y todos sus controles ocupan el ancho completo. Los estilos en línea
    (`style="min-width:…"`) están prohibidos: los anchos de referencia van por identificador
    en la sección **18.1** del CSS.
11. **Un menú por tipo de usuario.** La barra lateral del tipo 1 **no** incluye enlaces a las
    vistas del tipo 2 (ni viceversa). Cada tipo conserva su propio grupo de navegación; los
    accesos de supervisión se resuelven con botones dentro del contenido, no cambiando el menú.
12. **Sesión visible y cerrable.** Toda barra lateral termina en `.sidebar-footer-block`
    (sesión activa) y un botón `[data-siv-logout]`. En el tipo 1 se muestra el rol compartido
    («Administrador General» + «Cuenta compartida»), nunca un nombre personal. Las vistas cargan
    `js/ui.js` y llaman a `SIV.enlazarCierreSesion()`.
13. **Perfiles del tipo 2.** Una cuenta por centro de salud; cada persona usa un perfil con
    correo y contraseña propios. Solo el **jefe** crea perfiles. Las vistas del tipo 2 leen la
    sesión con `SIV.centros.sesion()` y, si no existe, muestran un estado neutro que permite
    navegar la interfaz (nunca un error).

---

## 🧭 Guía de navegación entre vistas (comportamiento esperado)

* Cada enlace del menú lateral es un `<a href="...html">` real: la navegación funciona con el
  archivo abierto en el navegador (sin servidor).
* La vista activa se marca con `class="active"` en su `<li class="health-nav-item">`.
* Los botones "de acción" que aún no tienen backend deben **responder con una notificación**
  (`SIV.toast(..., 'info')`) explicando que la función estará disponible al conectar la capa C.
* Los formularios de la fase actual validan en el cliente y, al enviar, agregan la fila a la
  tabla o al almacén simulado (`SIV.centros`) y muestran una notificación de éxito.

---

## ✅ Checklist antes de dar por terminado un cambio

- [ ] La vista usa **solo** clases ya existentes en `vistas/css/centro.css` (o añade las nuevas al final, en su sección).
- [ ] La vista tiene `<head>` con `charset`, `viewport`, fuentes, `css/centro.css` y título descriptivo.
- [ ] La vista tiene barra lateral (si aplica), `.health-header` con `.health-breadcrumbs` y `.health-footer`.
- [ ] Cada tipo de usuario conserva **una sola** barra lateral (sin enlaces cruzados tipo 1 ↔ tipo 2).
- [ ] La barra lateral termina en `.sidebar-footer-block` con la sesión y un `[data-siv-logout]`.
- [ ] Las vistas del tipo 2 cargan `js/perfiles.js` y leen la sesión con `SIV.centros.sesion()`.
- [ ] Los enlaces del menú lateral apuntan a archivos que **existen** y usan rutas relativas correctas.
- [ ] Las rutas de `css/centro.css` y `js/ui.js` son correctas respecto a la profundidad de la carpeta.
- [ ] No se introduce lógica de negocio ni llamadas a base de datos en el JavaScript del cliente.
- [ ] Los textos están en español, sin caracteres corruptos ni placeholders olvidados.
- [ ] La vista **no desborda horizontalmente** en 1440 / 1280 / 1024 / 820 / 420 px.
- [ ] `README.md` se actualizó (estructura, rutas o nuevos módulos).
- [ ] `PLAN.md` se actualizó (marcando el ítem como hecho y anotando pendientes).

---

## 📎 Referencias

* **Plan de trabajo y pendientes:** [`PLAN.md`](./PLAN.md)
* **Vistas nacionales del tipo 2:** `vistas/centro.html`, `vistas/pacientes.html` y `vistas/reportes.html`
* **Estilos clínicos:** `vistas/css/centro.css`
* **Utilidades de interfaz:** `vistas/js/ui.js`
* **Almacén simulado de centros/perfiles:** `vistas/js/perfiles.js`
