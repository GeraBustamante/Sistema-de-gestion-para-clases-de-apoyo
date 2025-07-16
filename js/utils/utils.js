// ====================================
// UTILIDADES GENERALES
// ====================================

// Mostrar/ocultar spinner de carga
function showLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Mostrar mensaje informativo
function showInfoMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3498db;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    messageDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Obtener color para porcentaje de asistencia
function getAsistenciaColor(porcentaje) {
    const valor = parseInt(porcentaje);
    if (valor >= 90) return '#2ecc71';
    if (valor >= 80) return '#f39c12';
    if (valor >= 70) return '#e67e22';
    return '#e74c3c';
}

// Obtener badge de estado
function getStatusBadge(estado) {
    const statusClass = estado.toLowerCase() === 'activo' ? 'status-active' : 'status-inactive';
    return `<span class="status-badge ${statusClass}">${estado}</span>`;
}

// Obtener horarios de un grupo
function getHorarios(grupo) {
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const horarios = [];
    
    dias.forEach(dia => {
        if (grupo[dia] && grupo[dia].trim()) {
            horarios.push(`${dia.charAt(0).toUpperCase() + dia.slice(1)}: ${grupo[dia]}`);
        }
    });
    
    return horarios.length > 0 ? horarios.join(', ') : 'Sin horarios definidos';
}

// Validar DNI (solo verificar que no esté vacío)
function isValidDNI(dni) {
    if (!dni) return false;
    const dniStr = dni.toString().trim();
    return dniStr !== '';
}

// Normalizar nombres de alumnos para hacer matching
function normalizeAlumnoName(nombre) {
    if (!nombre) return '';
    
    return nombre.toString()
                 .trim()
                 .toLowerCase()
                 .replace(/[áéíóú]/g, char => 'aeiou'['áéíóú'.indexOf(char)])
                 .replace(/[^a-z0-9\s]/g, '')
                 .replace(/\s+/g, ' ');
}

// Navegación entre secciones
function showSection(sectionName, event = null) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover clase active de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activar botón correspondiente si existe el evento
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Si no hay evento, activar el botón correspondiente manualmente
        const correspondingBtn = document.querySelector(`[onclick*="${sectionName}"]`);
        if (correspondingBtn) {
            correspondingBtn.classList.add('active');
        }
    }
    
    // Actualizar contenido según la sección
    switch(sectionName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'alumnos':
            renderAlumnos();
            break;
        case 'docentes':
            renderDocentes();
            break;
        case 'grupos':
            renderGrupos();
            break;
        case 'sedes':
            renderSedes();
            break;
    }
}

// Funciones de detalle y edición (placeholder)
function showAlumnoDetail(dni) {
    const alumno = window.alumnosData.find(a => a.dni_alumno === dni);
    if (alumno) {
        console.log('Mostrar detalle de alumno:', alumno);
    }
}

function editAlumno(dni) {
    console.log('Editar alumno:', dni);
}

function showDocenteDetail(dni) {
    const docente = docentesData.find(d => d.dni === dni);
    if (docente) {
        console.log('Mostrar detalle de docente:', docente);
    }
}

function editDocente(dni) {
    console.log('Editar docente:', dni);
}

function showGrupoDetail(id) {
    const grupo = gruposData.find(g => g.id_grupo === id);
    if (grupo) {
        console.log('Mostrar detalle de grupo:', grupo);
    }
}

function editGrupo(id) {
    console.log('Editar grupo:', id);
}

function showSedeDetail(id) {
    const sede = sedesData.find(s => s.id_sede === id);
    if (sede) {
        console.log('Mostrar detalle de sede:', sede);
    }
}

function editSede(id) {
    console.log('Editar sede:', id);
}

// Gestión de modales
function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

function closeConfigModal() {
    document.getElementById('configModal').style.display = 'none';
}
