// ====================================
// ARCHIVO PRINCIPAL DE INICIALIZACIÓN
// ====================================

// Variables globales de estado
let currentTab = 'dashboard';
let dataLoaded = false;

// Inicialización del sistema
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegación
    setupNavigation();
    
    // Configurar eventos de interfaz
    setupEventListeners();
    
    // Cargar configuración guardada
    loadSavedConfig();
    
    // Cargar datos iniciales
    loadInitialData();
    
    console.log('Sistema inicializado correctamente');
});

// Configurar navegación entre secciones
function setupNavigation() {
    // Navegación principal
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            if (target) {
                showSection(target);
            }
        });
    });
    
    // Mostrar dashboard por defecto
    setTimeout(() => {
        showSection('dashboard');
    }, 100); // Pequeño delay para asegurar que el DOM esté listo
}

// Configurar todos los event listeners
function setupEventListeners() {
    // Botones de configuración
    const configBtn = document.getElementById('configBtn');
    if (configBtn) {
        configBtn.addEventListener('click', () => {
            document.getElementById('configModal').style.display = 'block';
        });
    }
    
    // Modal de configuración
    const configModal = document.getElementById('configModal');
    const closeBtn = configModal?.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            configModal.style.display = 'none';
        });
    }
    
    // Botón de cargar datos
    const loadDataBtn = document.getElementById('loadDataBtn');
    if (loadDataBtn) {
        loadDataBtn.addEventListener('click', loadRealData);
    }
    
    // Botón de usar datos de ejemplo
    const exampleDataBtn = document.getElementById('exampleDataBtn');
    if (exampleDataBtn) {
        exampleDataBtn.addEventListener('click', loadExampleData);
    }
    
    // Filtros y búsquedas de alumnos
    const searchAlumnos = document.getElementById('searchAlumnos');
    const filterSede = document.getElementById('filterSede');
    const filterNivel = document.getElementById('filterNivel');
    const filterEstado = document.getElementById('filterEstado');
    
    if (searchAlumnos) {
        searchAlumnos.addEventListener('input', debounce(filterAlumnos, 300));
    }
    if (filterSede) {
        filterSede.addEventListener('change', filterAlumnos);
    }
    if (filterNivel) {
        filterNivel.addEventListener('change', filterAlumnos);
    }
    if (filterEstado) {
        filterEstado.addEventListener('change', filterAlumnos);
    }
    
    // Filtros y búsquedas de docentes
    const searchDocentes = document.getElementById('searchDocentes');
    const filterMaterias = document.getElementById('filterMaterias');
    
    if (searchDocentes) {
        searchDocentes.addEventListener('input', debounce(filterDocentes, 300));
    }
    if (filterMaterias) {
        filterMaterias.addEventListener('change', filterDocentes);
    }
    
    // Filtros y búsquedas de grupos
    const searchGrupos = document.getElementById('searchGrupos');
    const filterTurno = document.getElementById('filterTurno');
    
    if (searchGrupos) {
        searchGrupos.addEventListener('input', debounce(filterGrupos, 300));
    }
    if (filterTurno) {
        filterTurno.addEventListener('change', filterGrupos);
    }
    
    // Filtros y búsquedas de sedes
    const searchSedes = document.getElementById('searchSedes');
    if (searchSedes) {
        searchSedes.addEventListener('input', debounce(filterSedes, 300));
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === configModal) {
            configModal.style.display = 'none';
        }
    });
}

// Función debounce para optimizar búsquedas
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Cargar configuración guardada
function loadSavedConfig() {
    const savedConfig = localStorage.getItem('sheetsConfig');
    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        // Cargar URLs en los campos del modal
        const sheetUrlInput = document.getElementById('sheetUrl');
        const asistenciasUrlInput = document.getElementById('asistenciasUrl');
        
        if (sheetUrlInput && config.sheetUrl) {
            sheetUrlInput.value = config.sheetUrl;
        }
        if (asistenciasUrlInput && config.asistenciasUrl) {
            asistenciasUrlInput.value = config.asistenciasUrl;
        }
        
        // Actualizar configuración global
        window.sheetsConfig.sheetUrl = config.sheetUrl || window.sheetsConfig.sheetUrl;
        window.sheetsConfig.asistenciasUrl = config.asistenciasUrl || window.sheetsConfig.asistenciasUrl;
    }
}

// Cargar datos iniciales
function loadInitialData() {
    console.log('🚀 Iniciando carga automática de datos...');
    
    // Verificar si hay configuración válida de Google Sheets
    if (window.sheetsConfig.spreadsheetId && window.sheetsConfig.spreadsheetId !== 'TU_SPREADSHEET_ID_AQUI') {
        console.log('📊 Configuración encontrada, cargando datos reales...');
        // Cargar datos reales automáticamente
        loadData();
    } else {
        console.log('⚠️ No se encontró configuración de Google Sheets');
        console.log('📝 Sistema iniciado - Configura tu Google Sheets o haz clic en "Actualizar Datos"');
        
        // Inicializar arrays vacíos (usando variables globales consistentes)
        window.alumnosData = [];
        docentesData = [];
        window.gruposData = [];
        window.sedesData = [];
        asistenciasData = [];
        
        // Renderizar interfaz vacía
        renderDashboard();
    }
}

// Cargar datos de ejemplo
function loadExampleData() {
    try {
        // Usar datos de ejemplo de config.js (usando variables globales consistentes)
        window.alumnosData = [...datosEjemplo.alumnos];
        docentesData = [...datosEjemplo.docentes];
        window.gruposData = [...datosEjemplo.grupos];
        window.sedesData = [...datosEjemplo.sedes];
        asistenciasData = [...datosEjemplo.asistencias];
        
        dataLoaded = true;
        
        // Actualizar interfaz
        updateAllSections();
        populateFilters();
        
        showSuccessMessage('Datos de ejemplo cargados correctamente');
        
        console.log('Datos de ejemplo cargados:', {
            alumnos: window.alumnosData.length,
            docentes: docentesData.length,
            grupos: window.gruposData?.length || 0,
            sedes: window.sedesData?.length || 0,
            asistencias: asistenciasData.length
        });
        
    } catch (error) {
        console.error('Error cargando datos de ejemplo:', error);
        showErrorMessage('Error al cargar datos de ejemplo');
    }
}

// Actualizar todas las secciones
function updateAllSections() {
    if (!dataLoaded) return;
    
    // Actualizar dashboard
    renderDashboard();
    
    // Actualizar sección de alumnos
    renderAlumnos();
    
    // Actualizar sección de docentes
    renderDocentes();
    
    // Actualizar sección de grupos
    renderGrupos();
    
    // Actualizar sección de sedes
    renderSedes();
}

// Función para mostrar mensajes de éxito
function showSuccessMessage(message) {
    showNotification(message, 'success');
}

// Función para mostrar mensajes de error
function showErrorMessage(message) {
    showNotification(message, 'error');
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                max-width: 300px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease-out;
            }
            .notification-success {
                background-color: #28a745;
            }
            .notification-error {
                background-color: #dc3545;
            }
            .notification-info {
                background-color: #17a2b8;
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Configurar botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Función para actualizar el estado del botón de carga
function updateLoadButton(loading = false) {
    const btn = document.getElementById('btnActualizar');
    const texto = document.getElementById('btnActualizarTexto');
    const icono = btn.querySelector('i');
    
    if (loading) {
        btn.disabled = true;
        btn.classList.add('loading');
        icono.className = 'fas fa-spinner fa-spin';
        texto.textContent = 'Cargando...';
    } else {
        btn.disabled = false;
        btn.classList.remove('loading');
        icono.className = 'fas fa-sync-alt';
        texto.textContent = 'Actualizar Datos';
    }
}

// Mejorar la función loadData para usar el botón dinámico
async function loadDataWithButton() {
    updateLoadButton(true);
    try {
        await loadData();
    } finally {
        updateLoadButton(false);
    }
}

// Hacer disponibles las funciones globalmente
window.updateLoadButton = updateLoadButton;
window.loadDataWithButton = loadDataWithButton;

// Exportar funciones necesarias para otros módulos
window.showSuccessMessage = showSuccessMessage;
window.showErrorMessage = showErrorMessage;
window.dataLoaded = () => dataLoaded;
window.updateAllSections = updateAllSections;
