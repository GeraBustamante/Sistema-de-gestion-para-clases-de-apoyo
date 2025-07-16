// ====================================
// SISTEMA DE FILTROS Y BÚSQUEDAS
// ====================================

// Poblar filtros dinámicamente
function populateFilters() {
    console.log('🔄 Poblando filtros...');
    
    // Filtro de sedes para alumnos - usar campos correctos del mapeo
    const sedeFilter = document.getElementById('filterSede');
    if (sedeFilter && window.alumnosData && window.alumnosData.length > 0) {
        console.log('📊 Analizando sedes de', window.alumnosData.length, 'alumnos');
        
        // Mostrar las primeras 5 sedes para debug
        const primerasSedes = window.alumnosData.slice(0, 5).map(a => ({
            dni: a.dni,
            sede: `"${a.sede}"`,
            length: (a.sede || '').length
        }));
        console.log('🔍 Primeras 5 sedes encontradas:', primerasSedes);
        
        const sedes = [...new Set(window.alumnosData.map(a => a.sede).filter(s => s && s.trim()))];
        sedes.sort();
        sedeFilter.innerHTML = '<option value="">Todas las sedes</option>';
        sedes.forEach(sede => {
            sedeFilter.innerHTML += `<option value="${sede}">${sede}</option>`;
        });
        console.log('🏢 Sedes únicas encontradas:', sedes.length, sedes);
    }
    
    // Filtro de niveles para alumnos
    const nivelFilter = document.getElementById('filterNivel');
    if (nivelFilter && window.alumnosData.length > 0) {
        const niveles = [...new Set(window.alumnosData.map(a => a.nivel || a.nivel_educativo).filter(n => n && n.trim()))];
        niveles.sort();
        nivelFilter.innerHTML = '<option value="">Todos los niveles</option>';
        niveles.forEach(nivel => {
            nivelFilter.innerHTML += `<option value="${nivel}">${nivel}</option>`;
        });
        console.log('📚 Niveles encontrados:', niveles.length, niveles);
    }
    
    // Filtro de estados para alumnos
    const estadoFilter = document.getElementById('filterEstado');
    if (estadoFilter && window.alumnosData && window.alumnosData.length > 0) {
        const estados = [...new Set(window.alumnosData.map(a => a.estado || a.Estado || 'Sin estado').filter(e => e && e.trim()))];
        estados.sort();
        estadoFilter.innerHTML = '<option value="">Todos los estados</option>';
        estados.forEach(estado => {
            const selected = estado === 'Activo' ? ' selected' : '';
            estadoFilter.innerHTML += `<option value="${estado}"${selected}>${estado}</option>`;
        });
        console.log('📊 Estados encontrados:', estados.length, estados);
    }
    
    // Filtro de materias para docentes
    const materiaFilter = document.getElementById('filterMaterias');
    if (materiaFilter && window.docentesData && window.docentesData.length > 0) {
        const materias = [...new Set(window.docentesData.flatMap(d => {
            const materiasStr = d.materias || d.Materias || '';
            return materiasStr.split(',').map(m => m.trim()).filter(m => m);
        }))];
        materiaFilter.innerHTML = '<option value="">Todas las materias</option>';
        materias.forEach(materia => {
            materiaFilter.innerHTML += `<option value="${materia}">${materia}</option>`;
        });
        console.log('📚 Materias encontradas:', materias.length, materias);
    }
    
    // Filtro de turnos para grupos
    const turnoFilter = document.getElementById('filterTurno');
    if (turnoFilter && window.gruposData && window.gruposData.length > 0) {
        const turnos = [...new Set(window.gruposData.map(g => g.turno || 'N/A').filter(t => t !== 'N/A'))];
        turnoFilter.innerHTML = '<option value="">Todos los turnos</option>';
        turnos.forEach(turno => {
            turnoFilter.innerHTML += `<option value="${turno}">${turno}</option>`;
        });
        console.log('⏰ Turnos encontrados:', turnos.length, turnos);
    }
}

// Filtros por sección
function filterAlumnos() {
    const searchTerm = document.getElementById('searchAlumnos').value.toLowerCase();
    const sedeFilter = document.getElementById('filterSede').value;
    const nivelFilter = document.getElementById('filterNivel').value;
    const estadoFilter = document.getElementById('filterEstado').value;
    
    // Verificar que los datos estén disponibles
    if (!window.alumnosData || !Array.isArray(window.alumnosData) || window.alumnosData.length === 0) {
        console.warn('⚠️ No hay datos de alumnos para filtrar');
        return;
    }
    
    // Actualizar filtros actuales - usar la variable global del módulo ui-alumnos
    if (typeof window.currentFilters !== 'undefined') {
        window.currentFilters.search = searchTerm;
        window.currentFilters.sede = sedeFilter;
        window.currentFilters.nivel = nivelFilter;
        window.currentFilters.estado = estadoFilter;
    }
    
    console.log('🔍 Filtros aplicados:', { searchTerm, sedeFilter, nivelFilter, estadoFilter });
    
    const filteredData = window.alumnosData.filter(alumno => {
        // Usar los nombres de campos correctos del mapeo
        const nombre = `${alumno.nombre || ''} ${alumno.apellido || ''}`.toLowerCase();
        const dni = (alumno.dni || '').toString();
        const sede = alumno.sede || '';
        const nivel = alumno.nivel || alumno.nivel_educativo || '';
        const estado = alumno.estado || alumno.Estado || '';
        
        const matchesSearch = !searchTerm || nombre.includes(searchTerm) || dni.includes(searchTerm);
        const matchesSede = !sedeFilter || sede === sedeFilter;
        const matchesNivel = !nivelFilter || nivel === nivelFilter;
        const matchesEstado = !estadoFilter || estado === estadoFilter;
        
        // Debug EXTENDIDO para todos los casos cuando hay filtros activos
        if (sedeFilter || estadoFilter) {
            console.log(`🔍 DEBUG FILTRO - Alumno ${dni}:`, {
                nombre: nombre,
                sede: `"${sede}"`,
                estado: `"${estado}"`,
                matchesSearch, matchesSede, matchesNivel, matchesEstado
            });
        }
        
        return matchesSearch && matchesSede && matchesNivel && matchesEstado;
    });
    
    // Guardar datos filtrados globalmente - SIEMPRE
    window.filteredAlumnosData = filteredData;
    
    console.log(`✅ Filtro aplicado: ${filteredData.length} de ${window.alumnosData.length} alumnos`);
    console.log(`🔗 Datos guardados en window.filteredAlumnosData:`, window.filteredAlumnosData.length, 'registros');
    
    // Usar la función unificada de renderizado si está disponible
    if (typeof renderCurrentState === 'function') {
        renderCurrentState();
    } else {
        // Fallback a la lógica anterior
        if (typeof currentSort !== 'undefined' && currentSort !== 'original') {
            setTimeout(() => {
                const activeBtn = document.querySelector('.sort-btn.active');
                if (activeBtn) {
                    const sortType = activeBtn.onclick.toString().match(/sortAlumnos\('(\w+)'/);
                    if (sortType && sortType[1]) {
                        applySort(sortType[1], filteredData);
                        return;
                    }
                }
                renderAlumnosWithFilteredData(filteredData);
            }, 10);
        } else {
            renderAlumnosWithFilteredData(filteredData);
        }
    }
}

// Función para aplicar ordenamiento a datos filtrados
function applySort(sortType, data) {
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
    
    renderAlumnosWithFilteredData(sortedData);
}

// Función para renderizar con datos filtrados
function renderAlumnosWithFilteredData(data) {
    // Usar las funciones del módulo ui-alumnos si están disponibles
    if (typeof renderAlumnosWithData === 'function') {
        renderAlumnosWithData(data);
    } else {
        // Fallback a las funciones originales
        if (document.getElementById('alumnosCards').style.display !== 'none') {
            renderFilteredAlumnosCards(data);
        } else {
            renderFilteredAlumnosTable(data);
        }
    }
}

function renderFilteredAlumnosTable(data) {
    const tbody = document.querySelector('#alumnosTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(alumno => {
        const row = createAlumnoRow(alumno);
        tbody.appendChild(row);
    });
}

function renderFilteredAlumnosCards(data) {
    const container = document.getElementById('alumnosCards');
    if (!container) return;
    
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
    
    data.forEach(alumno => {
        const card = createAlumnoCard(alumno);
        container.appendChild(card);
    });
}

function filterDocentes() {
    const searchTerm = document.getElementById('searchDocentes').value.toLowerCase();
    const materiaFilter = document.getElementById('filterMaterias').value;
    
    if (!window.docentesData || !Array.isArray(window.docentesData)) {
        console.warn('⚠️ No hay datos de docentes para filtrar');
        return;
    }
    
    const filteredData = window.docentesData.filter(docente => {
        const matchesSearch = docente.nombre_completo.toLowerCase().includes(searchTerm) ||
                            docente.dni.includes(searchTerm);
        const matchesMateria = !materiaFilter || docente.materias.includes(materiaFilter);
        
        return matchesSearch && matchesMateria;
    });
    
    renderFilteredDocentes(filteredData);
}

function renderFilteredDocentes(data) {
    const tbody = document.querySelector('#docentesTable tbody');
    tbody.innerHTML = '';
    
    data.forEach(docente => {
        const row = createDocenteRow(docente);
        tbody.appendChild(row);
    });
}

// ====================================
// FILTROS PARA GRUPOS
// ====================================

// Filtrar grupos
function filterGrupos() {
    const searchTerm = document.getElementById('searchGrupos')?.value.toLowerCase() || '';
    const turnoFilter = document.getElementById('filterTurno')?.value || '';
    
    let filteredGrupos = window.gruposData || [];
    
    // Filtrar por búsqueda
    if (searchTerm) {
        filteredGrupos = filteredGrupos.filter(grupo => {
            const grupoTexto = [
                grupo.grupo || '',
                grupo.nombreGrupo || '',
                grupo.materia || '',
                grupo.docente || '',
                grupo.sede || ''
            ].join(' ').toLowerCase();
            
            return grupoTexto.includes(searchTerm);
        });
    }
    
    // Filtrar por turno
    if (turnoFilter) {
        filteredGrupos = filteredGrupos.filter(grupo => 
            (grupo.turno || '').toLowerCase() === turnoFilter.toLowerCase()
        );
    }
    
    // Renderizar grupos filtrados
    const container = document.getElementById('groupsGrid');
    container.innerHTML = '';
    
    if (filteredGrupos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search fa-3x"></i>
                <h3>No se encontraron grupos</h3>
                <p>Intenta ajustar los filtros de búsqueda.</p>
            </div>
        `;
    } else {
        filteredGrupos.forEach(grupo => {
            const card = createGrupoCard(grupo);
            container.appendChild(card);
        });
    }
    
    console.log('🔍 Grupos filtrados:', filteredGrupos.length, 'de', (window.gruposData || []).length);
}

// Configurar eventos de filtros para grupos
function setupGruposFilters() {
    const searchInput = document.getElementById('searchGrupos');
    const turnoFilter = document.getElementById('filterTurno');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterGrupos);
    }
    
    if (turnoFilter) {
        turnoFilter.addEventListener('change', filterGrupos);
    }
}

// Hacer funciones disponibles globalmente
window.filterGrupos = filterGrupos;
window.setupGruposFilters = setupGruposFilters;
window.filterAlumnos = filterAlumnos;
window.filterDocentes = filterDocentes;
window.populateFilters = populateFilters;
window.globalSearch = globalSearch;

// Búsqueda global
function globalSearch(searchTerm) {
    if (!searchTerm) return;
    
    const term = searchTerm.toLowerCase();
    const results = {
        alumnos: (window.alumnosData || []).filter(a => 
            a.nombre_alumno.toLowerCase().includes(term) ||
            a.dni_alumno.includes(term)
        ),
        docentes: (window.docentesData || []).filter(d => 
            d.nombre_completo.toLowerCase().includes(term) ||
            d.dni.includes(term)
        ),
        grupos: (window.gruposData || []).filter(g => 
            (g.grupo || '').toLowerCase().includes(term) ||
            (g.materia || '').toLowerCase().includes(term)
        ),
        sedes: (window.sedesData || []).filter(s => 
            s.nombre_sede.toLowerCase().includes(term) ||
            s.establecimiento.toLowerCase().includes(term)
        )
    };
    
    // Mostrar resultados (implementar modal o sección de resultados)
    console.log('Resultados de búsqueda:', results);
}

// ====================================
// RESETEAR FILTROS
// ====================================

// Función para resetear todos los filtros y búsquedas
function resetAllFilters() {
    console.log('🔄 Reseteando todos los filtros...');
    
    // === ALUMNOS ===
    // Limpiar campos de búsqueda de alumnos
    const searchInput = document.getElementById('searchAlumnos');
    if (searchInput) searchInput.value = '';
    
    // Resetear filtros select de alumnos
    const filterSede = document.getElementById('filterSede');
    const filterNivel = document.getElementById('filterNivel');
    const filterEstado = document.getElementById('filterEstado');
    if (filterSede) filterSede.value = '';
    if (filterNivel) filterNivel.value = '';
    if (filterEstado) filterEstado.value = 'Activo'; // Volver a activos por defecto
    
    // === GRUPOS ===
    // Limpiar búsqueda de grupos
    const searchGrupos = document.getElementById('searchGrupos');
    if (searchGrupos) searchGrupos.value = '';
    
    // Resetear filtros de grupos
    const filterTurno = document.getElementById('filterTurno');
    if (filterTurno) filterTurno.value = '';
    
    // === SEDES ===
    // Limpiar búsqueda de sedes
    const searchSedes = document.getElementById('searchSedes');
    if (searchSedes) searchSedes.value = '';
    
    // Resetear filtros de sedes
    const filterDepartamento = document.getElementById('filterDepartamento');
    const filterNivelSede = document.getElementById('filterNivelSede');
    const filterTurnoSede = document.getElementById('filterTurnoSede');
    if (filterDepartamento) filterDepartamento.value = '';
    if (filterNivelSede) filterNivelSede.value = '';
    if (filterTurnoSede) filterTurnoSede.value = '';
    
    // Resetear filtros globales
    window.currentFilters = {
        search: '',
        sede: '',
        nivel: '',
        estado: 'Activo' // Mantener activos por defecto
    };
    
    // Resetear ordenamiento a original
    currentSort = 'original';
    
    // Actualizar botones de sort
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => btn.classList.remove('active'));
    const originalSortBtn = document.querySelector('.sort-btn[onclick*="original"]');
    if (originalSortBtn) originalSortBtn.classList.add('active');
    
    // Aplicar reseteo según sección activa
    const activeSection = document.querySelector('.section:not([style*="display: none"])');
    if (activeSection) {
        const sectionId = activeSection.id;
        console.log(`🔄 Reseteando sección activa: ${sectionId}`);
        
        switch (sectionId) {
            case 'alumnos':
                // Aplicar filtro por defecto de activos después del reseteo con un pequeño delay
                setTimeout(() => {
                    filterAlumnos();
                }, 100);
                break;
            case 'grupos':
                if (typeof renderGrupos === 'function') {
                    renderGrupos();
                }
                break;
            case 'sedes':
                if (typeof renderSedes === 'function') {
                    renderSedes();
                }
                break;
            default:
                // Para la sección de alumnos, aplicar filtros
                if (typeof filterAlumnos === 'function') {
                    setTimeout(() => {
                        filterAlumnos();
                    }, 100);
                }
        }
    } else {
        // Si no hay sección activa identificada, intentar aplicar filtros de alumnos
        if (typeof filterAlumnos === 'function') {
            setTimeout(() => {
                filterAlumnos();
            }, 100);
        }
    }
    
    console.log('✅ Filtros reseteados completamente');
}

// Hacer función disponible globalmente
window.resetAllFilters = resetAllFilters;

// ====================================
// FILTROS PARA SEDES (función temporal)
// ====================================

// Función para filtrar sedes
function filterSedes() {
    console.log('🔍 Filtro de sedes ejecutado');
    
    if (!window.sedesData || !Array.isArray(window.sedesData)) {
        console.warn('⚠️ No hay datos de sedes para filtrar');
        return;
    }
    
    const searchTerm = document.getElementById('searchSedes')?.value?.toLowerCase() || '';
    const departamentoFilter = document.getElementById('filterDepartamento')?.value || '';
    const nivelFilter = document.getElementById('filterNivelSede')?.value || '';
    const turnoFilter = document.getElementById('filterTurnoSede')?.value || '';
    
    console.log('🔍 Filtros aplicados:', { searchTerm, departamentoFilter, nivelFilter, turnoFilter });
    
    const filteredData = window.sedesData.filter(sede => {
        // Campos para búsqueda de texto
        const nombre = (sede.nombreSede || '').toLowerCase();
        const establecimiento = (sede.establecimiento || '').toLowerCase();
        const direccion = (sede.direccion || '').toLowerCase();
        const coordinador = (sede.coordinador || '').toLowerCase();
        const cue = (sede.cue || '').toLowerCase();
        
        // Campos para filtros específicos
        const departamento = sede.departamento || '';
        const nivel = sede.nivelEducativo || '';
        const turno = sede.turno || '';
        
        // Aplicar filtros
        const matchesSearch = !searchTerm || 
            nombre.includes(searchTerm) ||
            establecimiento.includes(searchTerm) ||
            direccion.includes(searchTerm) ||
            coordinador.includes(searchTerm) ||
            cue.includes(searchTerm);
        
        const matchesDepartamento = !departamentoFilter || departamento === departamentoFilter;
        const matchesNivel = !nivelFilter || nivel === nivelFilter;
        const matchesTurno = !turnoFilter || turno === turnoFilter;
        
        return matchesSearch && matchesDepartamento && matchesNivel && matchesTurno;
    });
    
    console.log(`✅ Filtro aplicado: ${filteredData.length} de ${window.sedesData.length} sedes`);
    
    // Renderizar las sedes filtradas
    renderSedesFiltered(filteredData);
}

// Función para renderizar sedes filtradas
function renderSedesFiltered(filteredSedes) {
    const container = document.getElementById('sedesGrid');
    
    if (!container) {
        console.error('❌ Container sedesGrid no encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    if (filteredSedes.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No se encontraron sedes con los filtros aplicados</p>
            </div>
        `;
        return;
    }
    
    // Usar la función createSedeCard del módulo ui-sedes
    filteredSedes.forEach(sede => {
        if (typeof createSedeCard === 'function') {
            const card = createSedeCard(sede);
            container.appendChild(card);
        } else {
            console.error('❌ Función createSedeCard no disponible');
        }
    });
}

// Hacer disponible globalmente
window.filterSedes = filterSedes;
window.renderSedesFiltered = renderSedesFiltered;
