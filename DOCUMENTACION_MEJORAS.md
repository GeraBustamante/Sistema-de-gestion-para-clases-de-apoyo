# 📋 DOCUMENTACIÓN DE MEJORAS Y DESARROLLO
**Sistema de Gestión - Clases de Apoyo**  
*Fecha de creación: 14 de julio de 2025*

---

## 🎯 ESTADO ACTUAL DEL SISTEMA

### ✅ **FUNCIONALIDADES OPERATIVAS**
- [x] **Alumnos**: Carga desde Google Sheets, vista cards/tabla, filtros básicos
- [x] **Sedes**: Carga datos reales, 8 tarjetas con información completa
- [x] **Grupos**: Funcionando con datos reales
- [x] **Parsers**: Manejo correcto de CSV con saltos de línea en campos
- [x] **Navegación**: Sistema de pestañas funcional
- [x] **Conexión Google Sheets**: Estable y confiable

### 🔧 **ARCHIVOS CLAVE**
- `sedes-simple.js` - Parser específico para formato transpuesto de sedes
- `js/parsers/parser-alumnos-limpio.js` - Parser robusto para CSV con multilínea
- `js/core/config.js` - Configuración global
- `index.html` - Estructura principal

---

## 🚀 MEJORAS PLANIFICADAS

### 1. **SISTEMA DE ETAPAS** ⭐ **PRIORIDAD ALTA**

#### **Concepto**
Cada etapa es un sistema completo independiente con:
- **Período específico**: ej. "Mayo-Junio 2025 (Primario)"
- **Nivel educativo**: Primario o Secundario
- **Google Sheets propio**: ID único para cada etapa
- **Formularios independientes**: Inscripción y asistencia
- **Estado**: Activa, Completada, Planificada

#### **Ejemplos de Etapas**
```
Mayo-Junio 2025 (Primario)     - COMPLETADA
Junio-Julio 2025 (Secundario)  - ACTIVA (actual)
Sep-Oct 2025 (Primario)        - PLANIFICADA
Oct-Dic 2025 (Secundario)      - PLANIFICADA
Feb-Feb 2026 (Secundario)      - PLANIFICADA
```

#### **Implementación Técnica**
```javascript
const ETAPAS = {
  "mayo-jun-2025-primario": {
    nombre: "Mayo-Junio 2025 (Primario)",
    periodo: "Mayo-Junio 2025",
    nivel: "Primario", 
    spreadsheetId: "ID_GOOGLE_SHEETS_1",
    estado: "completada",
    color: "#3498db" // Azul para primario
  },
  "jun-jul-2025-secundario": {
    nombre: "Junio-Julio 2025 (Secundario)", 
    periodo: "Junio-Julio 2025",
    nivel: "Secundario",
    spreadsheetId: "1YoWb4hJ-vT8-h7ns3nwVHirlLfRmBxbHt0xjTNzLs00",
    estado: "activa",
    color: "#e74c3c" // Rojo para secundario
  }
}
```

#### **Plan de Implementación por Fases**

**FASE 1 - UI Visual (Riesgo: 0%)**
- [ ] Agregar selector de etapas en el header
- [ ] Mostrar etapa actual sin cambiar funcionalidad
- [ ] Styling visual distintivo por nivel
- [ ] Mantener toda la lógica actual intacta

**FASE 2 - Configuración (Riesgo: Mínimo)**
- [ ] Crear archivo `js/core/etapas-config.js`
- [ ] Modificar `sheetsConfig.spreadsheetId` dinámicamente
- [ ] Implementar fallback a etapa actual si falla
- [ ] Testing exhaustivo

**FASE 3 - Funcionalidad Completa**
- [ ] Persistencia en localStorage
- [ ] Transiciones suaves entre etapas
- [ ] Indicadores de carga al cambiar
- [ ] Validación de datos por etapa

### 2. **SISTEMA DE IMPRESIÓN Y LISTAS** ⭐ **PRIORIDAD ALTA**

#### **Concepto**
Integrar funcionalidad de generación de listas imprimibles directamente desde la web, replicando el sistema actual de archivo "LISTAS".

#### **Funcionalidades de Impresión**
- **Lista de Asistencia por Grupo**
  - Formato A4 horizontal
  - Header: Docente, materia, sede, horario
  - Columnas: Nombre, DNI, fechas como columnas
  - Fórmulas automáticas: "P" (presente), blanco (ausente), "-" (fecha anterior a inscripción)
  - Máximo 12 alumnos por hoja

- **Otras listas existentes** (por documentar)
  - Listas de inscripción
  - Reportes por sede
  - Listas de contacto
  - etc.

#### **Implementación Técnica - OPCIÓN ELEGIDA**
**HTML + CSS Print**: Generar HTML formateado para impresión
- ✅ **Flujo familiar**: Ctrl+P como siempre
- ✅ **Flexibilidad Chrome**: Imprimir directo o guardar PDF
- ✅ **Configuración conocida**: Como Google Sheets pero con datos en tiempo real
- ✅ **Implementación simple**: HTML responsive para impresión

#### **Ventajas de integrar en la web**
- ✅ **Un solo lugar**: Todo el sistema en una interfaz
- ✅ **Datos actualizados**: Siempre con la información más reciente
- ✅ **Filtros inteligentes**: Generar listas por criterios específicos
- ✅ **Batch printing**: Múltiples grupos/sedes de una vez
- ✅ **Personalización**: Templates modificables por etapa

#### **Plan de Implementación**
**FASE 1 - Prototipo**
- [ ] Crear vista previa de lista de asistencia en HTML
- [ ] CSS print-friendly para formato A4
- [ ] Integrar datos de un grupo específico

**FASE 2 - Funcionalidad Básica**
- [ ] Selector de grupo para generar lista
- [ ] Integración con datos de asistencia
- [ ] Botón "Imprimir" con formato correcto

**FASE 3 - Sistema Completo**
- [ ] Templates para diferentes tipos de listas
- [ ] Generación batch (múltiples grupos)
- [ ] Personalización de formatos

### 3. **GESTIÓN DE ASISTENCIA** ⭐ **PRIORIDAD MEDIA**

#### **Concepto**
- Archivo separado de Google Sheets para asistencia
- Vista calendario/temporal
- Alertas por faltas consecutivas
- Estadísticas por período

### 4. **NAVEGACIÓN INTELIGENTE** ⭐ **PRIORIDAD MEDIA**

#### **Funcionalidades**
- [ ] **Clicks interactivos**: Docente → tarjeta de docente
- [ ] **Enlaces cruzados**: Alumno → sede, sede → alumnos
- [ ] **Breadcrumbs**: Seguimiento de navegación
- [ ] **Historial**: Botón "Atrás" inteligente

### 5. **MEJORAS TÉCNICAS** ⭐ **PRIORIDAD BAJA**

#### **Limpieza**
- [ ] Remover información de debug de sedes
- [ ] Optimizar parsers para mejor performance
- [ ] Validación de datos (DNIs, emails, fechas)

#### **UI/UX**
- [ ] Mejorar filtros en todas las pestañas
- [ ] Búsqueda global funcional
- [ ] Paginación para tablas largas
- [ ] Responsive design móvil

#### **Dashboard**
- [ ] Conectar gráficos con datos reales
- [ ] Métricas por etapa
- [ ] Estadísticas comparativas

---

## 🛡️ ESTRATEGIA DE DESARROLLO SEGURO

### **Principios**
1. **Modularidad**: Cada mejora como componente independiente
2. **Fallbacks**: Siempre tener plan B si algo falla
3. **Testing incremental**: Probar cada fase antes de continuar
4. **Documentación**: Mantener este archivo actualizado

### **Backup Strategy**
- Hacer copia del sistema funcionando antes de cada fase
- Commits frecuentes durante desarrollo
- Testing en etapa de desarrollo antes de producción

---

## 📝 NOTAS DE DESARROLLO

### **Decisiones Técnicas Importantes**
1. **Parser CSV mejorado**: Maneja campos multilínea correctamente
2. **Formato transpuesto sedes**: Parser específico para estructura única
3. **Variables globales**: `window.gruposData`, `window.sedesData` para consistencia
4. **Sistema de impresión**: HTML + CSS Print elegido por familiaridad y flexibilidad

### **Lecciones Aprendidas**
- Los datos de Google Sheets pueden tener formatos únicos que requieren parsers específicos
- La información de debug es crucial para resolver problemas rápidamente
- La modularidad previene romper funcionalidades existentes
- Mantener flujos de trabajo familiares (Ctrl+P) mejora la adopción

---

## 🎯 PRÓXIMOS PASOS

### **Inmediatos**
1. Finalizar documentación de etapas existentes
2. Recopilar IDs de Google Sheets para cada etapa
3. Decidir implementación de Fase 1

### **Seguimiento**
- Actualizar este documento después de cada sesión de desarrollo
- Marcar tareas completadas con fecha
- Documentar cualquier problema encontrado

---

**Última actualización**: 14 de julio de 2025  
**Estado del sistema**: Funcional y estable  
**Próxima prioridad**: Sistema de etapas - Fase 1
