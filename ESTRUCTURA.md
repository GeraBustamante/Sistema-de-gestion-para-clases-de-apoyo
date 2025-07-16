# 📁 ESTRUCTURA ORGANIZACIONAL DEL PROYECTO

## 🏗️ ARQUITECTURA LIMPIA Y ORGANIZADA

### **📂 Estructura de archivos:**

```
/
├── index.html                  (Aplicación principal)
├── estilos.css                 (Estilos CSS)
├── ESTADO-PROYECTO.md         (Documentación del estado)
├── ESTRUCTURA.md              (Este archivo)
└── js/                        (Código JavaScript organizado)
    ├── 🏛️ core/               (Núcleo del sistema)
    │   ├── config.js          (Configuración general)
    │   ├── main.js            (Inicialización)
    │   ├── data-loader.js     (Cargador principal)
    │   └── data-loader-modular.js (Cargador modular)
    │
    ├── 🔧 parsers/            (Parsers específicos)
    │   ├── parser-alumnos.js  (Parser para alumnos)
    │   ├── parser-sedes.js    (Parser para sedes)
    │   ├── parser-docentes.js (Parser para docentes)
    │   └── parser-grupos.js   (Parser para grupos)
    │
    ├── 🎨 ui/                 (Interfaces de usuario)
    │   ├── ui-dashboard.js    (Dashboard principal)
    │   ├── ui-alumnos.js      (Interface de alumnos)
    │   ├── ui-docentes.js     (Interface de docentes)
    │   ├── ui-grupos.js       (Interface de grupos)
    │   └── ui-sedes.js        (Interface de sedes)
    │
    ├── 🛠️ utils/              (Utilidades y herramientas)
    │   ├── utils.js           (Funciones utilitarias)
    │   ├── filters.js         (Sistema de filtros)
    │   └── test-parsers.js    (Herramientas de testing)
    │
    └── data-parser.js          (Parser legacy - mantener por compatibilidad)
```

## 🎯 BENEFICIOS DE LA ORGANIZACIÓN:

### **✅ Ventajas:**
- **🔍 Fácil localización**: Cada archivo está en su lugar lógico
- **📦 Modularidad**: Cambios en una parte no afectan otras
- **🧹 Mantenimiento**: Código más limpio y organizado
- **📈 Escalabilidad**: Fácil agregar nuevas funcionalidades
- **🔧 Debugging**: Más fácil encontrar y arreglar problemas

### **📋 Responsabilidades por carpeta:**

**🏛️ `/core/`** - El corazón del sistema:
- `config.js`: Configuración de Google Sheets y variables globales
- `main.js`: Inicialización y arranque de la aplicación
- `data-loader*.js`: Carga de datos desde Google Sheets

**🔧 `/parsers/`** - Procesamiento de datos específicos:
- Cada parser maneja UNA sola categoría de datos
- Parser robusto que maneja CSV con saltos de línea
- Mapeo de campos y validación de datos

**🎨 `/ui/`** - Todo lo relacionado con la interfaz:
- Renderizado de tablas y componentes
- Interacciones del usuario
- Actualización de elementos visuales

**🛠️ `/utils/`** - Herramientas y funciones auxiliares:
- Funciones reutilizables
- Sistema de filtros y búsquedas
- Herramientas de desarrollo y testing

## 🚀 ORDEN DE CARGA EN EL HTML:

1. **Librerías externas** (Chart.js)
2. **Core del sistema** (config, utils, data-parser legacy)
3. **Parsers específicos** (alumnos, sedes, docentes, grupos)
4. **Cargadores de datos** (data-loader, data-loader-modular)
5. **Interfaces de usuario** (ui-*)
6. **Utilidades** (filters, test-parsers)
7. **Inicialización** (main.js)

## 📊 ESTADO ACTUAL:
- ✅ **17 archivos JS** organizados en 4 carpetas lógicas
- ✅ **Alumnos funcionando** (238 registros)
- ✅ **Parser CSV robusto** (maneja saltos de línea)
- ✅ **Arquitectura modular** escalable
- ✅ **Código limpio** sin duplicados

## 🔄 PRÓXIMOS PASOS:
1. Probar que la reorganización no rompió nada
2. Habilitar gradualmente más categorías (sedes, docentes, grupos)
3. Considerar mover `data-parser.js` a `/parsers/` cuando sea seguro
4. Documentar APIs internas de cada módulo
