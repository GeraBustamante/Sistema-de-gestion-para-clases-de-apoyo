// ====================================
// GESTIÓN DE LA SECCIÓN DOCENTES
// ====================================

// Renderizar tabla de docentes
function renderDocentes() {
    console.log('👨‍🏫 Renderizando docentes, total:', docentesData.length);
    
    const tbody = document.querySelector('#docentesTable tbody');
    if (!tbody) {
        console.error('❌ No se encontró el tbody de la tabla de docentes');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (docentesData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <i class="fas fa-info-circle"></i> No hay docentes para mostrar
                </td>
            </tr>
        `;
        return;
    }
    
    docentesData.forEach((docente, index) => {
        try {
            const row = createDocenteRow(docente, index);
            tbody.appendChild(row);
        } catch (error) {
            console.error(`❌ Error creando fila para docente ${index}:`, error, docente);
        }
    });
    
    console.log('✅ Tabla de docentes renderizada con', docentesData.length, 'registros');
}

// Crear fila de docente
function createDocenteRow(docente, index) {
    const row = document.createElement('tr');
    
    // Obtener datos usando los campos reales de la hoja de Google Sheets
    const dni = docente.dni || 'N/A';
    const nombreCompleto = docente.nombre_completo || 'N/A';
    const email = docente.email || 'N/A';
    const sede = docente.sede || 'N/A';
    const materias = docente.materias || 'N/A';
    const grupos = docente.grupos_asignados || docente.total_alumnos || 'N/A';
    const totalAlumnos = docente.alumnos_asignados || docente.total_alumnos || 'N/A';
    
    row.innerHTML = `
        <td>${dni}</td>
        <td><strong>${nombreCompleto}</strong></td>
        <td>${email}</td>
        <td><span class="badge badge-sede">${sede}</span></td>
        <td>${materias}</td>
        <td class="text-center">${grupos}</td>
        <td class="text-center">${totalAlumnos}</td>
        <td>
            <div class="btn-group">
                <button class="btn-secondary btn-sm" onclick="showDocenteDetail('${dni}', ${index})" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-primary btn-sm" onclick="editDocente('${dni}', ${index})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Aplicar filtros a la tabla de docentes
function applyDocentesFilters() {
    const searchTerm = document.getElementById('searchDocentes').value.toLowerCase();
    const materiaFilter = document.getElementById('filterMaterias').value;
    
    const filteredDocentes = docentesData.filter(docente => {
        const nombre = (docente.nombre_completo || '').toLowerCase();
        const dni = (docente.dni || '').toString().toLowerCase();
        const email = (docente.email || '').toLowerCase();
        const materias = (docente.materias || '').toLowerCase();
        
        const matchesSearch = !searchTerm || 
            nombre.includes(searchTerm) || 
            dni.includes(searchTerm) || 
            email.includes(searchTerm);
            
        const matchesMateria = !materiaFilter || materias.includes(materiaFilter.toLowerCase());
        
        return matchesSearch && matchesMateria;
    });
    
    // Renderizar tabla filtrada temporalmente
    const originalData = [...docentesData];
    docentesData = filteredDocentes;
    renderDocentes();
    docentesData = originalData;
}
function showDocenteDetail(dni, index) {
    console.log('👨‍🏫 Mostrando detalles del docente:', dni, index);
    
    const docente = docentesData[index] || docentesData.find(d => d.dni === dni);
    
    if (!docente) {
        console.error('❌ No se encontró el docente:', dni);
        return;
    }
    
    const modalContent = document.getElementById('modalContent');
    const modal = document.getElementById('detailModal');
    
    // Obtener las materias que enseña basándose en los campos TRUE/FALSE
    const materiasEspecificas = [];
    if (docente.materia_matematica === 'TRUE') materiasEspecificas.push('Matemática');
    if (docente.materia_lengua === 'TRUE') materiasEspecificas.push('Lengua');
    if (docente.materia_fisica === 'TRUE') materiasEspecificas.push('Física');
    if (docente.materia_quimica === 'TRUE') materiasEspecificas.push('Química');
    if (docente.materia_ingles === 'TRUE') materiasEspecificas.push('Inglés');
    
    const materiasDetalladas = materiasEspecificas.length > 0 ? materiasEspecificas.join(', ') : (docente.materias || 'N/A');
    
    modalContent.innerHTML = `
        <h3><i class="fas fa-chalkboard-teacher"></i> Detalles del Docente</h3>
        <div class="detail-grid">
            <div class="detail-section">
                <h4>📋 Información Personal</h4>
                <p><strong>DNI:</strong> ${docente.dni || 'N/A'}</p>
                <p><strong>Nombre:</strong> ${docente.nombre_completo || 'N/A'}</p>
                <p><strong>Email:</strong> ${docente.email || 'N/A'}</p>
                <p><strong>Teléfono:</strong> ${docente.telefono || 'N/A'}</p>
                <p><strong>Residencia:</strong> ${docente.residencia || 'N/A'}</p>
            </div>
            <div class="detail-section">
                <h4>🎓 Información Académica</h4>
                <p><strong>Nivel Educativo:</strong> ${docente.nivel_educativo || 'N/A'}</p>
                <p><strong>Materias Generales:</strong> ${docente.materias || 'N/A'}</p>
                <p><strong>Materias Específicas:</strong> ${materiasDetalladas}</p>
                <p><strong>Sede:</strong> ${docente.sede || 'N/A'}</p>
                <p><strong>Modalidad Disponible:</strong> ${docente.modalidad_disponible || 'N/A'}</p>
            </div>
            <div class="detail-section">
                <h4>📊 Información de Asignaciones</h4>
                <p><strong>Grupos Asignados:</strong> ${docente.grupos_asignados || 'N/A'}</p>
                <p><strong>Alumnos Asignados:</strong> ${docente.alumnos_asignados || 'N/A'}</p>
                <p><strong>Total Alumnos:</strong> ${docente.total_alumnos || docente.alumnos_asignados || 'N/A'}</p>
            </div>
        </div>
        
        <div class="materias-details">
            <h4>📚 Detalle de Materias</h4>
            <div class="materias-grid">
                <span class="materia-badge ${docente.materia_matematica === 'TRUE' ? 'active' : 'inactive'}">
                    <i class="fas fa-calculator"></i> Matemática
                </span>
                <span class="materia-badge ${docente.materia_lengua === 'TRUE' ? 'active' : 'inactive'}">
                    <i class="fas fa-book"></i> Lengua
                </span>
                <span class="materia-badge ${docente.materia_fisica === 'TRUE' ? 'active' : 'inactive'}">
                    <i class="fas fa-atom"></i> Física
                </span>
                <span class="materia-badge ${docente.materia_quimica === 'TRUE' ? 'active' : 'inactive'}">
                    <i class="fas fa-flask"></i> Química
                </span>
                <span class="materia-badge ${docente.materia_ingles === 'TRUE' ? 'active' : 'inactive'}">
                    <i class="fas fa-language"></i> Inglés
                </span>
            </div>
        </div>
        
        <div class="modal-actions">
            <button class="btn-primary" onclick="editDocente('${dni}', ${index})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn-secondary" onclick="closeModal()">
                <i class="fas fa-times"></i> Cerrar
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Editar docente (placeholder)
function editDocente(dni, index) {
    console.log('✏️ Editando docente:', dni, index);
    alert('Función de edición en desarrollo');
}

// Aplicar filtros a la tabla de docentes
function applyDocentesFilters() {
    const searchTerm = document.getElementById('searchDocentes').value.toLowerCase();
    const materiaFilter = document.getElementById('filterMaterias').value;
    
    const filteredDocentes = docentesData.filter(docente => {
        const nombre = getDocenteNombre(docente).toLowerCase();
        const dni = (docente.dni || docente.DNI || '').toString().toLowerCase();
        const email = (docente.email || docente.Email || '').toLowerCase();
        const materias = (docente.materias || docente.Materias || '').toLowerCase();
        
        const matchesSearch = !searchTerm || 
            nombre.includes(searchTerm) || 
            dni.includes(searchTerm) || 
            email.includes(searchTerm);
            
        const matchesMateria = !materiaFilter || materias.includes(materiaFilter.toLowerCase());
        
        return matchesSearch && matchesMateria;
    });
    
    // Renderizar tabla filtrada temporalmente
    const originalData = [...docentesData];
    docentesData = filteredDocentes;
    renderDocentes();
    docentesData = originalData;
}

// Event listeners para filtros
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchDocentes');
    const materiaFilter = document.getElementById('filterMaterias');
    
    if (searchInput) {
        searchInput.addEventListener('input', applyDocentesFilters);
    }
    
    if (materiaFilter) {
        materiaFilter.addEventListener('change', applyDocentesFilters);
    }
});

// Hacer funciones disponibles globalmente
window.renderDocentes = renderDocentes;
window.showDocenteDetail = showDocenteDetail;
window.editDocente = editDocente;
window.applyDocentesFilters = applyDocentesFilters;
window.createDocenteRow = createDocenteRow;
