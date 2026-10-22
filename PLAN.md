# PLAN.md // Hoja de Ruta y Control de Avances

> **Archivo obligatorio de seguimiento.** Cada vez que el usuario solicite un cambio o una nueva
> funcionalidad, se registra aquí como un ítem del plan, se marca como `[ ]` (pendiente) y se va
> moviendo a `[x]` (hecho) conforme se implemente.
>
> Conviene leer este archivo **antes** de empezar a trabajar y actualizarlo **después** de terminar.

**Leyenda:** `[x]` Hecho · `[~]` En progreso · `[ ]` Pendiente · `[-]` Descartado / fuera de alcance

---

## 📊 Resumen

| Fase | Ítems | Hechos | Pendientes |
|---|---|---|---|
| Fase 1 — Acceso y navegación | 9 | 9 | 0 |
| Fase 2 — Módulos de administración (tipo 1) | 12 | 12 | 0 |
| Fase 3 — Perfil tipo 3 (Control de Salud) | 5 | 0 | 5 |
| Fase 4 — Backend / Modelo / Controladores | 9 | 0 | 9 |
| **TOTAL** | **35** | **21** | **14** |

---

## 🟢 Fase 1 — Acceso institucional y navegación entre páginas

*Objetivo: pantalla de login con los tres tipos de usuario y redirección hacia el módulo
correspondiente. Sin validación contra base de datos.*

- [x] **1.1** Crear `vistas/login.html` con la estética clínica del sistema (panel institucional + formulario).
- [x] **1.2** Implementar el **triple switch** de tipo de usuario (1 / 2 / 3) con estado activo visible.
- [x] **1.3** Mostrar la tarjeta del perfil seleccionado (nombre, descripción, iniciales) al cambiar de tipo.
- [x] **1.4** Campos de acceso: correo institucional y contraseña, con botón mostrar/ocultar clave.
- [x] **1.5** Hardcodear un perfil por tipo de usuario en el objeto `PERFILES` de `vistas/login.html`.
- [x] **1.6** Mostrar las credenciales de prueba en la **esquina inferior derecha** (tarjeta plegable, clic para autocompletar).
- [x] **1.7** Notificación flotante de **credenciales inválidas** en la esquina superior derecha con auto-cierre.
- [x] **1.8** Redirección por rol: tipo 1 → `vistas/admin/index.html`, tipo 2 → `vistas/centro.html`, tipo 3 → `vistas/centro.html` (provisional).
- [x] **1.9** Corregir el desbordamiento horizontal de las barras de filtro y de las cabeceras de
      panel en anchos estrechos, y verificar las 9 vistas a 1440 / 1280 / 1024 / 820 / 420 px
      (sección **18.1** de `vistas/css/centro.css`).

**Notas**
- Las credenciales de prueba viven en `vistas/login.html` (objeto `PERFILES`) y se replican
  visualmente en la tarjeta de la esquina inferior derecha.
- El destino del tipo 3 es provisional hasta que se defina su módulo (§3).
- En ≤ 640 px la barra de filtros pasa a columna y sus controles ocupan el ancho completo; a
  partir de 820 px todos los filtros quedan en una sola línea dentro de su panel.

---

## 🟢 Fase 2 — Módulos del Administrador General (usuario tipo 1)

*Objetivo: barra lateral propia del tipo 1 con acceso a las vistas de gestión, auditoría y logística.*

- [x] **2.1** Barra lateral del tipo 1 con la misma estética de la barra del tipo 2, agrupada en
      secciones (`Gestión Institucional`, `Auditoría y Logística`, `Módulos Operativos`).
- [x] **2.2** Enlace de la barra lateral del tipo 1 hacia los módulos operativos del tipo 2.
- [x] **2.3** Vista **Panel de Supervisión Institucional** (`vistas/admin/index.html`) con KPIs y actividad reciente.
- [x] **2.4** Vista de **alta de usuario tipo 2** (`vistas/admin/usuarios-nuevos.html`) con validación de formulario.
- [x] **2.5** Selección obligatoria de la **sede física receptora de lotes** en el alta de usuario tipo 2.
- [x] **2.6** Bloque de **alcance operativo / permisos** por módulo en el alta de usuario.
- [x] **2.7** Vista de **registro de usuarios activos** (`vistas/admin/usuarios-activos.html`) con filtros por rol, estado y texto.
- [x] **2.8** Vista de **bitácora de acciones** (`vistas/admin/auditoria.html`): creación, modificación y eliminación de registros.
- [x] **2.9** Filtros por tipo de acción en la bitácora + línea de tiempo de eventos recientes.
- [x] **2.10** Vista de **registro de entrega de lotes** (`vistas/admin/lotes-entrega.html`) con flujo sede física tipo 1 → sede tipo 2.
- [x] **2.11** Formulario de despacho de lote con condición de traslado y registro en la tabla en memoria.
- [x] **2.12** Utilidad compartida `SIV.toast()` en `vistas/js/ui.js` (notificaciones flotantes con auto-cierre).

**Notas**
- Todas las vistas de administración comparten el bloque de barra lateral; al crear una vista
  nueva se debe copiar ese bloque y cambiar únicamente el `class="active"` del enlace correspondiente.

---

## 🟡 Fase 3 — Perfil tipo 3 «Control de Salud»  — *Pendiente*

*Objetivo: definir el módulo propio del tercer tipo de usuario.*

- [ ] **3.1** Definir el alcance funcional del perfil Control de Salud (vigilancia epidemiológica, cobertura, indicadores).
- [ ] **3.2** Crear la vista principal del tipo 3 y su ruta de entrada desde el login.
- [ ] **3.3** Barra lateral específica del tipo 3.
- [ ] **3.4** Enlazarla desde el panel del tipo 1 (enlace directo, similar a *Módulos Operativos*).
- [ ] **3.5** Actualizar la redirección del login (`PERFILES['3'].destino`).

---

## 🔴 Fase 4 — Backend: Modelos (M), Controladores (C) y Base de Datos  — *Pendiente*

*Objetivo: sustituir los datos simulados por persistencia real, manteniendo las mismas vistas.*

- [ ] **4.1** Definir el esquema de datos (usuarios, pacientes, lotes, entregas, auditoría).
- [ ] **4.2** Implementar la capa de Modelos (M) y la conexión a la base de datos.
- [ ] **4.3** Implementar la capa de Controladores (C) y el enrutamiento HTTP.
- [ ] **4.4** Endpoint de autenticación: sustituir la validación hardcodeada del login.
- [ ] **4.5** Hash de contraseñas (bcrypt/argon2) y gestión de sesión o token.
- [ ] **4.6** Endpoint de alta de usuarios tipo 2 (sustituye el alta simulada del formulario).
- [ ] **4.7** Endpoint de listado de usuarios activos con filtros y paginación.
- [ ] **4.8** Endpoint de auditoría: escritura automática de la bitácora en cada alta/edición/baja.
- [ ] **4.9** Endpoint de entrega de lotes (emisión desde el tipo 1, recepción en el tipo 2).

---

## 🧾 Bitácora de cambios recientes

| Fecha | Cambio | Módulos afectados |
|---|---|---|
| 21/10/2026 | Se crea `vistas/login.html` con triple switch de tipo de usuario, credenciales hardcodeadas y notificación de error. | Login |
| 21/10/2026 | Se crea el módulo `vistas/admin/` con las 5 vistas del Administrador General (tipo 1). | Administración |
| 21/10/2026 | Se añade `vistas/js/ui.js` con `SIV.toast()` y utilidades compartidas. | UI |
| 21/10/2026 | Se extiende `vistas/css/centro.css` (secciones 14-18): utilidades, login, toasts, administración. | CSS |
| 21/10/2026 | `index.html` ahora redirige a `vistas/login.html`. | Navegación |
| 21/10/2026 | Se reescriben `README.md` (contexto permanente) y `PLAN.md` (este archivo). | Documentación |
| 21/10/2026 | Sección **18.1** del CSS: las barras de filtro envuelven (`flex-wrap`), el buscador usa `flex: 1 1 auto` con `min-width: 250px` y los `<select>` de filtro se dimensionan por contenido. Se retiran los `style="min-width:…"` en línea del HTML. | CSS / Administración |

---

## 🗂️ Ideas y pendientes sueltos

* Definir el destino del enlace **"Ver Reporte →"** de la tarjeta *Cobertura Poblacional Guárico*
  en `vistas/centro.html` (hoy apunta a `#` porque la vista de reporte aún no existe).
* Revisar el cierre de etiquetas `<div>` en `vistas/inventario.html` (19 aperturas / 18 cierres)
  y en `vistas/personal.html` (56 / 55): desbalance heredado de las vistas originales.
* `vistas/inventario.html` y `vistas/personal.html` (vistas originales del tipo 2) **no**
  incluyen `.health-footer`, ni `.health-breadcrumbs`, ni cargan `js/ui.js`: incumplen las
  reglas 5 y 7 del `README.md`. Unificarlas con el resto de las vistas cuando se retomen.
* Considerar unificar `vistas/css/centro.css` en módulos (base / login / admin) si el archivo
  sigue creciendo; por ahora se mantiene una sola hoja para no romper los `<link>` existentes.

