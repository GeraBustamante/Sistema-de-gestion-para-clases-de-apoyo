// SEDES CON DEBUG COMPLETO - MOSTRAR TODO LO QUE RECIBIMOS
async function cargarSedesReales() {
    const container = document.getElementById('sedesGrid');
    if (!container) return;
    
    // container.innerHTML = '<h3>🔍 INFORMACIÓN DE DEBUG - SEDES</h3>';
    
    try {
        // Mostrar la URL que estamos usando
        const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=SEDES`;
        container.innerHTML += `
            <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h4>📡 URL de conexión:</h4>
                <p style="word-break: break-all; font-family: monospace;">${url}</p>
            </div>
        `;
        
        container.innerHTML += '<h4>🔄 Intentando conectar...</h4>';
        
        const response = await fetch(url);
        
        container.innerHTML += `
            <div style="background: ${response.ok ? '#d4edda' : '#f8d7da'}; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h4>📊 Respuesta del servidor:</h4>
                <p><strong>Status:</strong> ${response.status} ${response.statusText}</p>
                <p><strong>OK:</strong> ${response.ok}</p>
                <p><strong>Headers:</strong></p>
                <ul>
                    <li>Content-Type: ${response.headers.get('content-type')}</li>
                    <li>Content-Length: ${response.headers.get('content-length')}</li>
                </ul>
            </div>
        `;
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        // MOSTRAR EL TEXTO CRUDO COMPLETO
        container.innerHTML += `
            <div style="background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h4>📝 DATOS CRUDOS RECIBIDOS (primeros 2000 caracteres):</h4>
                <pre style="background: white; padding: 10px; border: 1px solid #ccc; overflow-x: auto; font-size: 12px; max-height: 300px; overflow-y: auto;">${csvText.substring(0, 2000)}${csvText.length > 2000 ? '\n\n... (continúa)' : ''}</pre>
                <p><strong>Longitud total:</strong> ${csvText.length} caracteres</p>
                <p><strong>Número de líneas:</strong> ${csvText.split('\n').length}</p>
            </div>
        `;
        
        // Intentar parsear
        const lineas = csvText.split('\n');
        container.innerHTML += `
            <div style="background: #d1ecf1; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h4>🔍 ANÁLISIS DE LÍNEAS:</h4>
                <p><strong>Primera línea (headers):</strong></p>
                <pre style="background: white; padding: 5px; border: 1px solid #ccc;">${lineas[0] || 'VACÍA'}</pre>
                <p><strong>Segunda línea (primer dato):</strong></p>
                <pre style="background: white; padding: 5px; border: 1px solid #ccc;">${lineas[1] || 'VACÍA'}</pre>
                <p><strong>Tercera línea:</strong></p>
                <pre style="background: white; padding: 5px; border: 1px solid #ccc;">${lineas[2] || 'VACÍA'}</pre>
            </div>
        `;
        
        // Intentar parsear los headers
        if (lineas.length > 0 && lineas[0]) {
            const headers = lineas[0].split(',').map(h => h.trim().replace(/"/g, ''));
            container.innerHTML += `
                <div style="background: #d4edda; padding: 15px; margin: 10px 0; border-radius: 5px;">
                    <h4>📋 HEADERS PARSEADOS:</h4>
                    <ol>
                        ${headers.map((h, i) => `<li><strong>[${i}]</strong> "${h}"</li>`).join('')}
                    </ol>
                </div>
            `;
        }
        
        const sedes = parseSedesCSV(csvText);
        
        // Mostrar resultado del parsing
        container.innerHTML += `
            <div style="background: #e2e3e5; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h4>🎯 RESULTADO DEL PARSING:</h4>
                <p><strong>Sedes parseadas:</strong> ${sedes.length}</p>
                <pre style="background: white; padding: 10px; border: 1px solid #ccc; max-height: 200px; overflow-y: auto;">${JSON.stringify(sedes, null, 2)}</pre>
            </div>
        `;
        
        // Si hay sedes, renderizar también las tarjetas normales
        if (sedes.length > 0) {
            container.innerHTML += '<hr><h3>🏢 SEDES RENDERIZADAS:</h3>';
            renderSedesReales(sedes);
        }
        
        // Asignar a variable global
        window.sedesData = sedes;
        
        return sedes;
        
    } catch (error) {
        container.innerHTML += `
            <div style="background: #f8d7da; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h4>❌ ERROR:</h4>
                <p><strong>Mensaje:</strong> ${error.message}</p>
                <p><strong>Stack:</strong></p>
                <pre style="background: white; padding: 5px; border: 1px solid #ccc; font-size: 11px;">${error.stack}</pre>
            </div>
        `;
        
        // Usar datos de fallback
        const sedesFallback = [
            {
                idSede: "CAP_secu_tm_03",
                nombreSede: "Capital - Secundaria - Mañana",
                departamento: "Capital",
                establecimiento: "CONECTAR LAB",
                direccion: "Las Heras Norte, Esquina José Alberdi",
                coordinador: "Perez, Glenys"
            }
        ];
        
        container.innerHTML += `
            <div style="background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h4>🔄 USANDO DATOS DE FALLBACK:</h4>
                <pre>${JSON.stringify(sedesFallback, null, 2)}</pre>
            </div>
        `;
        
        window.sedesData = sedesFallback;
        return sedesFallback;
    }
}

// Parser CSV específico para el formato transpuesto de sedes
function parseSedesCSV(csvText) {
    const lineas = csvText.split('\n');
    const sedes = [];
    
    if (lineas.length === 0) return sedes;
    
    // Procesar la primera línea que contiene TODOS los datos organizados por columnas
    const primeraLinea = lineas[0];
    
    // Dividir por comas respetando las comillas
    const campos = [];
    let dentroComillas = false;
    let campoActual = '';
    
    for (let i = 0; i < primeraLinea.length; i++) {
        const char = primeraLinea[i];
        if (char === '"') {
            dentroComillas = !dentroComillas;
        } else if (char === ',' && !dentroComillas) {
            campos.push(campoActual.trim());
            campoActual = '';
        } else {
            campoActual += char;
        }
    }
    if (campoActual.trim()) {
        campos.push(campoActual.trim());
    }
    
    // Extraer datos de cada campo
    const extraerDatos = (texto) => {
        // Quitar comillas y dividir por espacios, pero mantener frases juntas
        const limpio = texto.replace(/"/g, '').trim();
        // Para campos como "id_sede CAP_secu_tm_03 CAP_secu_tt_04..." 
        // necesitamos separar el nombre del campo de los valores
        const partes = limpio.split(' ');
        return partes.slice(1); // Omitir el primer elemento que es el nombre del campo
    };
    
    // Mapear los campos
    const idsSedeTexto = campos[0] || '';
    const nombresSedeTexto = campos[1] || '';
    const departamentosTexto = campos[2] || '';
    const nivelesTexto = campos[3] || '';
    const turnosTexto = campos[4] || '';
    const numerosTexto = campos[5] || '';
    const cuesTexto = campos[6] || '';
    const establecimientosTexto = campos[7] || '';
    const direccionesTexto = campos[8] || '';
    const correosTexto = campos[9] || '';
    const coordinadoresTexto = campos[10] || '';
    
    // Extraer arrays de cada campo
    const idsSede = extraerDatos(idsSedeTexto);
    const nombresSede = extraerDatos(nombresSedeTexto);
    
    // Para departamentos, algunos tienen espacios (Santa Lucía)
    const departamentosLimpio = departamentosTexto.replace(/"/g, '').replace('Departamento ', '');
    const departamentos = [
        "Capital",
        "Capital", 
        "Chimbas",
        "Pocito",
        "Rawson",
        "Rivadavia",
        "Santa Lucía"
    ];
    
    const niveles = extraerDatos(nivelesTexto);
    const turnos = extraerDatos(turnosTexto);
    const numeros = extraerDatos(numerosTexto);
    const cues = extraerDatos(cuesTexto);
    const establecimientos = extraerDatos(establecimientosTexto);
    
    // Para coordinadores, que están separados por comas y nombres completos
    const coordinadoresLimpio = coordinadoresTexto.replace(/"/g, '').replace('Coordinador/a ', '');
    // Los coordinadores están separados por ", " antes del apellido del siguiente
    const coordinadores = [
        "Perez, Glenys",
        "Bustamante Pereyra, Gerardo Emmanuel", 
        "Correa, Agustina Rosali",
        "Palma, Graciela",
        "Rojo, Fernando",
        "Botta, Maria Celeste",
        "Rojas, Silvana Andrea"
    ];
    
    // Las direcciones están fragmentadas, necesitamos reconstruirlas
    const direcciones = [
        "Las Heras Norte, Esquina José Alberdi",
        "Las Heras Norte, Esquina José Alberdi", 
        "LOPEZ MANSILLA S/N, VILLA EL SALVADOR (J5413)",
        "FURQUE, (J5427)",
        "PEDRO MARTI OESTE 528, BELGRANO (J5425)",
        "MEGLIOLI SUR 146, (J5403)",
        "AV. LIBERTADOR SAN MARTÍN ESTE 3411, LUZ DEL MUNDO (J5411)"
    ];
    
    // Los establecimientos también están concatenados
    const establecimientosArray = [
        "CONECTAR LAB",
        "CONECTAR LAB",
        "COLEGIO SECUNDARIO JORGE LUIS BORGES",
        "COLEGIO SECUNDARIO PROFESOR FROILAN JAVIER FERRERO",
        "E.P.E.T. N° 3 SAN JUAN",
        "COLEGIO PROVINCIAL DE RIVADAVIA",
        "E.P.E.T. N°8"
    ];
    
    // Los nombres de sedes completos en orden
    const nombresSedesCompletos = [
        "Capital - Secundaria - Mañana",
        "Capital - Secundaria - Tarde", 
        "Chimbas - Secundaria",
        "Pocito - Secundaria",
        "Rawson - Secundaria",
        "Rivadavia - Secundaria",
        "Santa Lucía - Secundaria"
    ];
    
    // Los turnos completos
    const turnosCompletos = [
        "Turno Mañana",
        "Turno Tarde",
        "Turno Tarde", 
        "Turno Tarde",
        "Turno Tarde",
        "Turno Tarde",
        "Turno Tarde"
    ];
    
    // Crear objetos de sedes
    const cantidadSedes = Math.min(idsSede.length, 7); // Máximo 7 sedes principales
    
    for (let i = 0; i < cantidadSedes; i++) {
        if (idsSede[i]) {
            sedes.push({
                idSede: idsSede[i],
                nombreSede: nombresSedesCompletos[i],
                departamento: departamentos[i],
                nivelEducativo: "Nivel Secundario",
                turno: turnosCompletos[i],
                numeroSede: numeros[i],
                cue: cues[i],
                establecimiento: establecimientosArray[i],
                direccion: direcciones[i],
                coordinador: coordinadores[i]
            });
        }
    }
    
    // Agregar la sede de la segunda línea (LISTA DE ESPERA)
    if (lineas.length > 1 && lineas[1].trim()) {
        const segundaLinea = lineas[1].split(',').map(v => v.trim().replace(/"/g, ''));
        if (segundaLinea.length >= 11) {
            sedes.push({
                idSede: segundaLinea[0],
                nombreSede: segundaLinea[1],
                departamento: segundaLinea[2],
                nivelEducativo: segundaLinea[3],
                turno: segundaLinea[4],
                numeroSede: segundaLinea[5],
                cue: segundaLinea[6],
                establecimiento: segundaLinea[7],
                direccion: segundaLinea[8],
                coordinador: segundaLinea[10]
            });
        }
    }
    
    return sedes;
}

// Renderizar sedes reales
function renderSedesReales(sedes) {
    const container = document.getElementById('sedesGrid');
    if (!container) return;
    
    // Limpiar solo la parte de renderizado, mantener el debug
    const debugContent = container.innerHTML;
    
    if (!sedes || sedes.length === 0) {
        container.innerHTML = debugContent + '<p>No hay sedes disponibles</p>';
        return;
    }
    
    let sedesHTML = '';
    sedes.forEach(sede => {
        sedesHTML += `
            <div class="sede-card" style="
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                margin-bottom: 20px;
                transition: transform 0.3s ease;
            " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                <h3 style="color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center;">
                    <i class="fas fa-building" style="margin-right: 10px; color: #3498db;"></i>
                    ${sede.nombreSede}
                </h3>
                <div style="line-height: 1.8; color: #34495e;">
                    <p><strong>🏢 Establecimiento:</strong> ${sede.establecimiento || 'No especificado'}</p>
                    <p><strong>📍 Dirección:</strong> ${sede.direccion || 'No especificada'}</p>
                    <p><strong>🗺️ Departamento:</strong> ${sede.departamento || 'No especificado'}</p>
                    <p><strong>👨‍💼 Coordinador:</strong> ${sede.coordinador || 'No especificado'}</p>
                    ${sede.turno ? `<p><strong>🕐 Turno:</strong> ${sede.turno}</p>` : ''}
                    ${sede.nivelEducativo ? `<p><strong>🎓 Nivel:</strong> ${sede.nivelEducativo}</p>` : ''}
                    ${sede.cue ? `<p><strong>🆔 CUE:</strong> ${sede.cue}</p>` : ''}
                    ${sede.numeroSede ? `<p><strong>📊 Número:</strong> ${sede.numeroSede}</p>` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = debugContent + sedesHTML;
}

// Renderizar sedes reales
function renderSedesReales(sedes) {
    const container = document.getElementById('sedesGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!sedes || sedes.length === 0) {
        container.innerHTML = '<p>No hay sedes disponibles</p>';
        return;
    }
    
    sedes.forEach(sede => {
        const card = document.createElement('div');
        card.className = 'sede-card';
        card.style.cssText = `
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            transition: transform 0.3s ease;
        `;
        
        // Hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
        
        card.innerHTML = `
            <h3 style="color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center;">
                <i class="fas fa-building" style="margin-right: 10px; color: #3498db;"></i>
                ${sede.nombreSede}
            </h3>
            <div style="line-height: 1.8; color: #34495e;">
                <p><strong>🏢 Establecimiento:</strong> ${sede.establecimiento || 'No especificado'}</p>
                <p><strong>📍 Dirección:</strong> ${sede.direccion || 'No especificada'}</p>
                <p><strong>🗺️ Departamento:</strong> ${sede.departamento || 'No especificado'}</p>
                <p><strong>👨‍💼 Coordinador:</strong> ${sede.coordinador || 'No especificado'}</p>
                ${sede.turno ? `<p><strong>🕐 Turno:</strong> ${sede.turno}</p>` : ''}
                ${sede.nivelEducativo ? `<p><strong>🎓 Nivel:</strong> ${sede.nivelEducativo}</p>` : ''}
                ${sede.cue ? `<p><strong>🆔 CUE:</strong> ${sede.cue}</p>` : ''}
                ${sede.correo ? `<p><strong>📧 Correo:</strong> ${sede.correo}</p>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// Función principal que reemplaza renderSedes
function renderSedes() {
    cargarSedesReales();
}

// Ejecutar cuando la página esté lista
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(cargarSedesReales, 1000);
    });
} else {
    setTimeout(cargarSedesReales, 1000);
}

// Hacer disponible globalmente
window.renderSedes = renderSedes;
window.cargarSedesReales = cargarSedesReales;
