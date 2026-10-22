# SIV-NACIONAL // Sistema Nacional de Inmunizaciones y Salud Pública

Plataforma asistencial y de control epidemiológico para la gestión del **Programa Ampliado de Inmunizaciones (PAI)** a nivel nacional en la **República Bolivariana de Venezuela (MPPS - SPNS)**.

---

## 🏛️ Arquitectura MVC (Modelo - Vista - Controlador)

El proyecto está diseñado bajo el patrón arquitectónico **M.V.C.**:

* **Modelos (M)**: *Capa de Backend / Datos* (desacoplada; a enlazar con la base de datos nacional y perfiles del sistema).
* **Vistas (V)**: *Capa de Presentación / Frontend* (**en desarrollo actual**). Compuesta exclusivamente por interfaces HTML5 semánticas y hojas de estilo CSS clínicas desacopladas.
* **Controladores (C)**: *Capa de Backend / Enrutamiento* (desacoplada; procesará las peticiones HTTP entre los modelos y las vistas).

---

## 📁 Estructura Limpia Actual (Solo Vistas HTML y CSS)

```text
sistema_vacunas/
│
├── index.html                   # Punto de acceso / Redirección limpia a las vistas
│
├── vistas/                      # Capa de VISTAS (Views) puras del sistema MVC
│   ├── centro.html              # Vista 1: Panel General / Sala Situacional Nacional
│   ├── pacientes.html           # Vista 2: Consulta por Cédula (Adultos / Niños por Representante) y Registro
│   ├── reportes.html            # Vista 3: Vigilancia Epidemiológica y Notificación de Problemas / ESAVI
│   │
│   └── css/
│       └── centro.css           # Estilos clínicos (paleta de salud pública, tipografía, grid y responsivo)
│
└── README.md                    # Documentación de arquitectura
```

---

## 🩺 Módulos de Vistas Disponibles (`vistas/`)

1. **Panel General (`vistas/centro.html`)**:
   - Tarjetas KPI: Dosis aplicadas en la jornada mensual, trazabilidad en tiempo real y vigilancia de eventos adversos (ESAVI).
   - Tabla clínica de registro de pacientes inmunizados con horarios y trazabilidad nacional (#VAC-VEN-XXXXX).
   - Acceso directo a reportar problemas de vacunas y registrar pacientes.

2. **Consulta y Registro de Pacientes (`vistas/pacientes.html`)**:
   - **Selector de Categoría:** Mayor de Edad (Adulto) vs. Niño / Menor de Edad.
   - **Búsqueda Pediátrica por Cédula del Padre/Representante:** Al ingresar la cédula del padre o tutor, lista todos los menores vinculados con acceso a su carnet individual y opción para registrar nuevos hijos.
   - **Búsqueda de Adultos:** Búsqueda directa por cédula de identidad propia.
   - **Historial Clínico Permanente:** Registro de cada biológico aplicado con dosis, fecha, lote, centro y enfermero.
   - **Acceso Directo a Notificación de Reacción:** Botón en cada dosis para levantar un reporte inmediato.

3. **Vigilancia Epidemiológica y Reporte de Problemas / ESAVI (`vistas/reportes.html`)**:
   - **Enfoque de Centro de Salud:** El centro pertenece a su propio Estado, Municipio y Parroquia (Hospital Dr. Israel Ranuárez Balza, Guárico).
   - **Búsqueda por Cédula y Última Vacuna:** Al consultar la cédula del paciente, el sistema resalta de inmediato su **última vacuna colocada** (con fecha, lote y centro) y el historial completo para que el enfermero interrogue al paciente con exactitud.
   - **Clasificación de Severidad:** Leve, Moderado y Grave (notificación clínica inmediata).
   - **Transmisión y Preparación para la Subregión:** Los reportes emitidos quedan guardados en el historial de la persona y en cola local para que, al implementarse el perfil centralizado de la Subregión, esta agrupe y visualice todos los casos notificados por sus centros.
   - **Generación de Ficha Epidemiológica:** Expedientes con identificador oficial (#REP-GUA-AAAA-XXX), exportación y vista para impresión.
