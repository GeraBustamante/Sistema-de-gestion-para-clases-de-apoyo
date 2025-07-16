// ====================================
// RENDERIZADO DEL DASHBOARD
// ====================================

// Renderizar dashboard
function renderDashboard() {
    // Actualizar estadísticas
    document.getElementById('totalAlumnos').textContent = window.alumnosData.length;
    document.getElementById('totalDocentes').textContent = window.docentesData.length;
    document.getElementById('totalGrupos').textContent = window.gruposData.length;
    document.getElementById('totalSedes').textContent = window.sedesData.length;
    
    // Renderizar gráficos y tabla de carga
    renderCharts();
    renderGruposCarga();
}

// Renderizar gráficos
function renderCharts() {
    renderSedesChart();
    // renderAsistenciaChart(); // Reemplazado por tabla de carga de grupos
}

// Gráfico de distribución por sede
function renderSedesChart() {
    const canvas = document.getElementById('sedesChart');
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico existente si existe
    if (window.sedesChartInstance) {
        window.sedesChartInstance.destroy();
    }
    
    // Contar alumnos por sede
    const sedesCounts = {};
    window.alumnosData.forEach(alumno => {
        const sede = alumno.sede || 'Sin sede';
        sedesCounts[sede] = (sedesCounts[sede] || 0) + 1;
    });
    
    // Si no hay datos, mostrar mensaje
    if (Object.keys(sedesCounts).length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos disponibles', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    window.sedesChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(sedesCounts),
            datasets: [{
                data: Object.values(sedesCounts),
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f39c12',
                    '#e74c3c',
                    '#9b59b6',
                    '#1abc9c',
                    '#34495e'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Gráfico de asistencia
function renderAsistenciaChart() {
    const canvas = document.getElementById('asistenciaChart');
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico existente si existe
    if (window.asistenciaChartInstance) {
        window.asistenciaChartInstance.destroy();
    }
    
    // Procesar datos de asistencia
    const asistenciaRanges = {
        'Excelente (90-100%)': 0,
        'Buena (80-89%)': 0,
        'Regular (70-79%)': 0,
        'Baja (<70%)': 0
    };
    
    window.alumnosData.forEach(alumno => {
        let asistencia = alumno.porcentaje_asistencia || alumno['porcentaje de asistencia'] || '0';
        // Extraer número del porcentaje
        const numero = parseInt(asistencia.toString().replace('%', ''));
        
        if (numero >= 90) asistenciaRanges['Excelente (90-100%)']++;
        else if (numero >= 80) asistenciaRanges['Buena (80-89%)']++;
        else if (numero >= 70) asistenciaRanges['Regular (70-79%)']++;
        else asistenciaRanges['Baja (<70%)']++;
    });
    
    // Si no hay datos, mostrar mensaje
    if (window.alumnosData.length === 0) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos disponibles', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    window.asistenciaChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(asistenciaRanges),
            datasets: [{
                label: 'Cantidad de Alumnos',
                data: Object.values(asistenciaRanges),
                backgroundColor: ['#2ecc71', '#f39c12', '#e67e22', '#e74c3c'],
                borderColor: ['#27ae60', '#e67e22', '#d35400', '#c0392b'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Renderizar tabla de carga de grupos
function renderGruposCarga() {
    const container = document.getElementById('gruposCargaContainer');
    if (!container) return;
    
    // Debug: verificar datos
    debugGruposYSedes();
    
    if (!window.gruposData || window.gruposData.length === 0) {
        container.innerHTML = '<div class="loading-message">No hay datos de grupos disponibles</div>';
        return;
    }
    
    // Agrupar por departamento/sede
    const gruposPorSede = agruparGruposPorSede();
    
    // Crear tabla HTML
    let html = `
        <table class="grupos-carga-table">
            <tbody>
    `;
    
    // Generar filas por sede
    Object.keys(gruposPorSede).forEach(sede => {
        const grupos = gruposPorSede[sede];
        
        grupos.forEach((grupo, index) => {
            const porcentajeCarga = calcularPorcentajeCarga(grupo);
            const claseCarga = obtenerClaseCarga(porcentajeCarga);
            const departamento = extraerDepartamento(grupo.sede || sede);
            
            // Obtener valores seguros para cardinal y cupo_max
            const cardinal = parseInt(grupo.cardinal) || parseInt(grupo.Cardinal) || 0;
            const cupoMax = parseInt(grupo.cupo_max) || parseInt(grupo.cupoMax) || 0;
            
            html += `
                <tr ${index === 0 ? 'class="sede-group"' : ''}>
                    <td>
                        <div class="grupo-id">${grupo.idGrupo || grupo.id_grupo || 'N/A'}</div>
                    </td>
                    <td>
                        <span class="departamento-badge">${departamento}</span>
                    </td>
                    <td>
                        <span class="materia-tag">${grupo.materia || 'N/A'}</span>
                    </td>
                    <td>
                        <div class="docente-name">${grupo.docente || 'Sin asignar'}</div>
                    </td>
                    <td>
                        <div class="carga-progress">
                            <div class="carga-fill ${claseCarga}" style="width: ${porcentajeCarga}%">
                                <div class="carga-texto">${cardinal}/${cupoMax}</div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// Agrupar grupos por sede
function agruparGruposPorSede() {
    const agrupados = {};
    
    window.gruposData.forEach(grupo => {
        const sede = grupo.sede || 'Sin Sede';
        if (!agrupados[sede]) {
            agrupados[sede] = [];
        }
        agrupados[sede].push(grupo);
    });
    
    // Ordenar grupos dentro de cada sede
    Object.keys(agrupados).forEach(sede => {
        agrupados[sede].sort((a, b) => {
            const materiaA = a.materia || '';
            const materiaB = b.materia || '';
            return materiaA.localeCompare(materiaB);
        });
    });
    
    return agrupados;
}

// Calcular porcentaje de carga del grupo
function calcularPorcentajeCarga(grupo) {
    // Intentar diferentes nombres de campos que podrían existir
    const cardinal = parseInt(grupo.cardinal) || parseInt(grupo.Cardinal) || parseInt(grupo.alumnos_inscritos) || 0;
    const cupoMax = parseInt(grupo.cupo_max) || parseInt(grupo.cupoMax) || parseInt(grupo.cupo_maximo) || parseInt(grupo.capacidad) || 0;
    
    console.log(`Grupo ${grupo.idGrupo || grupo.id_grupo}: cardinal=${cardinal}, cupo_max=${cupoMax}`);
    
    if (cupoMax === 0) return 0;
    
    const porcentaje = Math.round((cardinal / cupoMax) * 100);
    return Math.min(porcentaje, 100); // Asegurar que no supere 100%
}

// Obtener clase CSS según el porcentaje de carga
function obtenerClaseCarga(porcentaje) {
    if (porcentaje >= 80) return 'alta';
    if (porcentaje >= 50) return 'media';
    return 'baja';
}

// Extraer departamento del nombre de la sede usando datos de SEDES
function extraerDepartamento(nombreSede) {
    if (!nombreSede || typeof nombreSede !== 'string') return 'N/A';
    
    // Buscar en los datos de sedes para encontrar el departamento correcto
    if (window.sedesData && window.sedesData.length > 0) {
        const sedeEncontrada = window.sedesData.find(sede => {
            // Comparar diferentes posibles campos de nombre de sede
            const nombresSede = [
                sede.nombreSede,
                sede.nombre_sede,
                sede.sede,
                sede.nombre
            ].filter(Boolean);
            
            return nombresSede.some(nombre => 
                nombre && nombre.toLowerCase().includes(nombreSede.toLowerCase()) ||
                nombreSede.toLowerCase().includes(nombre.toLowerCase())
            );
        });
        
        if (sedeEncontrada) {
            // Retornar el departamento de la hoja SEDES
            return sedeEncontrada.departamento || sedeEncontrada.Departamento || 'N/A';
        }
    }
    
    // Fallback: usar el nombre de la sede completo si no encontramos match
    return nombreSede;
}

// Función de debug para verificar datos
function debugGruposYSedes() {
    console.log('🔍 DEBUG: Verificando datos de grupos y sedes');
    
    if (window.gruposData && window.gruposData.length > 0) {
        console.log('📊 Grupos disponibles:', window.gruposData.length);
        console.log('📋 Primer grupo:', window.gruposData[0]);
        console.log('🔑 Campos del primer grupo:', Object.keys(window.gruposData[0]));
    } else {
        console.log('❌ No hay datos de grupos');
    }
    
    if (window.sedesData && window.sedesData.length > 0) {
        console.log('🏢 Sedes disponibles:', window.sedesData.length);
        console.log('📋 Primera sede:', window.sedesData[0]);
        console.log('🔑 Campos de la primera sede:', Object.keys(window.sedesData[0]));
    } else {
        console.log('❌ No hay datos de sedes');
    }
}
