// Script de debug específico para asistencias
console.clear();
console.log('🔧 INICIANDO DEBUG DE ASISTENCIAS');

// 1. Verificar que las funciones existen
console.log('1. Verificando funciones:');
console.log('   calcularPorcentajeAsistencia:', typeof calcularPorcentajeAsistencia);
console.log('   obtenerClaseAsistencia:', typeof obtenerClaseAsistencia);
console.log('   obtenerIconoAsistencia:', typeof obtenerIconoAsistencia);

// 2. Verificar datos de asistencias
console.log('2. Verificando datos de asistencias:');
console.log('   window.asistenciasData:', window.asistenciasData ? 'EXISTE' : 'NO EXISTE');
if (window.asistenciasData) {
    console.log('   Cantidad de registros:', window.asistenciasData.length);
    console.log('   Primer registro:', window.asistenciasData[0]);
} else {
    console.log('   ❌ NO HAY DATOS DE ASISTENCIAS');
}

// 3. Verificar datos de alumnos
console.log('3. Verificando datos de alumnos:');
console.log('   window.alumnosData:', window.alumnosData ? 'EXISTE' : 'NO EXISTE');
if (window.alumnosData && window.alumnosData.length > 0) {
    console.log('   Cantidad de alumnos:', window.alumnosData.length);
    console.log('   Primer alumno:', window.alumnosData[0]);
    
    // 4. Probar cálculo con el primer alumno
    if (typeof calcularPorcentajeAsistencia === 'function' && window.asistenciasData) {
        console.log('4. Probando cálculo con primer alumno:');
        const primerAlumno = window.alumnosData[0];
        console.log('   Alumno:', primerAlumno.nombre);
        const resultado = calcularPorcentajeAsistencia(primerAlumno);
        console.log('   Resultado:', resultado);
    }
} else {
    console.log('   ❌ NO HAY DATOS DE ALUMNOS');
}

// 5. Verificar configuración
console.log('5. Verificando configuración:');
console.log('   window.sheetsConfig:', window.sheetsConfig);
if (window.sheetsConfig) {
    console.log('   asistenciasSpreadsheetId:', window.sheetsConfig.asistenciasSpreadsheetId);
}

console.log('🔧 DEBUG COMPLETADO');
