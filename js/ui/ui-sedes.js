// ====================================
// GESTIÓN DE LA SECCIÓN SEDES
// ====================================

// Renderizar sedes
function renderSedes() {
    console.log('🏢 Renderizando sedes...');
    const container = document.getElementById('sedesGrid');
    
    if (!container) {
        console.error('❌ Container sedesGrid no encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    if (!window.sedesData || !Array.isArray(window.sedesData)) {
        console.warn('⚠️ No hay datos de sedes para renderizar');
        container.innerHTML = '<p>No hay sedes disponibles</p>';
        return;
    }
    
    console.log(`📊 Renderizando ${window.sedesData.length} sedes`);
    
    window.sedesData.forEach(sede => {
        const card = createSedeCard(sede);
        container.appendChild(card);
    });
    
    // Poblar filtros después de renderizar
    populateSedesFilters();
}

// Crear tarjeta de sede (usando campos normalizados del parser)
function createSedeCard(sede) {
    const card = document.createElement('div');
    card.className = 'sede-card';
    
    // Usar campos normalizados del parser
    const id = sede.idSede || 'N/A';
    const nombre = sede.nombreSede || 'N/A';
    const establecimiento = sede.establecimiento || 'N/A';
    const direccion = sede.direccion || 'N/A';
    const departamento = sede.departamento || 'N/A';
    const coordinador = sede.coordinador || 'N/A';
    const correo = sede.correo || 'N/A';
    const cue = sede.cue || 'N/A';
    const nivelEducativo = sede.nivelEducativo || 'N/A';
    const turno = sede.turno || 'N/A';
    const numeroSede = sede.numeroSede || 'N/A';
    
    card.innerHTML = `
        <h3>
            <i class="fas fa-building"></i>
            ${nombre}
        </h3>
        <div class="sede-info">
            <div class="info-item">
                <span class="info-label">Establecimiento:</span>
                <span class="info-value">${establecimiento}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Dirección:</span>
                <span class="info-value">${direccion}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Departamento:</span>
                <span class="info-value">${departamento}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Nivel:</span>
                <span class="info-value">${nivelEducativo}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Turno:</span>
                <span class="info-value">${turno}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Coordinador:</span>
                <span class="info-value">${coordinador}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${correo !== 'N/A' ? correo : 'No disponible'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">CUE:</span>
                <span class="info-value">${cue}</span>
            </div>
        </div>
        <div style="margin-top: 1rem;">
            <button class="btn-secondary" onclick="showSedeDetail('${id}')">
                <i class="fas fa-eye"></i> Ver Detalle
            </button>
        </div>
    `;
    
    return card;
}

// Poblar filtros de sedes
function populateSedesFilters() {
    console.log('🏢 Poblando filtros de sedes...');
    
    if (!window.sedesData || !Array.isArray(window.sedesData)) {
        console.warn('⚠️ No hay datos de sedes para filtros');
        return;
    }
    
    // Poblar filtro de departamento
    const departamentoFilter = document.getElementById('filterDepartamento');
    if (departamentoFilter) {
        const departamentos = [...new Set(window.sedesData
            .map(sede => sede.departamento)
            .filter(dep => dep && dep !== 'N/A')
        )].sort();
        
        // Limpiar opciones actuales excepto "Todos"
        departamentoFilter.innerHTML = '<option value="">Todos los departamentos</option>';
        
        departamentos.forEach(departamento => {
            const option = document.createElement('option');
            option.value = departamento;
            option.textContent = departamento;
            departamentoFilter.appendChild(option);
        });
        
        console.log(`✅ Filtro departamentos poblado con ${departamentos.length} opciones`);
    }
    
    // Poblar filtro de nivel educativo
    const nivelFilter = document.getElementById('filterNivelSede');
    if (nivelFilter) {
        const niveles = [...new Set(window.sedesData
            .map(sede => sede.nivelEducativo)
            .filter(nivel => nivel && nivel !== 'N/A')
        )].sort();
        
        // Limpiar opciones actuales excepto "Todos"
        nivelFilter.innerHTML = '<option value="">Todos los niveles</option>';
        
        niveles.forEach(nivel => {
            const option = document.createElement('option');
            option.value = nivel;
            option.textContent = nivel;
            nivelFilter.appendChild(option);
        });
        
        console.log(`✅ Filtro niveles poblado con ${niveles.length} opciones`);
    }
    
    // Poblar filtro de turno
    const turnoFilter = document.getElementById('filterTurnoSede');
    if (turnoFilter) {
        const turnos = [...new Set(window.sedesData
            .map(sede => sede.turno)
            .filter(turno => turno && turno !== 'N/A')
        )].sort();
        
        // Limpiar opciones actuales excepto "Todos"
        turnoFilter.innerHTML = '<option value="">Todos los turnos</option>';
        
        turnos.forEach(turno => {
            const option = document.createElement('option');
            option.value = turno;
            option.textContent = turno;
            turnoFilter.appendChild(option);
        });
        
        console.log(`✅ Filtro turnos poblado con ${turnos.length} opciones`);
    }
}

// Mostrar detalle de sede
function showSedeDetail(idSede) {
    const sede = window.sedesData?.find(s => s.idSede === idSede);
    
    if (!sede) {
        alert('Sede no encontrada');
        return;
    }
    
    const modal = document.getElementById('sedeModal');
    const modalContent = document.getElementById('sedeModalContent');
    
    if (!modal || !modalContent) {
        console.error('❌ Modal de sede no encontrado');
        return;
    }
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2><i class="fas fa-building"></i> ${sede.nombreSede || 'N/A'}</h2>
            <button class="modal-close" onclick="closeSedeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="detail-grid">
                <div class="detail-item">
                    <strong>ID Sede:</strong>
                    <span>${sede.idSede || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>Número de Sede:</strong>
                    <span>${sede.numeroSede || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>Establecimiento:</strong>
                    <span>${sede.establecimiento || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>Dirección:</strong>
                    <span>${sede.direccion || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>Departamento:</strong>
                    <span>${sede.departamento || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>Nivel Educativo:</strong>
                    <span>${sede.nivelEducativo || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>Turno:</strong>
                    <span>${sede.turno || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>CUE:</strong>
                    <span>${sede.cue || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>Coordinador/a:</strong>
                    <span>${sede.coordinador || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <strong>Correo:</strong>
                    <span>${sede.correo || 'No disponible'}</span>
                </div>
                ${sede.idSede2 ? `
                <div class="detail-item">
                    <strong>ID Sede 2:</strong>
                    <span>${sede.idSede2}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Cerrar modal de sede
function closeSedeModal() {
    const modal = document.getElementById('sedeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Hacer funciones disponibles globalmente
window.renderSedes = renderSedes;
window.createSedeCard = createSedeCard;
window.populateSedesFilters = populateSedesFilters;
window.showSedeDetail = showSedeDetail;
window.closeSedeModal = closeSedeModal;
