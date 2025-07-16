// ==========================function parseGrupos(csvText) {
    // // console.log('👥 Iniciando parser específico de GRUPOS...');
    // // console.log('📥 CSV recibido:', csvText.length, 'caracteres');=======
// PARSER ESPECÍFICO PARA GRUPOS
// ====================================

// Mapeo de campos de grupos - ACTUALIZADO para datos reales
const GRUPOS_FIELD_MAPPING = {
    'id_grupo': 'idGrupo',
    'materia': 'materia',
    'turno': 'turno', 
    'nivel': 'nivel',
    'ciclo': 'ciclo',
    'grupo': 'grupo',
    'sede': 'sede',
    'lunes': 'lunes',
    'martes': 'martes',
    'miercoles': 'miercoles',
    'jueves': 'jueves',
    'viernes': 'viernes',
    'cardinal': 'cardinal',
    'cupo_max': 'cupoMax',
    'docente': 'docente',
    'ocupacion': 'ocupacion',
    'id2_grupo': 'id2Grupo',
    'id_grupo2': 'idGrupo2',
    'observaciones': 'observaciones',
    'mod_gral': 'modGral'
};

// Función para parsear CSV específico de grupos
function parseGruposCSV(csvText) {
    // console.log('👥 Iniciando parser específico de GRUPOS...');
    // console.log('📥 CSV recibido:', csvText.length, 'caracteres');
    
    try {
        // Dividir en líneas respetando comillas
        const lineas = csvText.split('\n');
        // // console.log('📋 Total de líneas encontradas:', lineas.length);
        
        if (lineas.length === 0) {
            // // console.warn('⚠️ CSV de grupos vacío');
            return [];
        }
        
        // Primera línea como headers
        const headerLine = lineas[0].trim();
        if (!headerLine) {
            // // console.warn('⚠️ No se encontró línea de headers en grupos');
            return [];
        }
        
        const headers = parseCSVLine(headerLine);
        // // console.log('📋 Headers de grupos encontrados:', headers.length);
        // // console.log('🔍 Headers:', headers);
        
        // Procesar filas de datos
        const grupos = [];
        let filasValidas = 0;
        let filasInvalidas = 0;
        
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
                    // console.log(`⚠️ Fila ${i} muy corta:`, valores.length, 'campos');
                    filasInvalidas++;
                    continue;
                }
                
                // Crear objeto grupo
                const grupo = {};
                
                // Mapear campos usando los headers
                for (let j = 0; j < headers.length && j < valores.length; j++) {
                    const headerOriginal = headers[j].toLowerCase().trim();
                    const valor = valores[j] ? valores[j].trim() : '';
                    
                    // Buscar mapeo de campo
                    const campoNormalizado = GRUPOS_FIELD_MAPPING[headerOriginal] || headerOriginal;
                    
                    // Solo asignar si hay valor
                    if (valor && valor !== '') {
                        grupo[campoNormalizado] = valor;
                    }
                }
                
                // Validar campos mínimos requeridos - MEJORADO para datos reales
                if (grupo.idGrupo && 
                    grupo.idGrupo !== 'Grupo no definido' && 
                    grupo.materia && 
                    grupo.sede &&
                    grupo.sede !== 'Seleccione SEDE') {
                    grupos.push(grupo);
                    filasValidas++;
                } else {
                    // console.log(`⚠️ Fila ${i} excluida - Grupo no válido:`, grupo.idGrupo, grupo.materia, grupo.sede);
                    filasInvalidas++;
                }
                
            } catch (error) {
                console.error(`❌ Error procesando fila ${i}:`, error);
                filasInvalidas++;
            }
        }
        
        // console.log('✅ Parser de grupos completado:');
        // console.log(`  📊 Filas válidas: ${filasValidas}`);
        // console.log(`  ❌ Filas inválidas: ${filasInvalidas}`);
        // console.log(`  👥 Total grupos: ${grupos.length}`);
        
        // Mostrar ejemplo del primer grupo
        if (grupos.length > 0) {
            // console.log('👥 Primer grupo de ejemplo:', grupos[0]);
        }
        
        return grupos;
        
    } catch (error) {
        console.error('❌ Error en parser de grupos:', error);
        return [];
    }
}

// Función para cargar y parsear grupos desde Google Sheets
async function loadGruposData() {
    // console.log('👥 Cargando datos específicos de GRUPOS...');
    
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=GRUPOS`;
        // console.log('🔗 URL de grupos:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        // console.log('📥 CSV de grupos recibido:', csvText.length, 'caracteres');
        
        const grupos = parseGruposCSV(csvText);
        // console.log('✅ Grupos cargados exitosamente:', grupos.length, 'registros');
        
        return grupos;
        
    } catch (error) {
        console.error('❌ Error cargando grupos:', error);
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
window.parseGruposCSV = parseGruposCSV;
window.loadGruposData = loadGruposData;
