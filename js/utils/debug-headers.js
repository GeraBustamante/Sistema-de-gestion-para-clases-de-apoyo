// ====================================
// HERRAMIENTA DE DEBUG PARA HEADERS
// ====================================

// Función específica para debuggear headers de alumnos
async function debugAlumnosHeaders() {
    console.log('🔍 === DEBUG DE HEADERS DE ALUMNOS ===');
    
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=ALUMNOS`;
        console.log('🔗 URL:', url);
        
        const response = await fetch(url);
        const csvText = await response.text();
        
        console.log('📥 CSV recibido:', csvText.length, 'caracteres');
        
        // Usar el parser robusto para obtener filas
        const filas = parseCSVText(csvText);
        
        if (filas.length > 0) {
            const headers = filas[0];
            
            console.log('📋 TOTAL DE HEADERS:', headers.length);
            console.log('🔍 LISTA COMPLETA DE HEADERS:');
            
            headers.forEach((header, index) => {
                const headerLimpio = header.toLowerCase().trim();
                console.log(`${index.toString().padStart(2, '0')}: "${header}" → normalizado: "${headerLimpio}"`);
            });
            
            // Buscar específicamente los campos que necesitamos
            console.log('\n🎯 CAMPOS ESPECÍFICOS QUE BUSCAMOS:');
            const camposBuscados = ['tutor', 'nivel', 'grupo', 'año', 'estado'];
            
            camposBuscados.forEach(campo => {
                const encontrados = headers.filter((header, index) => {
                    const headerLimpio = header.toLowerCase().trim();
                    return headerLimpio.includes(campo);
                }).map((header, index) => {
                    const originalIndex = headers.indexOf(header);
                    return `índice ${originalIndex}: "${header}"`;
                });
                
                console.log(`  ${campo}: ${encontrados.length > 0 ? encontrados.join(', ') : 'NO ENCONTRADO'}`);
            });
            
            // Mostrar algunos datos de ejemplo
            if (filas.length > 1) {
                console.log('\n👤 PRIMER ALUMNO DE EJEMPLO:');
                const primerAlumno = filas[1];
                headers.forEach((header, index) => {
                    if (index < primerAlumno.length) {
                        const valor = primerAlumno[index];
                        if (valor && valor.trim() && valor !== 'N/A') {
                            console.log(`  ${header}: "${valor}"`);
                        }
                    }
                });
            }
        }
        
        console.log('🔍 === FIN DEBUG HEADERS ===');
        return filas;
        
    } catch (error) {
        console.error('❌ Error en debug de headers:', error);
    }
}

// Función específica para debuggear headers de docentes
async function debugDocentesHeaders() {
    console.log('👨‍🏫 === DEBUG DE HEADERS DE DOCENTES ===');
    
    try {
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=DOCENTES`;
        console.log('🔗 URL:', url);
        
        const response = await fetch(url);
        const csvText = await response.text();
        
        console.log('📥 CSV recibido:', csvText.length, 'caracteres');
        
        // Usar el parser robusto para obtener filas
        const filas = parseCSVText(csvText);
        
        if (filas.length > 0) {
            const headers = filas[0];
            
            console.log('📋 TOTAL DE HEADERS:', headers.length);
            console.log('🔍 LISTA COMPLETA DE HEADERS:');
            
            headers.forEach((header, index) => {
                const headerLimpio = header.toLowerCase().trim();
                console.log(`${index.toString().padStart(2, '0')}: "${header}" → normalizado: "${headerLimpio}"`);
            });
            
            // Buscar específicamente los campos que necesitamos para docentes
            console.log('\n🎯 CAMPOS ESPECÍFICOS QUE BUSCAMOS:');
            const camposBuscados = ['dni', 'nombre', 'apellido', 'email', 'especialidad', 'materia', 'sede', 'turno'];
            
            camposBuscados.forEach(campo => {
                const encontrados = headers.filter((header, index) => {
                    const headerLimpio = header.toLowerCase().trim();
                    return headerLimpio.includes(campo);
                }).map((header, index) => {
                    const originalIndex = headers.indexOf(header);
                    return `índice ${originalIndex}: "${header}"`;
                });
                
                console.log(`  ${campo}: ${encontrados.length > 0 ? encontrados.join(', ') : 'NO ENCONTRADO'}`);
            });
            
            // Mostrar algunos datos de ejemplo
            if (filas.length > 1) {
                console.log('\n👨‍🏫 PRIMER DOCENTE DE EJEMPLO:');
                headers.forEach((header, index) => {
                    const valor = filas[1][index] || '';
                    if (valor) {
                        console.log(`  ${header}: "${valor}"`);
                    }
                });
            }
            
        } else {
            console.warn('⚠️ No se encontraron filas en el CSV de docentes');
        }
        
    } catch (error) {
        console.error('❌ Error en debug de docentes:', error);
    }
}

// Hacer disponible globalmente
window.debugAlumnosHeaders = debugAlumnosHeaders;
window.debugDocentesHeaders = debugDocentesHeaders;
