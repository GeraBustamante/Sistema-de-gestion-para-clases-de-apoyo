// ====================================
// PARSER ESPECÍFICO PARA DOCENTES
// ====================================

// Mapeo de campos de docentes basado en los headers reales de Google Sheets
const DOCENTES_FIELD_MAPPING = {
    'dni': 'dni',
    'nombre_completo': 'nombre_completo',
    'email': 'email',
    'tel': 'telefono',
    'residencia': 'residencia',
    'sede': 'sede',
    'nivel_educativo': 'nivel_educativo',
    'materias': 'materias',
    'matemática': 'materia_matematica',
    'lengua': 'materia_lengua',
    'física': 'materia_fisica',
    'química': 'materia_quimica',
    'inglés': 'materia_ingles',
    'mod_disp': 'modalidad_disponible',
    'cantgruposasignados': 'grupos_asignados',
    'cantalumasignados': 'alumnos_asignados',
    'cant_alumnos': 'total_alumnos'
};

// Función para parsear CSV específico de docentes
function parseDocentesCSV(csvText) {
    try {
        // Dividir en líneas respetando comillas
        const lineas = csvText.split('\n');
        
        if (lineas.length === 0) {
            console.warn('⚠️ CSV de docentes vacío');
            return [];
        }
        
        // Primera línea como headers
        const headerLine = lineas[0].trim();
        if (!headerLine) {
            console.warn('⚠️ No se encontró línea de headers en docentes');
            return [];
        }
        
        const headers = parseCSVLine(headerLine);
        
        // Procesar filas de datos
        const docentes = [];
        let filasValidas = 0;
        
        for (let i = 1; i < lineas.length; i++) {
            const linea = lineas[i].trim();
            
            // Saltar líneas vacías
            if (!linea) {
                continue;
            }
            
            try {
                const valores = parseCSVLine(linea);
                
                // Verificar que tenga datos mínimos
                if (valores.length < 3) {
                    continue;
                }
                
                // Crear objeto docente
                const docente = {};
                
                // Mapear campos usando los headers
                for (let j = 0; j < headers.length && j < valores.length; j++) {
                    const headerOriginal = headers[j].toLowerCase().trim();
                    const valor = valores[j] ? valores[j].trim() : '';
                    
                    // Buscar mapeo de campo
                    const campoNormalizado = DOCENTES_FIELD_MAPPING[headerOriginal] || headerOriginal;
                    
                    // Solo asignar si hay valor
                    if (valor && valor !== '') {
                        docente[campoNormalizado] = valor;
                    }
                }
                
                // Validar campos mínimos requeridos
                if (docente.dni || docente.nombre_completo) {
                    docentes.push(docente);
                    filasValidas++;
                }
                
            } catch (error) {
                console.error(`❌ Error procesando fila ${i} de docentes:`, error);
            }
        }
        
        console.log(`✅ Docentes cargados: ${docentes.length} registros`);
        return docentes;
        
    } catch (error) {
        console.error('❌ Error en parser de docentes:', error);
        return [];
    }
}

// Función para cargar y parsear docentes desde Google Sheets
async function loadDocentesData() {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=DOCENTES`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        const docentes = parseDocentesCSV(csvText);
        
        return docentes;
        
    } catch (error) {
        console.error('❌ Error cargando docentes:', error);
        throw error;
    }
}

// Función auxiliar para parsear una línea CSV respetando comillas
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

// Hacer disponibles las funciones globalmente
window.parseDocentesCSV = parseDocentesCSV;
window.loadDocentesData = loadDocentesData;
