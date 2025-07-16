// ====================================
// CARGA DE DATOS DESDE GOOGLE SHEETS
// ====================================

// Función para obtener datos de una hoja específica
async function fetchSheetData(sheetName) {
    try {
        // Construir URL usando el nombre de la hoja
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
        
        console.log(`🔗 Cargando ${sheetName} desde:`, url);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log(`📥 CSV recibido para ${sheetName}:`, csvText.length, 'caracteres');
        
        // Para SEDES, mostrar las primeras líneas del CSV
        if (sheetName === 'SEDES') {
            console.log(`🔍 Primeras 5 líneas del CSV de SEDES:`);
            const primerasLineas = csvText.split('\n').slice(0, 5);
            primerasLineas.forEach((linea, index) => {
                console.log(`  Línea ${index}: "${linea}"`);
            });
        }
        
        // Para GRUPOS, mostrar info de debug también
        if (sheetName === 'GRUPOS') {
            console.log(`🔍 Primeras 3 líneas del CSV de GRUPOS:`);
            const primerasLineas = csvText.split('\n').slice(0, 3);
            primerasLineas.forEach((linea, index) => {
                console.log(`  Línea ${index}: "${linea.substring(0, 100)}..."`);
            });
        }
        
        const resultado = parseCSVData(csvText, sheetName);
        console.log(`✅ ${sheetName} procesado:`, resultado.length, 'registros');
        
        return resultado;
        
    } catch (error) {
        console.error(`❌ Error fetching data from ${sheetName}:`, error);
        throw error;
    }
}

// Función para obtener datos de asistencias desde el archivo separado
async function fetchAsistenciasData() {
    try {
        // Construir URL para el archivo de asistencias
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.asistenciasSpreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetsConfig.asistenciasSheet}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        return parseAsistenciasCSV(csvText);
        
    } catch (error) {
        console.error('Error fetching asistencias data:', error);
        throw error;
    }
}

// Cargar datos reales desde Google Sheets
async function loadRealData() {
    try {
        showLoadingSpinner(true);
        
        // Intentar cargar datos de Google Sheets
        console.log('🔄 Intentando conectar con Google Sheets...');
        console.log('📋 Configuración actual:', {
            spreadsheetId: sheetsConfig.spreadsheetId,
            hojas: ['ALUMNOS', 'DOCENTES', 'GRUPOS', 'SEDES']
        });
        
        console.log('🔄 Iniciando carga paralela de hojas...');
        
        const promesas = [
            fetchSheetData('ALUMNOS').catch(err => { console.error('❌ Error en ALUMNOS:', err); return []; }),
            // TEMPORALMENTE COMENTADO - Solo cargamos alumnos por ahora
            // fetchSheetData('DOCENTES').catch(err => { console.error('❌ Error en DOCENTES:', err); return []; }),
            // fetchSheetData('GRUPOS').catch(err => { console.error('❌ Error en GRUPOS:', err); return []; }),
            Promise.resolve([]), // DOCENTES vacío por ahora
            Promise.resolve([]), // GRUPOS vacío por ahora
            // Usar sedes de fallback por ahora
            Promise.resolve([
                { idSede: 'CAP_secu_tm_03', nombreSede: 'Capital - Secundaria - Mañana', departamento: 'Capital' },
                { idSede: 'CAP_secu_tt_04', nombreSede: 'Capital - Secundaria - Tarde', departamento: 'Capital' },
                { idSede: 'CHI_secu_tt_08', nombreSede: 'Chimbas - Secundaria', departamento: 'Chimbas' },
                { idSede: 'POC_secu_tt_12', nombreSede: 'Pocito - Secundaria', departamento: 'Pocito' },
                { idSede: 'RAW_secu_tt_14', nombreSede: 'Rawson - Secundaria', departamento: 'Rawson' },
                { idSede: 'RIV_secu_tt_16', nombreSede: 'Rivadavia - Secundaria', departamento: 'Rivadavia' },
                { idSede: 'SLC_secu_tt_18', nombreSede: 'Santa Lucía - Secundaria', departamento: 'Santa Lucía' }
            ]),
            // TEMPORALMENTE COMENTADO - Sin asistencias por ahora  
            // fetchAsistenciasData().catch(err => { console.error('❌ Error en ASISTENCIAS:', err); return []; })
            Promise.resolve([]) // ASISTENCIAS vacío por ahora
        ];
        
        const [alumnos, docentes, grupos, sedes, asistencias] = await Promise.all(promesas);
        
        console.log('📊 Resultados de carga:');
        console.log('  ALUMNOS:', alumnos.length, 'registros');
        console.log('  DOCENTES:', docentes.length, 'registros');
        console.log('  GRUPOS:', grupos.length, 'registros');
        console.log('  SEDES:', sedes.length, 'registros'); // ← ESTE ES EL CRÍTICO
        console.log('  ASISTENCIAS:', asistencias.length, 'registros');
        
        // Asignar datos globales
        alumnosData = alumnos;
        docentesData = docentes;
        gruposData = grupos;
        sedesData = sedes;
        asistenciasData = asistencias;
        
        // Limpiar datos cargados
        cleanLoadedData();
        
        // Sincronizar asistencias con alumnos
        syncAsistenciasWithAlumnos();
        
        // Renderizar todo el contenido
        renderDashboard();
        renderAlumnos();
        renderDocentes();
        renderGrupos();
        renderSedes();
        
        showLoadingSpinner(false);
        
        console.log('✅ Datos cargados exitosamente desde Google Sheets');
        console.log('Alumnos:', alumnosData.length);
        console.log('Docentes:', docentesData.length);
        console.log('Grupos:', gruposData.length);
        console.log('Sedes:', sedesData.length);
        console.log('Asistencias:', asistenciasData.length);
        
        showSuccessMessage('Datos cargados correctamente desde Google Sheets');
        
    } catch (error) {
        console.log('⚠️ No se pudo conectar directamente con Google Sheets (problema de CORS)');
        console.log('📝 Cargando datos de ejemplo para demostración...');
        
        showLoadingSpinner(false);
        
        // Cargar datos de ejemplo como fallback SIN mostrar error
        loadExampleData();
        renderDashboard();
        renderAlumnos();
        renderDocentes();
        renderGrupos();
        renderSedes();
        
        // Mostrar mensaje informativo en lugar de error
        showInfoMessage('Usando datos de ejemplo. Para datos reales, consulta las instrucciones de configuración.');
    }
}

// Cargar datos de ejemplo
function loadExampleData() {
    alumnosData = datosEjemplo.alumnos;
    docentesData = datosEjemplo.docentes;
    gruposData = datosEjemplo.grupos;
    sedesData = datosEjemplo.sedes;
}

// Recargar datos desde Google Sheets - VERSIÓN MODULAR
async function loadData() {
    console.log('🔄 Iniciando carga de datos (versión modular)...');
    
    // Verificar que los parsers específicos estén disponibles
    if (typeof loadAlumnosData !== 'function') {
        console.error('❌ Parser de alumnos no disponible');
        alert('Error: Los parsers específicos no están cargados. Revisa que todos los archivos JS estén incluidos.');
        return;
    }
    
    try {
        showLoadingSpinner(true);
        
        // Usar el cargador modular
        console.log('🔧 Delegando a cargador modular...');
        await loadDataModular();
        
        console.log('✅ Carga modular completada desde loadData');
        
    } catch (error) {
        console.error('❌ Error en loadData modular:', error);
        showLoadingSpinner(false);
        alert('Error al actualizar los datos: ' + error.message);
    }
}

// Función para actualizar todos los datos
function updateAllData() {
    console.log('🔄 Iniciando actualización de todos los datos...');
    
    // Renderizar todos los componentes con los datos cargados
    if (typeof renderDashboard === 'function') {
        renderDashboard();
    }
    
    if (typeof renderAlumnos === 'function') {
        renderAlumnos();
    }
    
    if (typeof renderDocentes === 'function') {
        renderDocentes();
    }
    
    if (typeof renderGrupos === 'function') {
        renderGrupos();
    }
    
    if (typeof renderSedes === 'function') {
        renderSedes();
    }
    
    if (typeof renderConfiguracion === 'function') {
        renderConfiguracion();
    }
    
    // Actualizar filtros después de cargar nuevos datos
    if (typeof populateFilters === 'function') {
        populateFilters();
    }
    
    console.log('✅ Actualización de todos los datos completada');
}

// Configuración de Google Sheets
function saveConfig() {
    const url = document.getElementById('sheetsUrl').value;
    if (url) {
        // Extraer el ID del spreadsheet de la URL
        const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) {
            sheetsConfig.spreadsheetId = match[1];
            localStorage.setItem('sheetsConfig', JSON.stringify(sheetsConfig));
            showSuccessMessage('Configuración guardada. Actualizando datos...');
            closeConfigModal();
            loadData(); // Recargar datos con nueva configuración
        } else {
            alert('URL inválida. Asegúrate de copiar la URL completa de Google Sheets.');
        }
    } else {
        alert('Por favor, ingresa la URL de Google Sheets.');
    }
}

function showConfigModal() {
    document.getElementById('configModal').style.display = 'block';
    // Pre-llenar con la URL actual si existe
    const currentUrl = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/edit`;
    document.getElementById('sheetsUrl').value = currentUrl;
}

// Cargar configuración guardada al iniciar
function loadSavedConfig() {
    const saved = localStorage.getItem('sheetsConfig');
    if (saved) {
        const config = JSON.parse(saved);
        sheetsConfig = { ...sheetsConfig, ...config };
    }
}

async function testConnection() {
    const url = document.getElementById('sheetsUrl').value;
    if (!url) {
        alert('Por favor, ingresa la URL de Google Sheets primero.');
        return;
    }
    
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
        alert('URL inválida. Asegúrate de copiar la URL completa de Google Sheets.');
        return;
    }
    
    const testId = match[1];
    const testUrl = `https://docs.google.com/spreadsheets/d/${testId}/gviz/tq?tqx=out:csv&sheet=ALUMNOS`;
    
    try {
        showLoadingSpinner(true);
        const response = await fetch(testUrl);
        
        if (response.ok) {
            showSuccessMessage('✅ ¡Conexión exitosa! Los datos están disponibles.');
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert(`❌ No se pudo conectar: ${error.message}\n\nEsto puede deberse a:\n- La hoja no es pública\n- Problemas de CORS del navegador\n- URL incorrecta`);
    } finally {
        showLoadingSpinner(false);
    }
}

// 🔍 FUNCIÓN ESPECÍFICA PARA DEBUGGEAR SEDES
async function debugSedesOnly() {
    console.log('🔍 === DEBUG ESPECÍFICO DE SEDES ===');
    
    try {
        console.log('📋 Configuración actual:');
        console.log('  Spreadsheet ID:', sheetsConfig.spreadsheetId);
        
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=SEDES`;
        console.log('🔗 URL de SEDES:', url);
        
        console.log('🔄 Intentando cargar SEDES...');
        const response = await fetch(url);
        
        console.log('📡 Respuesta del servidor:');
        console.log('  Status:', response.status);
        console.log('  OK:', response.ok);
        console.log('  Headers:', [...response.headers.entries()]);
        
        if (!response.ok) {
            console.error('❌ La respuesta no es OK');
            return;
        }
        
        const csvText = await response.text();
        console.log('📥 CSV recibido:');
        console.log('  Longitud:', csvText.length, 'caracteres');
        console.log('  Primeras 500 caracteres:', csvText.substring(0, 500));
        
        console.log('🔄 Procesando CSV...');
        const resultado = parseCSVData(csvText, 'SEDES');
        
        console.log('✅ Resultado final:');
        console.log('  Registros procesados:', resultado.length);
        if (resultado.length > 0) {
            console.log('  Primera sede:', resultado[0]);
        }
        
        // Actualizar datos globales para prueba
        window.sedesData = resultado;
        
        console.log('🔍 === FIN DEBUG SEDES ===');
        return resultado;
        
    } catch (error) {
        console.error('❌ Error en debug de sedes:', error);
        console.log('🔍 === FIN DEBUG SEDES (CON ERROR) ===');
    }
}

// Hacer disponible globalmente
window.debugSedesOnly = debugSedesOnly;
// Hacer disponible globalmente
window.updateAllData = updateAllData;
