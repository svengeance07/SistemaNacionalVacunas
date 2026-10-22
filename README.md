# SIV-GUÁRICO // Sistema Integrado de Vacunación y Salud Pública

Plataforma asistencial y de control epidemiológico para la gestión del **Programa Ampliado de Inmunizaciones (PAI)** en la Subregión Guárico.

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
| Autenticación | ⚠️ Simulada en el cliente (credenciales hardcodeadas en `vistas/login.html`) |

---

## 🏛️ Arquitectura MVC (Modelo - Vista - Controlador)

El proyecto está diseñado bajo el patrón arquitectónico **M.V.C.**:

* **Modelos (M)**: *Capa de Backend / Datos* (desacoplada; a integrar con la base de datos y lógica de negocio).
* **Vistas (V)**: *Capa de Presentación / Frontend* (**en desarrollo actual**). Compuesta por interfaces HTML5 semánticas, hojas de estilo CSS clínicas desacopladas y JavaScript **exclusivamente de presentación**.
* **Controladores (C)**: *Capa de Backend / Enrutamiento* (desacoplada; procesará las peticiones HTTP entre los modelos y las vistas).

> **Regla de oro:** el JavaScript que existe hoy (`vistas/js/ui.js` y los `<script>` inline de cada vista)
> **NO contiene lógica de negocio ni habla con la base de datos**. Es UI pura: notificaciones, filtros,
> validaciones de formulario en el navegador y redirecciones. Cuando llegue el backend, esta lógica
> se traslada a la capa **C** y las vistas solo consumirán endpoints.

---

## 👥 Tipos de Usuario y Jerarquía

El sistema contempla **3 perfiles de usuario**, seleccionados en la pantalla de login mediante un
**triple switch** (segmented control):

| Tipo | Perfil | Nombre del perfil | Responsabilidad | Módulo de entrada |
|---|---|---|---|---|
| **1** | Administración General | `Administrador General` | Sede física administradora: crea usuarios tipo 2, audita acciones y entrega lotes de vacunas | `vistas/admin/index.html` |
| **2** | Control de Vacunación | `Control de Vacunación` | Registro de vacunas, pacientes e inventario en su sede; **recibe lotes** de la sede física tipo 1 | `vistas/centro.html` |
| **3** | Control de Salud | `Control de Salud` | Vigilancia epidemiológica y control de cobertura | *Pendiente de definir (ver `PLAN.md`)* |

### Credenciales de demostración (hardcodeadas)

Vive en el objeto `PERFILES` de `vistas/login.html` y se muestra en la tarjeta fija de la
**esquina inferior derecha** de la pantalla de login.

| Tipo | Correo | Contraseña |
|---|---|---|
| 1 | `admin.general@sivguarico.ve` | `AdminGeneral2026!` |
| 2 | `control.vacunacion@sivguarico.ve` | `ControlVacunacion2026!` |
| 3 | `control.salud@sivguarico.ve` | `ControlSalud2026!` |

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
│   ├── centro.html              # [TIPO 2] Sala Situacional / Panel General de Inmunización
│   ├── inventario.html          # [TIPO 2] Catálogo de Biológicos y Cadena de Frío
│   ├── personal.html            # [TIPO 2] Directorio de Personal de Enfermería y Brigadas
│   │
│   ├── admin/                   # Módulos del ADMINISTRADOR GENERAL (tipo 1)
│   │   ├── index.html           # Panel de Supervisión Institucional
│   │   ├── usuarios-nuevos.html # Alta de usuario tipo 2 (Control de Vacunación)
│   │   ├── usuarios-activos.html# Registro de usuarios activos de la plataforma
│   │   ├── auditoria.html       # Bitácora de cambios/acciones sobre los registros
│   │   └── lotes-entrega.html   # Registro de entrega de lotes de vacunación
│   │
│   ├── css/
│   │   └── centro.css           # Hoja de estilos clínica ÚNICA (paleta, tipografía, grid, responsivo)
│   │
│   ├── js/
│   │   └── ui.js                # Utilidades de UI compartidas (SIV.toast, etc.) — sin lógica de negocio
│   │
│   └── img/
│       └── mapa_guarico.png     # Silueta cartográfica oficial del estado Guárico
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
          │                 ├── inventario.html
          │                 └── personal.html
          └── TIPO 3 ──► (pendiente de definir)
```

La barra lateral del administrador (`vistas/admin/*.html`) incluye además enlaces a los
**Módulos Operativos** (`../centro.html`, `../inventario.html`, `../personal.html`) para que
el tipo 1 supervise la operación de la red.

---

## 🩺 Módulos de Vistas Disponibles (`vistas/`)

### 0. Acceso Institucional (`vistas/login.html`)
   - Panel izquierdo institucional con la identidad del programa (PUYASO-GUÁRICO).
   - **Triple switch** de tipo de usuario (1 / 2 / 3) con tarjeta del perfil seleccionado.
   - Campos: correo institucional + contraseña, con mostrar/ocultar clave.
   - Credenciales de prueba en tarjeta fija de la **esquina inferior derecha** (plegable, clic para autocompletar).
   - Error de acceso → notificación flotante superior derecha con auto-cierre.

### 1. Sala Situacional (`vistas/centro.html`) — *Tipo 2*
   - Tarjetas KPI: dosis aplicadas, alertas de lotes, cobertura poblacional.
   - Mapa y distribución sanitaria por municipios (Roscio, Miranda, Infante, Zaraza, Ribas).
   - Monitoreo de cadena de frío (+3.8 °C, +7.8 °C) y lotes con riesgo de caducidad.
   - Tabla de pacientes inmunizados con buscador en tiempo real.

### 2. Inventario de Biológicos (`vistas/inventario.html`) — *Tipo 2*
   - Catálogo de vacunas (Fiebre Amarilla, Pentavalente, BCG, Polio Oral, VPH, Toxoide).
   - Indicadores de temperatura de almacenamiento, días para caducidad y estado de stock.
   - Buscador rápido por nombre o lote de vacuna.

### 3. Directorio de Personal y Brigadas (`vistas/personal.html`) — *Tipo 2*
   - Fichas de enfermeros, enfermeras y coordinadores de campo.
   - Asignación territorial por ambulatorio, termos PQS y registro de dosis administradas.
   - Buscador por nombre, cargo o municipio.

### 4. Panel de Supervisión Institucional (`vistas/admin/index.html`) — *Tipo 1*
   - KPIs de supervisión: cuentas activas, lotes entregados, acciones auditadas, sedes bajo vigilancia.
   - Tabla de **actividad reciente de la red** (creación / modificación / eliminación por usuario).
   - Panel lateral con el **estado de la logística de lotes** (origen → destino, termografías).

### 5. Alta de Usuario Tipo 2 (`vistas/admin/usuarios-nuevos.html`) — *Tipo 1*
   - Formulario en 4 bloques: identificación, credenciales, asignación territorial y alcance operativo.
   - Selección obligatoria de la **sede física receptora de lotes** (de la que el usuario es responsable).
   - Casillas de permisos por módulo + tabla de altas de la sesión.

### 6. Registro de Usuarios Activos (`vistas/admin/usuarios-activos.html`) — *Tipo 1*
   - KPIs por tipo de usuario y cuentas con clave expirada.
   - Tabla con ID de cuenta, correo, rol, sede, municipio, último acceso y estado.
   - Filtros combinables: buscador de texto, rol y estado.

### 7. Bitácora de Acciones (`vistas/admin/auditoria.html`) — *Tipo 1*
   - KPIs de creations / modificaciones / eliminaciones y trazabilidad del actor.
   - Tabla con fecha-hora, actor, rol, **tipo de acción**, entidad, registro, IP y resultado.
   - Filtros por tipo de acción (todas / creación / modificación / eliminación).
   - Línea de tiempo de los eventos más recientes.

### 8. Entrega de Lotes (`vistas/admin/lotes-entrega.html`) — *Tipo 1*
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

---

## 🧭 Guía de navegación entre vistas (comportamiento esperado)

* Cada enlace del menú lateral es un `<a href="...html">` real: la navegación funciona con el
  archivo abierto en el navegador (sin servidor).
* La vista activa se marca con `class="active"` en su `<li class="health-nav-item">`.
* Los botones "de acción" que aún no tienen backend deben **responder con una notificación**
  (`SIV.toast(..., 'info')`) explicando que la función estará disponible al conectar la capa C.
* Los formularios de la fase actual validan en el cliente y, al enviar, agregan la fila a la
  tabla en memoria y muestran una notificación de éxito.

---

## ✅ Checklist antes de dar por terminado un cambio

- [ ] La vista usa **solo** clases ya existentes en `vistas/css/centro.css` (o añade las nuevas al final, en su sección).
- [ ] La vista tiene `<head>` con `charset`, `viewport`, fuentes, `css/centro.css` y título descriptivo.
- [ ] La vista tiene barra lateral (si aplica), `.health-header` con `.health-breadcrumbs` y `.health-footer`.
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
* **Mapa cartográfico:** `vistas/img/mapa_guarico.png`
* **Estilos clínicos:** `vistas/css/centro.css`
* **Utilidades de interfaz:** `vistas/js/ui.js`
