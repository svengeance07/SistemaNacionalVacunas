# SIV-GUÁRICO // Sistema Integrado de Vacunación y Salud Pública

Plataforma asistencial y de control epidemiológico para la gestión del **Programa Ampliado de Inmunizaciones (PAI)** en la Subregión Guárico.

---

## 🏛️ Arquitectura MVC (Modelo - Vista - Controlador)

El proyecto está diseñado bajo el patrón arquitectónico **M.V.C.**:

* **Modelos (M)**: *Capa de Backend / Datos* (desacoplada; a integrar con la base de datos y lógica de negocio).
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
│   ├── centro.html              # Vista 1: Panel General / Sala Situacional de Inmunización
│   ├── inventario.html          # Vista 2: Catálogo de Biológicos y Cadena de Frío
│   ├── personal.html         # Vista 3: Directorio de Personal de Enfermería y Brigadas
│   │
│   └── css/
│       └── centro.css           # Estilos clínicos (paleta de salud pública, tipografía, grid y responsivo)
│
└── README.md                    # Documentación de arquitectura
```

---

## 🩺 Módulos de Vistas Disponibles (`vistas/`)

1. **Panel General (`vistas/centro.html`)**:
   - Tarjetas KPI: Dosis aplicadas hoy (`2,845`), alertas prioritarias (`04`), cobertura poblacional (`76.4%`) y brigadas activas (`38/42`).
   - Mapa y distribución sanitaria por municipios (Roscio, Miranda, Infante, Zaraza, Ribas).
   - Monitoreo de cadena de frío (+3.8°C, +7.8°C) y lotes con riesgo de caducidad.
   - Tabla de pacientes inmunizados con buscador en tiempo real.
   - Identidad institucional del profesional de guardia (Dra. Elena Cordero).

2. **Inventario de Biológicos (`vistas/inventario.html`)**:
   - Catálogo de vacunas (Fiebre Amarilla, Pentavalente, BCG, Polio Oral, VPH, Toxoide).
   - Indicadores de temperatura de almacenamiento, días para caducidad y estado de stock.
   - Buscador rápido por nombre o lote de vacuna.

3. **Directorio de Personal y Brigadas (`vistas/personal.html`)**:
   - Fichas de enfermeros, enfermeras y coordinadores de campo.
   - Asignación territorial por ambulatorio, termos PQS y registro de dosis administradas.
   - Buscador por nombre, cargo o municipio.
