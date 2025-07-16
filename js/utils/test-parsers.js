// ====================================
// UTILIDADES PARA PRUEBAS MODULARES
// ====================================

// Función para probar un parser específico
async function testParser(categoria) {
    console.log(`🧪 Probando parser de ${categoria.toUpperCase()}...`);
    
    try {
        let resultado;
        
        switch (categoria.toLowerCase()) {
            case 'alumnos':
                resultado = await loadAlumnosData();
                break;
            case 'sedes':
                resultado = await loadSedesData();
                break;
            case 'docentes':
                resultado = await loadDocentesData();
                break;
            case 'grupos':
                resultado = await loadGruposData();
                break;
            default:
                console.error('❌ Categoría no reconocida:', categoria);
                return;
        }
        
        console.log(`✅ Parser de ${categoria} funcionando:`, resultado.length, 'registros');
        
        if (resultado.length > 0) {
            console.log(`📋 Primer registro de ${categoria}:`, resultado[0]);
        }
        
        return resultado;
        
    } catch (error) {
        console.error(`❌ Error en parser de ${categoria}:`, error);
        return [];
    }
}

// Función para probar todos los parsers
async function testAllParsers() {
    console.log('🧪 === PRUEBA DE TODOS LOS PARSERS ===');
    
    const categorias = ['alumnos', 'sedes', 'docentes', 'grupos'];
    const resultados = {};
    
    for (const categoria of categorias) {
        console.log(`\n🔄 Probando ${categoria}...`);
        resultados[categoria] = await testParser(categoria);
        
        // Pausa pequeña entre pruebas
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n📊 === RESUMEN DE PRUEBAS ===');
    for (const [categoria, datos] of Object.entries(resultados)) {
        console.log(`  ${categoria.toUpperCase()}: ${datos.length} registros`);
    }
    
    console.log('🧪 === FIN DE PRUEBAS ===');
    return resultados;
}

// Función para probar solo el parser que está funcionando (alumnos)
async function testAlumnosQuick() {
    console.log('🎓 Prueba rápida de alumnos...');
    
    try {
        const alumnos = await loadAlumnosData();
        console.log('✅ Alumnos cargados:', alumnos.length);
        
        if (alumnos.length > 0) {
            console.log('👤 Primer alumno:', alumnos[0]);
            console.log('🔑 Campos disponibles:', Object.keys(alumnos[0]));
        }
        
        return alumnos;
        
    } catch (error) {
        console.error('❌ Error en prueba de alumnos:', error);
        return [];
    }
}

// Hacer disponibles las funciones globalmente
window.testParser = testParser;
window.testAllParsers = testAllParsers;
window.testAlumnosQuick = testAlumnosQuick;
