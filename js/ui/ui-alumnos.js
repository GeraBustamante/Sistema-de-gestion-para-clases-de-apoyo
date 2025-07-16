// ====================================
// GESTIÓN DE LA SECCIÓN ALUMNOS
// ====================================

// Variable para controlar el tipo de vista
let currentView = 'cards'; // 'cards' o 'table'

// Variables para control de ordenamiento y filtros
let currentSort = 'original';
window.currentFilters = {
    search: '',
    sede: '',
    nivel: '',
    estado: 'Activo' // Por defecto solo mostrar activos
};
let originalAlumnosOrder = [];
// Nota: filteredAlumnosData ahora se usa como window.filteredAlumnosData

// Renderizar vista de alumnos
function renderAlumnos() {
    // Poblar filtros
    populateFilters();
    
    // Aplicar filtro por defecto de "Activos" si no hay filtros aplicados
    setTimeout(() => {
        const estadoFilter = document.getElementById('filterEstado');
        if (estadoFilter && estadoFilter.value === 'Activo') {
            filterAlumnos(); // Aplicar filtro inicial
        }
    }, 100);
    
    if (currentView === 'cards') {
        renderAlumnosCards();
    } else {
        renderAlumnosTable();
    }
}

// Cambiar entre vista de cards y tabla manteniendo filtros y ordenamiento
function switchView(viewType) {
    currentView = viewType;
    
    const cardView = document.getElementById('cardView');
    const tableView = document.getElementById('tableView');
    const cardsContainer = document.getElementById('alumnosCards');
    const tableContainer = document.getElementById('alumnosTableContainer');
    
    if (viewType === 'cards') {
        cardView.classList.add('active');
        tableView.classList.remove('active');
        cardsContainer.style.display = 'grid';
        tableContainer.style.display = 'none';
    } else {
        tableView.classList.add('active');
        cardView.classList.remove('active');
        cardsContainer.style.display = 'none';
        tableContainer.style.display = 'block';
    }
    
    // Renderizar manteniendo el estado actual (filtros y ordenamiento)
    renderCurrentState();
}

// Función para renderizar el estado actual (con filtros y ordenamiento aplicados)
function renderCurrentState() {
    console.log('🔄 Renderizando estado actual...');
    
    // Verificar si hay filtros activos
    const hasActiveFilters = (
        (window.currentFilters.search && window.currentFilters.search.trim()) ||
        (window.currentFilters.sede && window.currentFilters.sede.trim()) ||
        (window.currentFilters.nivel && window.currentFilters.nivel.trim()) ||
        (window.currentFilters.estado && window.currentFilters.estado.trim())
    );
    
    let dataToRender;
    
    if (hasActiveFilters && window.filteredAlumnosData && window.filteredAlumnosData.length >= 0) {
        // Usar datos filtrados
        console.log('📋 Usando datos filtrados:', window.filteredAlumnosData.length, 'registros');
        dataToRender = [...window.filteredAlumnosData];
    } else {
        // Usar todos los datos
        console.log('📋 Usando todos los datos:', window.alumnosData.length, 'registros');
        dataToRender = [...window.alumnosData];
    }
    
    // Aplicar ordenamiento actual si no es el original
    if (currentSort && currentSort !== 'original') {
        console.log('🔄 Aplicando ordenamiento:', currentSort);
        dataToRender = applySortToData(dataToRender, currentSort);
    }
    
    // Renderizar en la vista actual
    renderAlumnosWithData(dataToRender);
    
    console.log('✅ Estado renderizado - Vista:', currentView, '| Datos:', dataToRender.length, '| Filtros activos:', hasActiveFilters, '| Ordenamiento:', currentSort);
}

// Función para aplicar ordenamiento a cualquier conjunto de datos
function applySortToData(data, sortType) {
    let sortedData = [...data];
    
    switch (sortType) {
        case 'alfabetico':
            sortedData = sortedData.sort((a, b) => {
                const nombreA = `${a.apellido || ''} ${a.nombre || ''}`.trim().toLowerCase();
                const nombreB = `${b.apellido || ''} ${b.nombre || ''}`.trim().toLowerCase();
                return nombreA.localeCompare(nombreB);
            });
            break;
        case 'sede':
            sortedData = sortedData.sort((a, b) => {
                const sedeA = (a.sede || '').toLowerCase();
                const sedeB = (b.sede || '').toLowerCase();
                if (sedeA !== sedeB) return sedeA.localeCompare(sedeB);
                const nombreA = `${a.apellido || ''} ${a.nombre || ''}`.trim().toLowerCase();
                const nombreB = `${b.apellido || ''} ${b.nombre || ''}`.trim().toLowerCase();
                return nombreA.localeCompare(nombreB);
            });
            break;
        case 'grupo':
            sortedData = sortedData.sort((a, b) => {
                const grupoA = (a.grupo || '').toLowerCase();
                const grupoB = (b.grupo || '').toLowerCase();
                if (grupoA !== grupoB) return grupoA.localeCompare(grupoB);
                const docenteA = (a.docente || '').toLowerCase();
                const docenteB = (b.docente || '').toLowerCase();
                if (docenteA !== docenteB) return docenteA.localeCompare(docenteB);
                const nombreA = `${a.apellido || ''} ${a.nombre || ''}`.trim().toLowerCase();
                const nombreB = `${b.apellido || ''} ${b.nombre || ''}`.trim().toLowerCase();
                return nombreA.localeCompare(nombreB);
            });
            break;
        default: // 'original'
            sortedData = sortedData.sort((a, b) => (a.ordenOriginal || 0) - (b.ordenOriginal || 0));
    }
    
    return sortedData;
}

// Renderizar vista de cards
function renderAlumnosCards() {
    const container = document.getElementById('alumnosCards');
    container.innerHTML = '';
    
    alumnosData.forEach((alumno, index) => {
        const card = createAlumnoCard(alumno, index);
        container.appendChild(card);
    });
}

// Crear card de alumno
function createAlumnoCard(alumno, index) {
    const card = document.createElement('div');
    card.className = 'alumno-card';
    
    // Datos del alumno
    const dni = alumno.dni || 'N/A';
    const nombre = alumno.nombre || 'N/A';
    const edad = alumno.edad || 'N/A';
    const tutor = alumno.tutor || 'N/A';
    const nivel = alumno.nivel || 'N/A';
    const año = alumno.año || '';
    const sede = alumno.sede || 'N/A';
    const grupo = alumno.grupo || 'N/A';
    const docente = alumno.docente || 'N/A';
    const estado = alumno.estado || 'Activo';
    const telefono = alumno.telefono || 'N/A';
    const residencia = alumno.residencia || 'N/A';
    const asignatura = alumno.asignatura || 'N/A';
    
    // Calcular asistencia
    let asistenciaData = { porcentaje: 0, asistio: 0, debiaAsistir: 0 };
    let claseAsistencia = 'asistencia-baja';
    let iconoAsistencia = 'fas fa-times-circle';
    
    if (typeof calcularPorcentajeAsistencia === 'function') {
        asistenciaData = calcularPorcentajeAsistencia(alumno);
        claseAsistencia = obtenerClaseAsistencia(asistenciaData.porcentaje);
        iconoAsistencia = obtenerIconoAsistencia(asistenciaData.porcentaje);
    } else {
        console.warn('⚠️ calcularPorcentajeAsistencia no está disponible en tarjetas');
    }
    
    // Formatear nivel completo
    let nivelCompleto = nivel;
    if (año && año !== 'N/A' && año.toString().trim()) {
        nivelCompleto = `${nivel} - ${año}`;
    }
    
    // Determinar clase de estado
    const estadoClass = estado.toLowerCase() === 'activo' ? 'status-activo' : 'status-inactivo';
    
    card.innerHTML = `
        <div class="alumno-card-header">
            <h3>${nombre}</h3>
            <div class="dni">DNI: ${dni}</div>
            <div class="alumno-status ${estadoClass}">${estado}</div>
        </div>
        <div class="alumno-card-body">
            <!-- Información Personal -->
            <div class="alumno-section">
                <div class="section-title">
                    <i class="fas fa-user"></i>
                    Información Personal
                </div>
                <div class="alumno-info-grid">
                    <div class="alumno-info-item">
                        <div class="alumno-info-label">Edad</div>
                        <div class="alumno-info-value">${edad} años</div>
                    </div>
                    <div class="alumno-info-item">
                        <div class="alumno-info-label">Residencia</div>
                        <div class="alumno-info-value">${residencia}</div>
                    </div>
                    <div class="alumno-info-item">
                        <div class="alumno-info-label">Teléfono</div>
                        <div class="alumno-info-value">${telefono}</div>
                    </div>
                    <div class="alumno-info-item">
                        <div class="alumno-info-label">Tutor</div>
                        <div class="alumno-info-value highlight">${tutor}</div>
                    </div>
                </div>
            </div>
            
            <!-- Información Académica -->
            <div class="alumno-section">
                <div class="section-title">
                    <i class="fas fa-graduation-cap"></i>
                    Información Académica
                </div>
                <div class="alumno-info-grid">
                    <div class="alumno-info-item">
                        <div class="alumno-info-label">Nivel</div>
                        <div class="alumno-info-value highlight">${nivelCompleto}</div>
                    </div>
                    <div class="alumno-info-item">
                        <div class="alumno-info-label">Sede</div>
                        <div class="alumno-info-value">${sede}</div>
                    </div>
                    <div class="alumno-info-item">
                        <div class="alumno-info-label">Grupo</div>
                        <div class="alumno-info-value">${grupo}</div>
                    </div>
                    <div class="alumno-info-item">
                        <div class="alumno-info-label">Asignatura</div>
                        <div class="alumno-info-value">${asignatura}</div>
                    </div>
                </div>
            </div>
            
            <!-- Docente -->
            <div class="alumno-section">
                <div class="section-title">
                    <i class="fas fa-chalkboard-teacher"></i>
                    Docente a Cargo
                </div>
                <div class="alumno-info-item">
                    <div class="alumno-info-value highlight">${docente}</div>
                </div>
            </div>
        </div>
        <div class="alumno-card-actions">
            <div class="asistencia-info">
                <div class="asistencia-badge ${claseAsistencia}">
                    <i class="${iconoAsistencia}"></i>
                    ${asistenciaData.porcentaje}%
                </div>
                <div class="asistencia-detalle">
                    ${asistenciaData.asistio}/${asistenciaData.debiaAsistir} clases
                </div>
            </div>
            <button onclick="verDetalleAlumno(${index})" class="btn-small">
                <i class="fas fa-eye"></i> Ver Detalle
            </button>
        </div>
    `;
    
    return card;
}

// Renderizar tabla de alumnos (función original)
function renderAlumnosTable() {
    const tbody = document.querySelector('#alumnosTable tbody');
    tbody.innerHTML = '';
    
    alumnosData.forEach(alumno => {
        const row = createAlumnoRow(alumno);
        tbody.appendChild(row);
    });
}

// Crear fila de alumno
function createAlumnoRow(alumno) {
    const row = document.createElement('tr');
    
    // Usar los campos CORRECTOS según el mapeo actualizado
    const dni = alumno.dni || 'N/A';
    const nombre = alumno.nombre || 'N/A';
    const edad = alumno.edad || 'N/A';
    const tutor = alumno.tutor || 'N/A';  // ✅ Ahora mapea correctamente a "nombre tutor"
    
    // Formatear nivel
    let nivel = alumno.nivel || 'N/A';  // ✅ Ahora mapea correctamente a "nivel educativo"
    
    // Agregar año si existe
    const año = alumno.año || '';  // ✅ Ahora mapea correctamente a "año"
    if (año && año !== 'N/A' && año.toString().trim()) {
        nivel = `${nivel} - ${año}`;
    }
    
    const sede = alumno.sede || 'N/A';
    const grupo = alumno.grupo || 'N/A';  // ✅ Ahora mapea correctamente a "Grupo A"
    const estado = alumno.estado || 'Activo';  // ✅ Ahora mapea correctamente a "Estado"
    
    // Calcular asistencia
    let asistenciaData = { porcentaje: 0, asistio: 0, debiaAsistir: 0 };
    let claseAsistencia = 'asistencia-baja';
    let iconoAsistencia = 'fas fa-times-circle';
    
    if (typeof calcularPorcentajeAsistencia === 'function') {
        asistenciaData = calcularPorcentajeAsistencia(alumno);
        claseAsistencia = obtenerClaseAsistencia(asistenciaData.porcentaje);
        iconoAsistencia = obtenerIconoAsistencia(asistenciaData.porcentaje);
    } else {
        console.warn('⚠️ calcularPorcentajeAsistencia no está disponible en tabla');
    }
    
    const statusBadge = getStatusBadge(estado);
    
    // Obtener criterio de asistencia y detalles
    const asistenciasDetalle = alumno.asistencias_detalle || {};
    const criterio = asistenciasDetalle.criterio || 'Sin datos';
    const totalClases = alumno.total_clases || 0;
    const clasesAsistidas = alumno.cantidad_asistencias || 0;
    const tieneAsistencias = asistenciasDetalle.nombre_alumno ? true : false;
    
    const asistenciaIndicator = tieneAsistencias ? 'with-data' : 'no-data';
    const tooltipText = tieneAsistencias ? 
        `${criterio} | ${clasesAsistidas}/${totalClases} clases` : 
        'Sin datos de asistencia';
    
    row.innerHTML = `
        <td>${dni}</td>
        <td><strong>${nombre}</strong></td>
        <td>${edad}</td>
        <td>${tutor}</td>
        <td>${nivel}</td>
        <td>${sede}</td>
        <td>${grupo}</td>
        <td>
            <div class="asistencia-info">
                <div class="asistencia-badge ${claseAsistencia}">
                    <i class="${iconoAsistencia}"></i>
                    ${asistenciaData.porcentaje}%
                </div>
                <div class="asistencia-detalle">
                    ${asistenciaData.asistio}/${asistenciaData.debiaAsistir}
                </div>
            </div>
        </td>
        <td>${statusBadge}</td>
        <td>
            <button class="btn-secondary" onclick="showAlumnoDetail('${dni}')">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-primary" onclick="editAlumno('${dni}')">
                <i class="fas fa-edit"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Función para ordenar alumnos respetando filtros activos
function sortAlumnos(tipo) {
    console.log(`🔄 Ordenando alumnos por: ${tipo}`);
    
    // Guardar orden original la primera vez
    if (originalAlumnosOrder.length === 0) {
        originalAlumnosOrder = [...window.alumnosData];
    }
    
    // Actualizar botones activos
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.sort-btn').classList.add('active');
    
    // Actualizar variable de ordenamiento actual
    currentSort = tipo;
    
    // Renderizar con el nuevo ordenamiento usando el estado actual
    renderCurrentState();
    
    console.log(`✅ Alumnos ordenados por ${tipo} (respetando filtros activos)`);
}

// Función para aplicar filtros actuales a un conjunto de datos
function applyCurrentFilters(data) {
    return data.filter(alumno => {
        const nombre = `${alumno.nombre || ''} ${alumno.apellido || ''}`.toLowerCase();
        const dni = (alumno.dni || '').toString();
        const sede = alumno.sede || '';
        const nivel = alumno.nivel || alumno.nivel_educativo || '';
        
        const matchesSearch = !window.currentFilters.search || 
            nombre.includes(window.currentFilters.search.toLowerCase()) || 
            dni.includes(window.currentFilters.search);
        const matchesSede = !window.currentFilters.sede || sede === window.currentFilters.sede;
        const matchesNivel = !window.currentFilters.nivel || nivel === window.currentFilters.nivel;
        
        return matchesSearch && matchesSede && matchesNivel;
    });
}

// Función para renderizar con datos específicos
function renderAlumnosWithData(data) {
    if (currentView === 'cards') {
        renderAlumnosCardsWithData(data);
    } else {
        renderAlumnosTableWithData(data);
    }
}

// Renderizar cards con datos específicos
function renderAlumnosCardsWithData(data) {
    const container = document.getElementById('alumnosCards');
    if (!container) return;
    
    // Actualizar contador
    updateAlumnosCounter(data.length);
    
    container.innerHTML = '';
    
    if (data.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No se encontraron alumnos con los filtros aplicados</p>
            </div>
        `;
        return;
    }
    
    data.forEach((alumno, index) => {
        const card = createAlumnoCard(alumno, index);
        container.appendChild(card);
    });
}

// Renderizar tabla con datos específicos
function renderAlumnosTableWithData(data) {
    const tbody = document.querySelector('#alumnosTable tbody');
    if (!tbody) return;
    
    // Actualizar contador
    updateAlumnosCounter(data.length);
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center">
                    <i class="fas fa-search"></i> No se encontraron alumnos con los filtros aplicados
                </td>
            </tr>
        `;
        return;
    }
    
    data.forEach((alumno, index) => {
        const row = createAlumnoRow(alumno, index);
        tbody.appendChild(row);
    });
}

// Función para obtener el nombre completo de un alumno
function getAlumnoNombreCompleto(alumno) {
    const nombre = alumno.nombre || '';
    const apellido = alumno.apellido || '';
    return `${apellido} ${nombre}`.trim() || 'Sin nombre';
}

// Actualizar contador de registros visibles
function updateAlumnosCounter(count) {
    const counterElement = document.getElementById('alumnosCount');
    if (counterElement) {
        counterElement.textContent = count;
    }
}

// Hacer funciones disponibles globalmente
window.switchView = switchView;
window.showAlumnoDetail = showAlumnoDetail;
window.updateAlumnosCounter = updateAlumnosCounter;
window.sortAlumnos = sortAlumnos;
window.renderCurrentState = renderCurrentState;
window.createAlumnoCard = createAlumnoCard;
window.createAlumnoRow = createAlumnoRow;
window.renderAlumnosWithData = renderAlumnosWithData;
