// ====================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ====================================

// Variables globales para almacenar los datos
window.alumnosData = [];
window.docentesData = [];
window.asistenciasData = [];

// Variables window para consistencia con el sistema modular
window.gruposData = [];
window.sedesData = [];

// Configuración de Google Sheets (global)
window.sheetsConfig = {
    spreadsheetId: '1YoWb4hJ-vT8-h7ns3nwVHirlLfRmBxbHt0xjTNzLs00',
    // Segundo spreadsheet para asistencias
    asistenciasSpreadsheetId: '1VqPqbmwRz7rkFy7Efs8OG-eD6-0qXumUzwBqwTb1vnE',
    asistenciasSheet: 'D',
    // Usar CSV export que no tiene problemas de CORS
    baseUrl: 'https://docs.google.com/spreadsheets/d/1YoWb4hJ-vT8-h7ns3nwVHirlLfRmBxbHt0xjTNzLs00/export?format=csv&gid=',
    gids: {
        'ALUMNOS': '0',
        'DOCENTES': '1264916165',
        'GRUPOS': '1264916165',
        'SEDES': '1264916165'
    },
    alumnosSheet: 'ALUMNOS',
    docentesSheet: 'DOCENTES', 
    gruposSheet: 'GRUPOS',
    sedesSheet: 'SEDES'
};

// Datos de ejemplo para desarrollo
const datosEjemplo = {
    alumnos: [
        {
            dni_alumno: "12345678",
            nombre_alumno: "Juan Pérez",
            edad: 16,
            dni_tutor: "87654321",
            nombre_tutor: "María Pérez",
            email: "maria@email.com",
            tel: "123456789",
            residencia: "Buenos Aires",
            nivel_educativo: "Secundario",
            ciclo: "Básico",
            año: "2°",
            turno: "Mañana",
            sede: "Sede Central",
            grupo_a: "A1",
            asignatura: "Matemática",
            docente_a_cargo: "Prof. González",
            estado: "Activo",
            porcentaje_asistencia: "85%",
            cantidad_asistencias: 34,
            observaciones: "Buen rendimiento"
        },
        {
            dni_alumno: "23456789",
            nombre_alumno: "Ana López",
            edad: 15,
            dni_tutor: "98765432",
            nombre_tutor: "Carlos López",
            email: "carlos@email.com",
            tel: "987654321",
            residencia: "Córdoba",
            nivel_educativo: "Secundario",
            ciclo: "Básico",
            año: "1°",
            turno: "Tarde",
            sede: "Sede Norte",
            grupo_a: "B2",
            asignatura: "Lengua",
            docente_a_cargo: "Prof. Martínez",
            estado: "Activo",
            porcentaje_asistencia: "92%",
            cantidad_asistencias: 46,
            observaciones: "Excelente alumna"
        }
    ],
    docentes: [
        {
            dni: "11111111",
            nombre_completo: "Prof. González",
            email: "gonzalez@escuela.com",
            tel: "111111111",
            residencia: "Buenos Aires",
            sede: "Sede Central",
            nivel_educativo: "Secundario",
            materias: "Matemática, Física",
            matematica: "Sí",
            lengua: "No",
            fisica: "Sí",
            quimica: "No",
            ingles: "No",
            cant_grupos_asignados: 3,
            cant_alum_asignados: 45
        },
        {
            dni: "22222222",
            nombre_completo: "Prof. Martínez",
            email: "martinez@escuela.com",
            tel: "222222222",
            residencia: "Córdoba",
            sede: "Sede Norte",
            nivel_educativo: "Secundario",
            materias: "Lengua, Inglés",
            matematica: "No",
            lengua: "Sí",
            fisica: "No",
            quimica: "No",
            ingles: "Sí",
            cant_grupos_asignados: 2,
            cant_alum_asignados: 32
        }
    ],
    grupos: [
        {
            id_grupo: "G001",
            materia: "Matemática",
            turno: "Mañana",
            nivel: "Secundario",
            ciclo: "Básico",
            grupo: "A1",
            sede: "Sede Central",
            lunes: "08:00-10:00",
            martes: "",
            miercoles: "08:00-10:00",
            jueves: "",
            viernes: "08:00-10:00",
            cardinal: 15,
            cupo_max: 20,
            docente: "Prof. González",
            ocupacion: "75%"
        },
        {
            id_grupo: "G002",
            materia: "Lengua",
            turno: "Tarde",
            nivel: "Secundario",
            ciclo: "Básico",
            grupo: "B2",
            sede: "Sede Norte",
            lunes: "",
            martes: "14:00-16:00",
            miercoles: "",
            jueves: "14:00-16:00",
            viernes: "",
            cardinal: 12,
            cupo_max: 18,
            docente: "Prof. Martínez",
            ocupacion: "67%"
        }
    ],
    sedes: [
        {
            idSede: "S001",
            nombreSede: "Sede Central",
            departamento: "Capital",
            nivelEducativo: "Nivel Secundario",
            turno: "Turno Mañana",
            numeroSede: "001",
            cue: "1234567890",
            establecimiento: "Escuela Técnica N° 1",
            direccion: "Av. Principal 123",
            correo: "central@escuela.com",
            coordinador: "Lic. Rodríguez"
        },
        {
            idSede: "S002",
            nombreSede: "Sede Norte",
            departamento: "Norte",
            nivelEducativo: "Nivel Secundario",
            turno: "Turno Tarde",
            numeroSede: "002",
            cue: "0987654321",
            establecimiento: "Colegio San Martín",
            direccion: "Calle Norte 456",
            correo: "norte@escuela.com",
            coordinador: "Lic. Fernández"
        }
    ]
};

// ====================================
// FUNCIÓN PARA ACTUALIZAR CONFIGURACIÓN SEGÚN ETAPA
// ====================================

// Función para actualizar URLs según la etapa seleccionada (FASE 2)
function actualizarConfiguracionEtapa(etapa) {
    if (!etapa || !etapa.link_base) {
        return;
    }
    
    // Limpiar datos anteriores
    window.alumnosData = [];
    window.docentesData = [];
    window.asistenciasData = [];
    window.gruposData = [];
    window.sedesData = [];
    
    // Extraer IDs limpios de las URLs (por si tienen el link completo)
    const idBase = extraerIdDeUrl(etapa.link_base);
    const idAsistencia = etapa.link_asistencia ? extraerIdDeUrl(etapa.link_asistencia) : idBase;
    
    // Actualizar spreadsheetId base
    window.sheetsConfig.spreadsheetId = idBase;
    window.sheetsConfig.baseUrl = `https://docs.google.com/spreadsheets/d/${idBase}/export?format=csv&gid=`;
    
    // Si hay link de asistencias, usar ese, sino usar el base
    window.sheetsConfig.asistenciasSpreadsheetId = idAsistencia;
}

// Función para extraer ID de spreadsheet de una URL completa
function extraerIdDeUrl(urlCompleta) {
    if (!urlCompleta || typeof urlCompleta !== 'string') {
        return urlCompleta;
    }
    
    // Si ya es solo un ID (no contiene 'http'), devolverlo tal como está
    if (!urlCompleta.includes('http')) {
        return urlCompleta;
    }
    
    // Extraer ID de URL completa
    const match = urlCompleta.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
        return match[1];
    }
    
    // Si no se puede extraer, devolver original
    return urlCompleta;
}
