document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
});

// 1. OBTENER Y ORDENAR VENTAS
function obtenerVentas() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];

    // Ordenar por fecha (más reciente primero)
    return ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

// 2. RENDERIZAR TABLA
function cargarVentas() {
    const tbody = document.getElementById('body-ventas');
    const ventas = obtenerVentas();

    tbody.innerHTML = '';

    ventas.forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(venta.fecha).toLocaleDateString()}</td>
            <td>${venta.cliente.nombre}</td>
            <td>${venta.ciudad}</td>
            <td>$${venta.total.toLocaleString()}</td>
            <td><button onclick="verDetalle(${venta.id})">Ver Detalle</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. VISTA DE DETALLE (Modal)
function verDetalle(id) {
    const ventas = obtenerVentas();
    const venta = ventas.find(v => v.id === id);
    const modal = document.getElementById('modal-detalle-venta');
    const contenido = document.getElementById('contenido-detalle');

    if (venta) {
        contenido.innerHTML = `
            <p><strong>Cliente:</strong> ${venta.cliente.nombre}</p>
            <p><strong>Ciudad:</strong> ${venta.ciudad}</p>
            <p><strong>Productos:</strong></p>
            <ul>
                ${venta.detalles.map(item => `<li>${item.nombre} - $${item.precio}</li>`).join('')}
            </ul>
            <p><strong>Total:</strong> $${venta.total.toLocaleString()}</p>
        `;
        modal.classList.add('is-active');
    }
}

// 4. CERRAR MODAL
document.getElementById('btn-cerrar-detalle').addEventListener('click', () => {
    document.getElementById('modal-detalle-venta').classList.remove('is-active');
});