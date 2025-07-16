// ====================================
// CARGADOR DE DATOS MODULAR
// ====================================

// Función principal para cargar datos usando parsers específicos
async function loadDataModular() {
    console.log('🔧 Iniciando carga modular de datos...');
    
    try {
        showLoadingSpinner(true);
        
        // Cargar cada categoría usando su parser específico
        console.log('🔄 Cargando datos por categorías...');
        
        const promesas = [
            loadAlumnosData().catch(err => {
                console.error('❌ Error en ALUMNOS:', err);
                return [];
            }),
            
            loadDocentesData().catch(err => {
                console.error('❌ Error en DOCENTES:', err);
                return [];
            }),
            
            // CARGA REAL DE GRUPOS ACTIVADA
            loadGruposData().catch(err => {
                console.error('❌ Error en GRUPOS:', err);
                return [];
            }),
            
            loadSedesData().catch(err => {
                console.error('❌ Error en SEDES:', err);
                // Sedes de fallback ya están en el parser
                return err.fallback || [];
            }),
            
            loadAsistenciasData().catch(err => {
                console.error('❌ Error en ASISTENCIAS:', err);
                return [];
            })
        ];
        
        const [alumnos, docentes, grupos, sedes, asistencias] = await Promise.all(promesas);
        
        console.log('✅ Datos cargados - Alumnos:', alumnos.length, '| Docentes:', docentes.length, '| Sedes:', sedes.length, '| Asistencias:', asistencias.length);
        
        // Asignar datos globales
        alumnosData = alumnos;
        docentesData = docentes;
        window.gruposData = grupos;
        window.sedesData = sedes;
        window.asistenciasData = asistencias;
        
        // Renderizar todo
        try {
            console.log('🎨 Renderizando dashboard...');
            renderDashboard();
        } catch (err) {
            console.error('❌ Error en renderDashboard:', err);
        }
        
        try {
            console.log('🎨 Renderizando alumnos...');
            renderAlumnos();
        } catch (err) {
            console.error('❌ Error en renderAlumnos:', err);
        }
        
        try {
            console.log('🎨 Renderizando sedes...');
            renderSedes();
        } catch (err) {
            console.error('❌ Error en renderSedes:', err);
        }
        
        try {
            console.log('🎨 Renderizando grupos...');
            renderGrupos();
        } catch (err) {
            console.error('❌ Error en renderGrupos:', err);
        }
        
        // TEMPORALMENTE COMENTADO - Solo renderizar alumnos, sedes y grupos por ahora
        // try {
        //     console.log('🎨 Renderizando docentes...');
        //     renderDocentes();
        // } catch (err) {
        //     console.error('❌ Error en renderDocentes:', err);
        // }
        
        showLoadingSpinner(false);
        
        // Actualizar filtros después de cargar nuevos datos
        if (typeof populateFilters === 'function') {
            populateFilters();
        }
        
        // Mostrar mensaje de éxito
        const totalRegistros = alumnos.length + docentes.length + grupos.length + sedes.length;
        showSuccessMessage(`✅ Datos cargados exitosamente: ${totalRegistros} registros totales`);
        
        console.log('✅ Carga modular completada exitosamente');
        
    } catch (error) {
        console.error('❌ Error en carga modular:', error);
        showLoadingSpinner(false);
        alert('Error al cargar los datos: ' + error.message);
    }
}

// Función para cargar solo una categoría específica
async function loadSingleCategory(categoria) {
    console.log(`🔄 Cargando categoría específica: ${categoria}`);
    
    try {
        showLoadingSpinner(true);
        
        let datos = [];
        
        switch (categoria.toLowerCase()) {
            case 'alumnos':
                datos = await loadAlumnosData();
                alumnosData = datos;
                renderAlumnos();
                break;
                
            case 'sedes':
                datos = await loadSedesData();
                window.sedesData = datos;
                renderSedes();
                break;
                
            case 'docentes':
                datos = await loadDocentesData();
                docentesData = datos;
                renderDocentes();
                break;
                
            case 'grupos':
                datos = await loadGruposData();
                window.gruposData = datos;
                renderGrupos();
                break;
                
            default:
                throw new Error(`Categoría no reconocida: ${categoria}`);
        }
        
        showLoadingSpinner(false);
        
        console.log(`✅ ${categoria} cargado exitosamente:`, datos.length, 'registros');
        showSuccessMessage(`${categoria} actualizado: ${datos.length} registros`);
        
        return datos;
        
    } catch (error) {
        console.error(`❌ Error cargando ${categoria}:`, error);
        showLoadingSpinner(false);
        alert(`Error al cargar ${categoria}: ${error.message}`);
        return [];
    }
}

// Función para cargar datos de asistencias
async function loadAsistenciasData() {
    try {
        console.log('🔄 Cargando datos de asistencias...');
        
        // Verificar que tenemos configuración de asistencias
        if (!window.sheetsConfig || !window.sheetsConfig.asistenciasSpreadsheetId) {
            console.warn('⚠️ No hay configuración de asistencias');
            return [];
        }
        
        const timestamp = new Date().getTime();
        
        // Construir URL para hoja de asistencias usando configuración
        const spreadsheetId = window.sheetsConfig.asistenciasSpreadsheetId;
        const sheetName = window.sheetsConfig.asistenciasSheet || 'D';
        let url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}&t=${timestamp}`;
        
        console.log(`🔗 URL de asistencias: ${url}`);
        
        let response = await fetch(url);
        
        // Si falla con gviz, intentar con export
        if (!response.ok) {
            console.log(`⚠️ gviz falló, intentando export para hoja ${sheetName}`);
            // Para export necesitamos el gid de la hoja
            // D = gid 3, E = gid 4
            const gidMap = { 'D': '3', 'E': '4' };
            const gid = gidMap[sheetName] || '3';
            url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}&t=${timestamp}`;
            console.log(`🔗 URL de export: ${url}`);
            response = await fetch(url);
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        if (!csvText || csvText.trim() === '') {
            throw new Error('CSV de asistencias vacío');
        }
        
        // Convertir CSV a array
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        const data = lines.map(line => {
            // Parsear CSV con manejo de comas dentro de comillas
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            
            return result.map(cell => cell.replace(/^"(.*)"$/, '$1'));
        });
        
        // Parsear con nuestro parser específico
        const asistencias = parseAsistenciasData(data);
        
        console.log('✅ Datos de asistencias cargados:', asistencias.length, 'registros');
        return asistencias;
        
    } catch (error) {
        console.error('❌ Error cargando asistencias:', error);
        return [];
    }
}

// Hacer disponibles las funciones globalmente
window.loadDataModular = loadDataModular;
window.loadSingleCategory = loadSingleCategory;

// Alias para compatibilidad
window.loadDataNew = loadDataModular;
