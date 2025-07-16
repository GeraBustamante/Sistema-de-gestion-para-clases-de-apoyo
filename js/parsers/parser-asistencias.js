// ====================================
// PARSER PARA DATOS DE ASISTENCIAS
// ====================================

// Función para parsear datos de asistencias desde la hoja "E"
function parseAsistenciasData(rawData) {
    console.log('🔄 Parseando datos de asistencias...');
    
    if (!rawData || rawData.length < 2) {
        console.warn('⚠️ Datos de asistencias insuficientes');
        return [];
    }
    
    const headers = rawData[0];
    const alumnoIndex = headers.findIndex(h => h && h.toLowerCase().includes('alumno'));
    const diasIndex = headers.findIndex(h => h && h.toLowerCase().includes('diasqueasistio'));
    
    if (alumnoIndex === -1 || diasIndex === -1) {
        console.error('❌ No se encontraron las columnas necesarias en asistencias');
        console.log('Headers encontrados:', headers);
        return [];
    }
    
    const asistencias = [];
    
    for (let i = 1; i < rawData.length; i++) {
        const row = rawData[i];
        if (!row || row.length === 0) continue;
        
        const alumno = row[alumnoIndex];
        const diasStr = row[diasIndex];
        
        if (!alumno) continue;
        
        // Parsear las fechas de asistencia
        const fechasAsistencia = [];
        if (diasStr && diasStr.trim()) {
            const fechasArray = diasStr.split(',').map(f => f.trim());
            fechasArray.forEach(fechaStr => {
                if (fechaStr) {
                    // Convertir formato dd-mm-yyyy a Date
                    const fecha = parsearFechaAsistencia(fechaStr);
                    if (fecha) {
                        fechasAsistencia.push(fecha);
                    }
                }
            });
        }
        
        asistencias.push({
            alumno: alumno.trim(),
            fechasAsistencia: fechasAsistencia,
            totalAsistencias: fechasAsistencia.length
        });
    }
    
    console.log('✅ Asistencias parseadas:', asistencias.length, 'alumnos');
    return asistencias;
}

// Función para parsear fecha en formato dd-mm-yyyy
function parsearFechaAsistencia(fechaStr) {
    if (!fechaStr || !fechaStr.includes('-')) return null;
    
    const partes = fechaStr.split('-');
    if (partes.length !== 3) return null;
    
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Los meses en Date van de 0-11
    const año = parseInt(partes[2]);
    
    if (isNaN(dia) || isNaN(mes) || isNaN(año)) return null;
    
    return new Date(año, mes, dia);
}

// Exponer funciones globalmente
window.parseAsistenciasData = parseAsistenciasData;
window.parsearFechaAsistencia = parsearFechaAsistencia;
