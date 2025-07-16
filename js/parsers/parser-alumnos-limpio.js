// ====================================
// PARSER ESPECÍFICO PARA ALUMNOS (VERSIÓN LIMPIA)
// ====================================

// Mapeo de campos de alumnos - ACTUALIZADO con nombres reales de Google Sheets
const ALUMNOS_FIELD_MAPPING = {
    'dni alumno': 'dni',
    'nombre alumno': 'nombre',
    'edad': 'edad',
    'dni tutor': 'dniTutor',
    'nombre tutor': 'tutor',
    'email': 'email',
    'tel': 'telefono',
    'residencia': 'residencia',
    'nivel educativo': 'nivel',
    'ciclo': 'ciclo',
    'año': 'año',
    'turno': 'turno',
    'sede': 'sede',
    'cue': 'cue',
    'escuela': 'escuela',
    'departamento escuela': 'departamentoEscuela',
    'sector': 'sector',
    'grupo a': 'grupo',
    'asignatura': 'asignatura',
    'docente a cargo': 'docente',
    'observaciones': 'observaciones',
    'estado': 'estado',
    'fecha de inscripcion': 'fechaInscripcion',
    'se retira solo/a': 'retiraSolo',
    'dni responsable 1': 'dniResponsable1',
    'nombre responsable 1': 'nombreResponsable1',
    'dni responsable 2': 'dniResponsable2',
    'nombre responsable 2': 'nombreResponsable2',
    'dni responsable 3': 'dniResponsable3',
    'nombre responsable 3': 'nombreResponsable3',
    'primera asistencia': 'primeraAsistencia',
    'cantidad asistencias': 'cantidadAsistencias',
    'porcentaje de asistencia': 'porcentajeAsistencia',
    'asistencia': 'asistenciaGeneral',
    'faltas seguidas hasta hoy': 'faltasSeguidas',
    'ultimo dia de asistencia': 'ultimaAsistencia',
    'modulo asignado': 'moduloAsignado',
    'etiquetas': 'etiquetas',
    'aprobado': 'aprobado'
};

// Función para parsear CSV específico de alumnos (SIN LOGS)
function parseAlumnosCSV(csvText) {
    try {
        const filas = parseCSVText(csvText);
        
        if (filas.length === 0) {
            return [];
        }
        
        const headers = filas[0];
        const alumnos = [];
        
        for (let i = 1; i < filas.length; i++) {
            const valores = filas[i];
            
            if (!valores || valores.length < 2) {
                continue;
            }
            
            try {
                const alumno = {};
                
                for (let j = 0; j < headers.length && j < valores.length; j++) {
                    const headerOriginal = headers[j].toLowerCase().trim();
                    const valor = valores[j] ? valores[j].trim() : '';
                    const campoNormalizado = ALUMNOS_FIELD_MAPPING[headerOriginal] || headerOriginal;
                    
                    if (valor && valor !== '') {
                        alumno[campoNormalizado] = valor;
                    }
                }
                
                if (alumno.dni && (alumno.nombre || alumno['nombre alumno'])) {
                    if (!alumno.nombre && alumno['nombre alumno']) {
                        alumno.nombre = alumno['nombre alumno'];
                    }
                    
                    alumno.ordenOriginal = i;
                    alumnos.push(alumno);
                }
                
            } catch (error) {
                // Error silencioso
            }
        }
        
        return alumnos;
        
    } catch (error) {
        return [];
    }
}

// Función para cargar y parsear alumnos desde Google Sheets (SIN LOGS)
async function loadAlumnosData() {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=ALUMNOS`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        return parseAlumnosCSV(csvText);
        
    } catch (error) {
        // Retornar alumnos de fallback en caso de error
        return [
            { dni: '12345678', nombre: 'Juan Pérez', sede: 'Capital', nivel: 'Secundario', grupo: 'A1' },
            { dni: '87654321', nombre: 'María García', sede: 'Norte', nivel: 'Secundario', grupo: 'B2' },
            { dni: '11223344', nombre: 'Carlos López', sede: 'Capital', nivel: 'Primario', grupo: 'C1' }
        ];
    }
}

// Función auxiliar para parsear CSV que maneja saltos de línea dentro de comillas
function parseCSVText(csvText) {
    const result = [];
    const lines = csvText.split('\n');
    
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let isMultilineField = false;
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Comilla doble escapada
                    currentField += '"';
                    i++; // Saltar la siguiente comilla
                } else {
                    // Cambiar estado de comillas
                    inQuotes = !inQuotes;
                    if (inQuotes) {
                        isMultilineField = true;
                    }
                }
            } else if (char === ',' && !inQuotes) {
                // Fin de campo
                currentRow.push(currentField.trim());
                currentField = '';
                isMultilineField = false;
            } else {
                currentField += char;
            }
        }
        
        // Si estamos dentro de comillas al final de la línea, agregar salto de línea
        if (inQuotes && isMultilineField) {
            currentField += '\n';
        } else {
            // Fin de línea - agregar último campo y procesar fila
            if (currentField.trim() || currentRow.length > 0) {
                currentRow.push(currentField.trim());
            }
            
            // Si la fila tiene datos, agregarla al resultado
            if (currentRow.length > 0 && currentRow.some(field => field.length > 0)) {
                result.push(currentRow);
            }
            
            // Resetear para la próxima fila
            currentRow = [];
            currentField = '';
            isMultilineField = false;
        }
    }
    
    // Agregar la última fila si queda pendiente
    if (currentRow.length > 0 || currentField.trim()) {
        if (currentField.trim()) {
            currentRow.push(currentField.trim());
        }
        if (currentRow.some(field => field.length > 0)) {
            result.push(currentRow);
        }
    }
    
    return result;
}

// Hacer disponibles las funciones globalmente
window.parseAlumnosCSV = parseAlumnosCSV;
window.loadAlumnosData = loadAlumnosData;
