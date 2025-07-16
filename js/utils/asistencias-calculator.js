// ====================================
// CALCULADOR DE ASISTENCIAS
// ====================================

// Función principal para calcular porcentaje de asistencia de un alumno
function calcularPorcentajeAsistencia(alumno) {
    if (!window.asistenciasData || !alumno) {
        console.log('⚠️ Sin datos de asistencias o alumno inválido');
        return { porcentaje: 0, asistio: 0, debiaAsistir: 0, error: 'Sin datos' };
    }
    
    // Debug: mostrar datos disponibles
    console.log('🔍 Calculando asistencia para:', alumno.nombre, '| Total asistencias cargadas:', window.asistenciasData.length);
    
    // Buscar datos de asistencia del alumno por nombre completo
    const nombreCompleto = `${alumno.apellido || ''}, ${alumno.nombre || ''}`.trim();
    let asistenciaAlumno = window.asistenciasData.find(a => 
        a.alumno.toLowerCase() === nombreCompleto.toLowerCase()
    );
    
    console.log('🔍 Buscando:', nombreCompleto);
    
    // Si no encuentra por nombre completo, buscar por nombre solo
    if (!asistenciaAlumno) {
        const nombreSolo = alumno.nombre || '';
        asistenciaAlumno = window.asistenciasData.find(a => 
            a.alumno.toLowerCase().includes(nombreSolo.toLowerCase())
        );
        console.log('🔍 Buscando por nombre solo:', nombreSolo);
    }
    
    if (!asistenciaAlumno) {
        console.log('❌ No encontrado en asistencias');
        // Mostrar los primeros 3 nombres de asistencias para debug
        const ejemplos = window.asistenciasData.slice(0, 3).map(a => a.alumno);
        console.log('📋 Ejemplos en asistencias:', ejemplos);
        return { porcentaje: 0, asistio: 0, debiaAsistir: 0, error: 'No encontrado en asistencias' };
    }
    
    console.log('✅ Encontrado en asistencias:', asistenciaAlumno.alumno, '| Asistencias:', asistenciaAlumno.totalAsistencias);
    
    // Determinar qué días le corresponden según la sede
    const esCapital = alumno.sede && alumno.sede.toLowerCase().includes('capital');
    const diasQueCorresponden = esCapital ? [1, 3, 5] : [2, 4]; // Lun/Mie/Vie vs Mar/Jue
    
    // Obtener fecha de inscripción
    let fechaInscripcion = new Date();
    if (alumno.fechaDeInscripcion || alumno['Fecha de inscripcion']) {
        const fechaStr = alumno.fechaDeInscripcion || alumno['Fecha de inscripcion'];
        fechaInscripcion = parsearFechaAsistencia(fechaStr) || new Date();
    }
    
    // Calcular días que debía asistir desde inscripción hasta hoy
    const hoy = new Date();
    const diasDebiAsistir = calcularDiasCorrespondientes(fechaInscripcion, hoy, diasQueCorresponden);
    
    // Contar asistencias válidas (después de inscripción y hasta hoy)
    const asistenciasValidas = asistenciaAlumno.fechasAsistencia.filter(fecha => {
        return fecha >= fechaInscripcion && fecha <= hoy;
    }).length;
    
    const porcentaje = diasDebiAsistir > 0 ? Math.round((asistenciasValidas / diasDebiAsistir) * 100) : 0;
    
    return {
        porcentaje: porcentaje,
        asistio: asistenciasValidas,
        debiaAsistir: diasDebiAsistir,
        error: null
    };
}

// Función para calcular cuántos días correspondían en un rango de fechas
function calcularDiasCorrespondientes(fechaInicio, fechaFin, diasSemana) {
    let contador = 0;
    const fecha = new Date(fechaInicio);
    
    while (fecha <= fechaFin) {
        const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
        
        if (diasSemana.includes(diaSemana)) {
            contador++;
        }
        
        fecha.setDate(fecha.getDate() + 1);
    }
    
    return contador;
}

// Función para obtener la clase CSS según el porcentaje de asistencia
function obtenerClaseAsistencia(porcentaje) {
    if (porcentaje >= 80) return 'asistencia-alta';
    if (porcentaje >= 60) return 'asistencia-media';
    return 'asistencia-baja';
}

// Función para obtener el ícono según el porcentaje
function obtenerIconoAsistencia(porcentaje) {
    if (porcentaje >= 80) return 'fas fa-check-circle';
    if (porcentaje >= 60) return 'fas fa-exclamation-triangle';
    return 'fas fa-times-circle';
}

// Exponer funciones globalmente
window.calcularPorcentajeAsistencia = calcularPorcentajeAsistencia;
window.calcularDiasCorrespondientes = calcularDiasCorrespondientes;
window.obtenerClaseAsistencia = obtenerClaseAsistencia;
window.obtenerIconoAsistencia = obtenerIconoAsistencia;
