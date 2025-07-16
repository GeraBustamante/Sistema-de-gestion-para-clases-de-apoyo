// ====================================
// PARSER ESPECÍFICO PARA ALUMNOS
// ====================================

// Mapeo de campos de alumnos - ACTUALIZADO con nombres reales de Google Sheets
const ALUMNOS_FIELD_MAPPING = {
    'dni alumno': 'dni',
    'nombre alumno': 'nombre',
    'edad': 'edad',
    'dni tutor': 'dniTutor',
    'nombre tutor': 'tutor',  // ✅ Campo real encontrado
    'email': 'email',
    'tel': 'telefono',
    'residencia': 'residencia',
    'nivel educativo': 'nivel',  // ✅ Campo real encontrado
    'ciclo': 'ciclo',
    'año': 'año',  // ✅ Campo real encontrado
    'turno': 'turno',
    'sede': 'sede',
    'cue': 'cue',
    'escuela': 'escuela',
    'departamento escuela': 'departamentoEscuela',
    'sector': 'sector',
    'grupo a': 'grupo',  // ✅ Campo real encontrado
    'asignatura': 'asignatura',
    'docente a cargo': 'docente',
    'observaciones': 'observaciones',
    'estado': 'estado',  // ✅ Campo real encontrado
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

// Función para parsear CSV específico de alumnos
function parseAlumnosCSV(csvText) {
    console.log('📥 CSV recibido:', csvText.length, 'caracteres');
    
    try {
        // Usar parser CSV más robusto que maneja multi-línea
        const filas = parseCSVText(csvText);
        console.log('📋 Total de filas encontradas:', filas.length);
        
        if (filas.length === 0) {
            console.warn('⚠️ CSV de alumnos vacío');
            return [];
        }
        
        // Primera fila como headers
        const headers = filas[0];
        console.log('📋 Headers de alumnos encontrados:', headers.length);
        console.log('🔍 TODOS los headers:');
        headers.forEach((header, index) => {
            console.log(`  ${index}: "${header}"`);
        });
        
        // Mostrar mapeos que vamos a aplicar
        console.log('🗺️ Mapeos que se aplicarán:');
        headers.forEach((header, index) => {
            const headerNormalizado = header.toLowerCase().trim();
            const campoMapeado = ALUMNOS_FIELD_MAPPING[headerNormalizado] || headerNormalizado;
            if (campoMapeado !== headerNormalizado) {
                console.log(`  "${header}" → "${campoMapeado}"`);
            }
        });
        
        // Procesar filas de datos
        const alumnos = [];
        let filasValidas = 0;
        let filasInvalidas = 0;
        
        for (let i = 1; i < filas.length; i++) {
            const valores = filas[i];
            
            // Verificar que tenga datos mínimos
            if (valores.length < 5) {
                console.log(`⚠️ Fila ${i} muy corta:`, valores.length, 'campos');
                filasInvalidas++;
                continue;
            }
            
            try {
                // Crear objeto alumno
                const alumno = {};
                
                // Mapear campos usando los headers
                for (let j = 0; j < headers.length && j < valores.length; j++) {
                    const headerOriginal = headers[j].toLowerCase().trim();
                    const valor = valores[j] ? valores[j].trim() : '';
                    
                    // Buscar mapeo de campo
                    const campoNormalizado = ALUMNOS_FIELD_MAPPING[headerOriginal] || headerOriginal;
                    
                    // Solo asignar si hay valor y no está vacío
                    if (valor && valor !== '' && valor !== 'N/A') {
                        alumno[campoNormalizado] = valor;
                    }
                }
                
                // Validar campos mínimos requeridos
                if (alumno.dni || alumno.nombre) {
                    // Agregar índice original para mantener orden de inscripción
                    alumno.ordenOriginal = i;
                    alumnos.push(alumno);
                    filasValidas++;
                } else {
                    console.log(`⚠️ Fila ${i} sin DNI ni nombre:`, Object.keys(alumno));
                    filasInvalidas++;
                }
                
            } catch (error) {
                console.error(`❌ Error procesando fila ${i}:`, error);
                console.error('Datos de la fila:', valores);
                filasInvalidas++;
            }
        }
        
        console.log('✅ Parser de alumnos completado:');
        console.log(`  📊 Filas válidas: ${filasValidas}`);
        console.log(`  ❌ Filas inválidas: ${filasInvalidas}`);
        console.log(`  📋 Total alumnos: ${alumnos.length}`);
        
        // Mostrar ejemplo del primer alumno
        if (alumnos.length > 0) {
            console.log('👤 Primer alumno de ejemplo:', alumnos[0]);
        }
        
        return alumnos;
        
    } catch (error) {
        console.error('❌ Error en parser de alumnos:', error);
        return [];
    }
}

// Función robusta para parsear texto CSV completo con multi-línea
function parseCSVText(csvText) {
    const result = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;
    
    while (i < csvText.length) {
        const char = csvText[i];
        const nextChar = i + 1 < csvText.length ? csvText[i + 1] : null;
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Doble comilla escapada
                currentField += '"';
                i += 2;
                continue;
            } else {
                // Alternar estado de comillas
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Final de campo
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // Final de fila (solo si no estamos dentro de comillas)
            if (char === '\r' && nextChar === '\n') {
                i++; // Saltar \r\n
            }
            
            // Agregar último campo y fila
            currentRow.push(currentField.trim());
            
            // Solo agregar fila si no está vacía
            if (currentRow.length > 0 && currentRow.some(field => field.length > 0)) {
                result.push(currentRow);
            }
            
            currentRow = [];
            currentField = '';
        } else {
            // Carácter normal
            currentField += char;
        }
        
        i++;
    }
    
    // Agregar último campo y fila si existen
    if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(field => field.length > 0)) {
            result.push(currentRow);
        }
    }
    
    return result;
}

// Función auxiliar para parsear una línea CSV respetando comillas (mantener para compatibilidad)
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    // Agregar el último campo
    result.push(current);
    
    return result.map(field => field.replace(/^"|"$/g, '').trim());
}

// Función para cargar y parsear alumnos desde Google Sheets
async function loadAlumnosData() {
    console.log('🎓 Cargando datos específicos de ALUMNOS...');
    
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=ALUMNOS`;
        console.log('🔗 URL de alumnos:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('📥 CSV de alumnos recibido:', csvText.length, 'caracteres');
        
        const alumnos = parseAlumnosCSV(csvText);
        console.log('✅ Alumnos cargados exitosamente:', alumnos.length, 'registros');
        
        return alumnos;
        
    } catch (error) {
        console.error('❌ Error cargando alumnos:', error);
        throw error;
    }
}

// Hacer disponibles las funciones globalmente
window.parseAlumnosCSV = parseAlumnosCSV;
window.loadAlumnosData = loadAlumnosData;
