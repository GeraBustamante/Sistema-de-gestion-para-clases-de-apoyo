// ====================================
// CONFIGURACIÓN Y GESTIÓN DE ETAPAS
// ====================================

// ID de la hoja de configuración de etapas
const ETAPAS_CONFIG = {
    spreadsheetId: '1kGr_ib8pxMZVKKIXWR8m2B_ovs5hE6KBqkT1HDpnlpE',
    sheetName: 'ETAPAS',
    // URL alternativa usando export
    useExportUrl: true
};

// Variables globales para etapas
window.etapasDisponibles = [];
window.etapaActual = null;

// Función para cargar etapas desde Google Sheets
async function cargarEtapas() {
    try {
        const timestamp = new Date().getTime();
        
        // Intentar primero con formato export (más confiable)
        let url = `https://docs.google.com/spreadsheets/d/${ETAPAS_CONFIG.spreadsheetId}/export?format=csv&gid=0&t=${timestamp}`;
        
        let response = await fetch(url);
        
        // Si falla, intentar con gviz
        if (!response.ok) {
            url = `https://docs.google.com/spreadsheets/d/${ETAPAS_CONFIG.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${ETAPAS_CONFIG.sheetName}&t=${timestamp}`;
            response = await fetch(url);
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const csvText = await response.text();
        
        if (!csvText || csvText.trim() === '') {
            throw new Error('CSV vacío recibido');
        }
        
        const etapas = parseEtapasCSV(csvText);
        
        if (etapas.length === 0) {
            throw new Error('No se encontraron etapas válidas en el CSV');
        }
        
        window.etapasDisponibles = etapas;
        
        // Poblar el selector
        poblarSelectorEtapas(etapas);
        
        // Seleccionar etapa por defecto (la primera activa o la primera disponible)
        if (etapas.length > 0) {
            const etapaPorDefecto = etapas[0]; // Por ahora la primera
            seleccionarEtapa(etapaPorDefecto.id);
        }
        
        return etapas;
        
    } catch (error) {
        console.error('Error cargando etapas:', error);
        
        // Mostrar error en el selector
        const selector = document.getElementById('selectorEtapa');
        if (selector) {
            selector.innerHTML = '<option value="">Error: No se pudieron cargar las etapas</option>';
        }
        
        return [];
    }
}

// Parser para CSV de etapas
function parseEtapasCSV(csvText) {
    const lineas = csvText.split('\n').filter(line => line.trim() !== '');
    const etapas = [];
    
    if (lineas.length === 0) {
        return etapas;
    }
    
    // Primera línea son los headers
    const headers = lineas[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Validar que tenemos las columnas mínimas necesarias
    const columnasRequeridas = ['id', 'nombre', 'link_base'];
    const columnasValidas = columnasRequeridas.every(col => 
        headers.some(h => h.toLowerCase().includes(col.toLowerCase()))
    );
    
    if (!columnasValidas) {
        return etapas;
    }
    
    // Procesar cada fila de datos
    for (let i = 1; i < lineas.length; i++) {
        const linea = lineas[i].trim();
        if (!linea) continue;
        
        const valores = linea.split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (valores.length >= 3 && valores[0]) { // Mínimo id, nombre, link_base
            const etapa = {
                id: valores[0],
                fecha_inicio: valores[1] || '',
                fecha_final: valores[2] || '',
                nivel: valores[3] || '',
                nombre: valores[4] || valores[0], // Si no hay nombre, usar id
                link_base: valores[5] || '',
                link_asistencia: valores[6] || '',
                disponible: valores[7] ? (valores[7].toLowerCase() === 'true' || valores[7] === '1') : true
            };
            
            etapas.push(etapa);
        }
    }
    
    return etapas;
}

// Poblar el selector con las etapas disponibles
function poblarSelectorEtapas(etapas) {
    const selector = document.getElementById('selectorEtapa');
    if (!selector) return;
    
    // Limpiar opciones existentes
    selector.innerHTML = '';
    
    etapas.forEach(etapa => {
        const option = document.createElement('option');
        option.value = etapa.id;
        
        // Configurar texto y disponibilidad
        if (etapa.disponible === false) {
            option.textContent = `${etapa.nombre} (No disponible)`;
            option.disabled = true;
            option.style.color = '#999';
            option.style.fontStyle = 'italic';
        } else {
            option.textContent = etapa.nombre;
        }
        
        // Agregar clase CSS según el nivel
        if (etapa.nivel.includes('Primario')) {
            option.className = 'etapa-primaria';
        } else if (etapa.nivel.includes('Secundario')) {
            option.className = 'etapa-secundaria';
        }
        
        selector.appendChild(option);
    });
}

// Seleccionar una etapa específica
function seleccionarEtapa(etapaId) {
    const etapa = window.etapasDisponibles.find(e => e.id === etapaId);
    if (!etapa) return;
    
    // Actualizar etapa actual
    window.etapaActual = etapa;
    
    // Actualizar selector
    const selector = document.getElementById('selectorEtapa');
    if (selector) {
        selector.value = etapaId;
    }
    
    // Actualizar información visual
    actualizarInfoEtapa(etapa);
}

// Actualizar la información visual de la etapa
function actualizarInfoEtapa(etapa) {
    const nivelElement = document.getElementById('etapaNivel');
    const periodoElement = document.getElementById('etapaPeriodo');
    
    if (nivelElement) {
        nivelElement.textContent = etapa.nivel;
        nivelElement.className = 'etapa-nivel';
        
        // Agregar clase específica del nivel
        if (etapa.nivel.includes('Primario')) {
            nivelElement.classList.add('nivel-primario');
        } else if (etapa.nivel.includes('Secundario')) {
            nivelElement.classList.add('nivel-secundario');
        }
    }
    
    if (periodoElement) {
        // Función para parsear fecha en formato dd-mm-yyyy
        const parsearFecha = (fechaStr) => {
            if (!fechaStr || fechaStr.trim() === '') return null;
            
            // Si la fecha está en formato dd-mm-yyyy
            const partes = fechaStr.trim().split('-');
            if (partes.length === 3) {
                const dia = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10) - 1; // Los meses en JS van de 0-11
                const año = parseInt(partes[2], 10);
                
                if (!isNaN(dia) && !isNaN(mes) && !isNaN(año)) {
                    return new Date(año, mes, dia);
                }
            }
            
            // Si no se puede parsear, intentar con Date nativo
            try {
                return new Date(fechaStr);
            } catch (e) {
                return null;
            }
        };
        
        const fechaInicio = parsearFecha(etapa.fecha_inicio);
        const fechaFinal = parsearFecha(etapa.fecha_final);
        
        if (fechaInicio && fechaFinal) {
            const inicio = fechaInicio.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            const final = fechaFinal.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            periodoElement.textContent = `${inicio} - ${final}`;
        } else {
            // Si las fechas no se pueden parsear, mostrar texto plano
            periodoElement.textContent = `${etapa.fecha_inicio} - ${etapa.fecha_final}`;
        }
    }
}

// Función llamada cuando cambia el selector - FASE 2: Cambio real de datos
function cambiarEtapa() {
    const selector = document.getElementById('selectorEtapa');
    if (!selector) return;
    
    const etapaId = selector.value;
    if (!etapaId) return;
    
    // Buscar la etapa seleccionada
    const etapa = window.etapasDisponibles.find(e => e.id === etapaId);
    if (!etapa) return;
    
    // Verificar si está disponible
    if (etapa.disponible === false) {
        // Mostrar mensaje y revertir selección
        alert(`La etapa "${etapa.nombre}" no está disponible actualmente.`);
        
        // Volver a la etapa anterior
        if (window.etapaActual) {
            selector.value = window.etapaActual.id;
        }
        return;
    }
    
    // Si está disponible, seleccionar
    seleccionarEtapa(etapaId);
    
    // FASE 2: Actualizar configuración y recargar datos
    // Actualizar configuración de URLs
    if (typeof actualizarConfiguracionEtapa === 'function') {
        actualizarConfiguracionEtapa(etapa);
        
        // Forzar recarga completa limpiando los estados
        if (typeof dataLoaded === 'function') {
            window.dataLoaded = false;
        }
        
        // Limpiar interfaz
        if (typeof limpiarInterfaz === 'function') {
            limpiarInterfaz();
        }
        
        // Recargar todos los datos con la nueva configuración
        if (typeof loadDataWithButton === 'function') {
            loadDataWithButton();
        } else if (typeof loadAllData === 'function') {
            loadAllData();
        }
    }
}

// Función para limpiar la interfaz antes de cambiar de etapa
function limpiarInterfaz() {
    // Limpiar dashboard
    const elements = ['totalAlumnos', 'totalDocentes', 'totalGrupos', 'totalSedes'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
    
    // Limpiar cards de alumnos
    const alumnosCards = document.getElementById('alumnosCards');
    if (alumnosCards) alumnosCards.innerHTML = '';
    
    // Limpiar tabla de alumnos
    const alumnosTable = document.querySelector('#alumnosTable tbody');
    if (alumnosTable) alumnosTable.innerHTML = '';
    
    // Limpiar grid de sedes
    const sedesGrid = document.getElementById('sedesGrid');
    if (sedesGrid) sedesGrid.innerHTML = '';
    
    // Limpiar grid de grupos
    const groupsGrid = document.getElementById('groupsGrid');
    if (groupsGrid) groupsGrid.innerHTML = '';
}

// Inicializar etapas cuando carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que carguen otros scripts
    setTimeout(cargarEtapas, 1000);
});

// Hacer funciones disponibles globalmente
window.cargarEtapas = cargarEtapas;
window.cambiarEtapa = cambiarEtapa;
window.seleccionarEtapa = seleccionarEtapa;
