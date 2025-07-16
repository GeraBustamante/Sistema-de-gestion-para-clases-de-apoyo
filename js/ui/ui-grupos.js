// ====================================
// GESTIÓN DE LA SECCIÓN GRUPOS
// ====================================

// Renderizar grupos
function renderGrupos() {
    const container = document.getElementById('groupsGrid');
    
    if (!container) {
        console.error('❌ No se encontró el contenedor de grupos');
        return;
    }
    
    container.innerHTML = '';
    
    // Usar la variable global window.gruposData
    const grupos = window.gruposData || [];
    console.log('GRUPOS - Cantidad:', grupos.length);
    
    if (grupos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users fa-4x"></i>
                <h3>No hay grupos disponibles</h3>
                <p>Los grupos se cargarán cuando uses "Actualizar Datos".</p>
            </div>
        `;
        return;
    }
    
    grupos.forEach(grupo => {
        const card = createGrupoCard(grupo);
        container.appendChild(card);
    });
    
    // IMPORTANTE: Poblar filtros después de renderizar
    populateGruposFilters();
    
    console.log('✅ GRUPOS RENDERIZADOS:', grupos.length);
}

// Crear tarjeta de grupo - ACTUALIZADO para datos reales
function createGrupoCard(grupo) {
    const card = document.createElement('div');
    card.className = 'group-card';
    
    // Asegurar que los datos existen - CAMPOS REALES
    const id = grupo.idGrupo || 'N/A';
    const materia = grupo.materia || 'N/A';
    const grupoNombre = grupo.grupo || 'N/A';
    const docente = grupo.docente || 'N/A';
    const sede = grupo.sede || 'N/A';
    const turno = grupo.turno || 'N/A';
    const nivel = grupo.nivel || 'N/A';
    const cardinal = grupo.cardinal || 0;
    const cupoMax = grupo.cupoMax || 0;
    const ocupacion = grupo.ocupacion || '';
    const observaciones = grupo.observaciones || '';
    
    const horarios = getHorarios(grupo);
    
    // Determinar estado del grupo
    const estaLleno = parseInt(cardinal) >= parseInt(cupoMax);
    const estadoTexto = estaLleno ? 'LLENO' : 'Disponible';
    const estadoClass = estaLleno ? 'status-completo' : 'status-activo';
    
    card.innerHTML = `
        <h3>
            <i class="fas fa-users"></i>
            ${materia} - Grupo ${grupoNombre}
        </h3>
        <div class="group-info">
            <div class="info-item">
                <span class="info-label">ID:</span>
                <span class="info-value">${id}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Docente:</span>
                <span class="info-value">${docente}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Sede:</span>
                <span class="info-value">${sede}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Turno:</span>
                <span class="info-value">${turno}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Nivel:</span>
                <span class="info-value">${nivel}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Horarios:</span>
                <span class="info-value">${horarios}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Ocupación:</span>
                <span class="info-value">${cardinal}/${cupoMax} - <span class="${estadoClass}">${estadoTexto}</span></span>
            </div>
            ${observaciones ? `
            <div class="info-item">
                <span class="info-label">Observaciones:</span>
                <span class="info-value">${observaciones}</span>
            </div>
            ` : ''}
        </div>
        <div style="margin-top: 1rem;">
            <button class="btn-secondary" onclick="showGrupoDetail('${id}')">
                <i class="fas fa-eye"></i> Ver Detalle
            </button>
        </div>
    `;
    
    return card;
}

// Función para obtener horarios formateados
function getHorarios(grupo) {
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const horarios = [];
    
    dias.forEach(dia => {
        const horario = grupo[dia];
        if (horario && horario.trim() && horario !== 'N/A') {
            const diaCapitalized = dia.charAt(0).toUpperCase() + dia.slice(1);
            horarios.push(`${diaCapitalized}: ${horario}`);
        }
    });
    
    return horarios.length > 0 ? horarios.join('<br>') : 'No especificados';
}

// Mostrar detalle del grupo en modal
function showGrupoDetail(grupoId) {
    const grupo = window.gruposData?.find(g => g.idGrupo === grupoId || g.id_grupo === grupoId);
    
    if (!grupo) {
        alert('Grupo no encontrado');
        return;
    }
    
    const modal = document.getElementById('detailModal');
    const modalContent = document.getElementById('modalContent');
    
    // Obtener alumnos asignados a este grupo
    const alumnosDelGrupo = alumnosData.filter(alumno => 
        alumno.grupo === grupo.grupo || 
        alumno.grupo === grupo.nombreGrupo ||
        alumno.docente === grupo.docente
    );
    
    modalContent.innerHTML = `
        <h2><i class="fas fa-users"></i> ${grupo.grupo || grupo.nombreGrupo || 'Grupo'} - ${grupo.materia || 'Sin materia'}</h2>
        
        <div class="detail-grid">
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Información General</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">ID Grupo:</span>
                        <span class="info-value">${grupo.idGrupo || grupo.id_grupo || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Materia:</span>
                        <span class="info-value">${grupo.materia || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nivel:</span>
                        <span class="info-value">${grupo.nivel || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Sede:</span>
                        <span class="info-value">${grupo.sede || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Turno:</span>
                        <span class="info-value">${grupo.turno || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Docente:</span>
                        <span class="info-value">${grupo.docente || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-clock"></i> Horarios</h3>
                <div class="horarios-detail">
                    ${getHorarios(grupo)}
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-chart-bar"></i> Capacidad y Ocupación</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Capacidad:</span>
                        <span class="info-value">${grupo.capacidad || grupo.cupo_max || grupo.cupoMax || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Inscriptos:</span>
                        <span class="info-value">${grupo.cardinal || grupo.alumnosInscriptos || alumnosDelGrupo.length || 0}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Ocupación:</span>
                        <span class="info-value">${grupo.ocupacion || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Estado:</span>
                        <span class="info-value status-${(grupo.estado || 'activo').toLowerCase()}">${grupo.estado || 'Activo'}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-users"></i> Alumnos Asignados (${alumnosDelGrupo.length})</h3>
                <div class="alumnos-lista">
                    ${alumnosDelGrupo.length > 0 ? 
                        alumnosDelGrupo.map(alumno => `
                            <div class="alumno-item">
                                <i class="fas fa-user"></i>
                                <span class="alumno-nombre">${alumno.nombre || 'Sin nombre'}</span>
                                <span class="alumno-dni">(DNI: ${alumno.dni || 'N/A'})</span>
                            </div>
                        `).join('') : 
                        '<p class="no-data">No hay alumnos asignados a este grupo</p>'
                    }
                </div>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-primary" onclick="editGrupo('${grupo.idGrupo || grupo.id_grupo}')">
                <i class="fas fa-edit"></i> Editar Grupo
            </button>
            <button class="btn-secondary" onclick="closeModal()">
                <i class="fas fa-times"></i> Cerrar
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Función temporal para editar grupo
function editGrupo(grupoId) {
    alert(`Función de editar grupo ${grupoId} en desarrollo`);
}

// Poblar filtros específicos de grupos
function populateGruposFilters() {
    const turnoFilter = document.getElementById('filterTurno');
    if (turnoFilter && window.gruposData && window.gruposData.length > 0) {
        const turnos = [...new Set(window.gruposData.map(g => g.turno).filter(t => t && t.trim()))];
        turnos.sort();
        turnoFilter.innerHTML = '<option value="">Todos los turnos</option>';
        turnos.forEach(turno => {
            turnoFilter.innerHTML += `<option value="${turno}">${turno}</option>`;
        });
        console.log('🕐 Turnos encontrados para filtro:', turnos.length);
    }
}

// Hacer funciones disponibles globalmente
window.showGrupoDetail = showGrupoDetail;
window.editGrupo = editGrupo;
window.populateGruposFilters = populateGruposFilters;
