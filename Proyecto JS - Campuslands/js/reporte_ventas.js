let todasLasVentas = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarVentasIniciales();
    configurarFiltros();
});

async function cargarVentasIniciales() {
    try {
        const ventasCargadas = localStorage.getItem('ventas_iniciales_cargadas');
        let ventasExistentes = localStorage.getItem('ventas');

        if (!ventasExistentes || !ventasCargadas) {
            const respuesta = await fetch('../data/reporte_ventas.json');

            if (!respuesta.ok) {
                throw new Error(`Error al cargar el JSON: ${respuesta.status}`);
            }

            const ventasJSON = await respuesta.json();

            if (!Array.isArray(ventasJSON) || ventasJSON.length === 0) {
                throw new Error('El JSON no contiene un array válido de ventas');
            }
            localStorage.setItem('ventas', JSON.stringify(ventasJSON));
            localStorage.setItem('ventas_iniciales_cargadas', 'true');

            console.log(`✅ ${ventasJSON.length} ventas cargadas exitosamente en localStorage`);
            todasLasVentas = ventasJSON;
            mostrarVentas(ventasJSON);

        } else {
            console.log('✅ Mostrando ventas existentes en localStorage');
            todasLasVentas = JSON.parse(ventasExistentes)
            mostrarVentas(todasLasVentas);
        }

        establecerFechasPorDefecto();

    } catch (error) {
        console.error('❌ Error al cargar las ventas:', error);
        mostrarError(error.message);
    }
}

function mostrarError(mensaje) {
    const contenedor = document.getElementById('mensaje-error');
    if (contenedor) {
        contenedor.innerHTML = `
            <div style="background: #fee; color: #c00; padding: 15px; border-radius: 8px; margin: 20px;">
                <strong>❌ Error al cargar ventas:</strong> ${mensaje}
                <br><small>Verifica que el archivo reporte_ventas.json exista en la carpeta data/</small>
            </div>
        `;
    }
}

function mostrarVentas(ventas) {
    const container = document.getElementById('tabla-ventas-container');
    if (!container) return;
    if (!ventas || ventas.length === 0) {
        container.innerHTML = `
            <div class="ventas-header">
                <h2>📊 Reporte de Ventas</h2>
                <div class="ventas-stats">
                    <span>Total ventas: <strong>0</strong></span>
                    <span>Total ingresos: <strong>$0</strong></span>
                </div>
            </div>
            <div class="table-wrapper">
                <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                    <p style="font-size: 1.2rem;">📭 No hay ventas en este rango de fechas</p>
                    <p style="font-size: 0.9rem;">Intenta con un rango diferente o limpia los filtros</p>
                </div>
            </div>
        `;
        return;
    }

    let html = `
        <div class="ventas-header">
            <h2>📊 Reporte de Ventas</h2>
            <div class="ventas-stats">
                <span>Total ventas: <strong>${ventas.length}</strong></span>
                <span>Total ingresos: <strong>${formatearPrecio(calcularTotal(ventas))}</strong></span>
            </div>
        </div>
        <div class="table-wrapper">
            <table class="ventas-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Ciudad</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
    `;

    ventas.forEach((venta, index) => {
        const fecha = new Date(venta.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        const todosLosDetalles = venta.detalles.map(d =>
            `${d.nombre} (${d.cantidad}x)`
        ).join('<br>');

        html += `
            <tr>
                <td><span class="badge">${index + 1}</span></td>
                <td><strong>${venta.cliente.nombre}</strong></td>
                <td>${venta.cliente.email}</td>
                <td><span class="city-tag">${venta.ciudad}</span></td>
                <td>${fechaFormateada}</td>
                <td class="price">${formatearPrecio(venta.total)}</td>
                <td>
                    <div class="detalles-cell">
                        <div class="detalles-completos">
                            ${todosLosDetalles}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = html;
}


function formatearPrecio(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(valor);
}

function calcularTotal(ventas) {
    return ventas.reduce((sum, venta) => sum + venta.total, 0);
}

function configurarFiltros() {
    const btnLimpiar = document.getElementById('btn-limpiar');
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', limpiarFiltros);
    }
    if (fechaInicio) {
        fechaInicio.addEventListener('change', filtrarPorFechas);
    }
    if (fechaFin) {
        fechaFin.addEventListener('change', filtrarPorFechas);
    }
}

function establecerFechasPorDefecto() {
    if (todasLasVentas.length === 0) return;

    const fechas = todasLasVentas.map(v => new Date(v.fecha));
    const fechaMin = new Date(Math.min(...fechas));
    const fechaMax = new Date(Math.max(...fechas));

    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');

    if (fechaInicio) {
        fechaInicio.value = fechaMin.toISOString().split('T')[0];
    }
    if (fechaFin) {
        fechaFin.value = fechaMax.toISOString().split('T')[0];
    }
}

function filtrarPorFechas() {
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;

    let ventasFiltradas = [...todasLasVentas];

    if (fechaInicio) {
        const inicio = new Date(fechaInicio);
        inicio.setHours(0, 0, 0, 0);
        ventasFiltradas = ventasFiltradas.filter(v => {
            const fechaVenta = new Date(v.fecha);
            return fechaVenta >= inicio;
        });
    }

    if (fechaFin) {
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);
        ventasFiltradas = ventasFiltradas.filter(v => {
            const fechaVenta = new Date(v.fecha);
            return fechaVenta <= fin;
        });
    }

    actualizarContadores(ventasFiltradas);
    mostrarVentas(ventasFiltradas);
}

function limpiarFiltros() {
    const fechaInicio = document.getElementById('fecha-inicio');
    const fechaFin = document.getElementById('fecha-fin');

    if (fechaInicio) fechaInicio.value = '';
    if (fechaFin) fechaFin.value = '';
    actualizarContadores(todasLasVentas);
    mostrarVentas(todasLasVentas);
}

function actualizarContadores(ventas) {
    const countSpan = document.getElementById('ventas-filtradas-count');
    const totalSpan = document.getElementById('ventas-filtradas-total');

    if (countSpan) {
        countSpan.innerHTML = `Mostrando: <strong>${ventas.length}</strong> ventas`;
    }

    if (totalSpan) {
        const total = calcularTotal(ventas);
        totalSpan.innerHTML = `Total: <strong>${formatearPrecio(total)}</strong>`;
    }
}