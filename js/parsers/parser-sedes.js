// ====================================
// PARSER ESPECÍFICO PARA SEDES
// ====================================

// Mapeo de campos de sedes (basado en datos reales de Google Sheets)
const SEDES_FIELD_MAPPING = {
    'id_sede': 'idSede',
    'nombre_sede': 'nombreSede',
    'departamento': 'departamento',
    'nivel educativo': 'nivelEducativo',
    'turno': 'turno',
    'numero de sede': 'numeroSede',
    'cue': 'cue',
    'establecimiento': 'establecimiento',
    'direccion': 'direccion',
    'correo': 'correo',
    'coordinador/a': 'coordinador',
    'id_sede2': 'idSede2'
};

// Función para parsear CSV específico de sedes
function parseSedesCSV(csvText) {
    console.log('🏢 Iniciando parser específico de SEDES...');
    console.log('📥 CSV recibido:', csvText.length, 'caracteres');
    
    try {
        // Dividir en líneas respetando comillas
        const lineas = csvText.split('\n');
        console.log('📋 Total de líneas encontradas:', lineas.length);
        
        if (lineas.length === 0) {
            console.warn('⚠️ CSV de sedes vacío');
            return [];
        }
        
        // Primera línea como headers
        const headerLine = lineas[0].trim();
        if (!headerLine) {
            console.warn('⚠️ No se encontró línea de headers en sedes');
            return [];
        }
        
        const headers = parseCSVLine(headerLine);
        console.log('📋 Headers de sedes encontrados:', headers.length);
        console.log('🔍 Headers:', headers);
        
        // Procesar filas de datos
        const sedes = [];
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
                if (valores.length < 2) {
                    console.log(`⚠️ Fila ${i} muy corta:`, valores.length, 'campos');
                    filasInvalidas++;
                    continue;
                }
                
                // Crear objeto sede
                const sede = {};
                
                // Mapear campos usando los headers
                for (let j = 0; j < headers.length && j < valores.length; j++) {
                    const headerOriginal = headers[j].toLowerCase().trim();
                    const valor = valores[j] ? valores[j].trim() : '';
                    
                    // Buscar mapeo de campo
                    const campoNormalizado = SEDES_FIELD_MAPPING[headerOriginal] || headerOriginal;
                    
                    // Solo asignar si hay valor
                    if (valor && valor !== '') {
                        sede[campoNormalizado] = valor;
                    }
                }
                
                // Validar campos mínimos requeridos (campos reales)
                if (sede.idSede && sede.nombreSede) {
                    sedes.push(sede);
                    filasValidas++;
                } else {
                    console.log(`⚠️ Fila ${i} sin ID o nombre de sede:`, Object.keys(sede));
                    filasInvalidas++;
                }
                
            } catch (error) {
                console.error(`❌ Error procesando fila ${i}:`, error);
                filasInvalidas++;
            }
        }
        
        console.log('✅ Parser de sedes completado:');
        console.log(`  📊 Filas válidas: ${filasValidas}`);
        console.log(`  ❌ Filas inválidas: ${filasInvalidas}`);
        console.log(`  🏢 Total sedes: ${sedes.length}`);
        
        // Mostrar ejemplo de la primera sede
        if (sedes.length > 0) {
            console.log('🏢 Primera sede de ejemplo:', sedes[0]);
        }
        
        return sedes;
        
    } catch (error) {
        console.error('❌ Error en parser de sedes:', error);
        return [];
    }
}

// Función para cargar y parsear sedes desde Google Sheets
async function loadSedesData() {
    console.log('🏢 Cargando datos específicos de SEDES...');
    
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=SEDES`;
        console.log('🔗 URL de sedes:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('📥 CSV de sedes recibido:', csvText.length, 'caracteres');
        
        const sedes = parseSedesCSV(csvText);
        console.log('✅ Sedes cargadas exitosamente:', sedes.length, 'registros');
        
        return sedes;
        
    } catch (error) {
        console.error('❌ Error cargando sedes:', error);
        
        // Retornar sedes de fallback en caso de error (estructura real)
        console.log('🔄 Usando sedes de fallback...');
        return [
            { 
                idSede: 'CAP_secu_tm_03', 
                nombreSede: 'Capital - Secundaria - Mañana', 
                departamento: 'Capital',
                nivelEducativo: 'Nivel Secundario',
                turno: 'Turno Mañana',
                numeroSede: '03',
                cue: '700111500',
                establecimiento: 'CONECTAR LAB',
                direccion: 'Las Heras Norte, Esquina José Alberdi',
                coordinador: 'Perez, Glenys'
            },
            { 
                idSede: 'CAP_secu_tt_04', 
                nombreSede: 'Capital - Secundaria - Tarde', 
                departamento: 'Capital',
                nivelEducativo: 'Nivel Secundario',
                turno: 'Turno Tarde',
                numeroSede: '04',
                cue: '700111500',
                establecimiento: 'CONECTAR LAB',
                direccion: 'Las Heras Norte, Esquina José Alberdi',
                coordinador: 'Bustamante Pereyra, Gerardo Emmanuel'
            },
            { 
                idSede: 'CHI_secu_tt_08', 
                nombreSede: 'Chimbas - Secundaria', 
                departamento: 'Chimbas',
                nivelEducativo: 'Nivel Secundario',
                turno: 'Turno Tarde',
                numeroSede: '08',
                cue: '700059300',
                establecimiento: 'COLEGIO SECUNDARIO JORGE LUIS BORGES',
                direccion: 'LOPEZ MANSILLA S/N , VILLA EL SALVADOR (J5413)',
                coordinador: 'Correa, Agustina Rosali'
            }
        ];
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
window.parseSedesCSV = parseSedesCSV;
window.loadSedesData = loadSedesData;
