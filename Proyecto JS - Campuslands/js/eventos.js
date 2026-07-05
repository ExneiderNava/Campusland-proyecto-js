// --- LÓGICA DE EVENTOS ---
const formEvento = document.getElementById('eventos-form');
const bodyEventos = document.getElementById('body-eventos');
const modalEvento = document.getElementById('eventos-modal'); // El overlay
const btnNuevoEvento = document.getElementById('btn-nuevo-evento');
const btnCancelar = document.getElementById('eventos-btn-cancelar');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderizarEventos();
    cargarCategoriasEnSelect();
});

// Abrir modal para nuevo evento (Uso de clase .is-active)
btnNuevoEvento.addEventListener('click', () => {
    document.getElementById('eventos-modal-titulo').innerText = "Nuevo Evento";
    formEvento.reset();
    document.getElementById('eventos-id').value = "";
    modalEvento.classList.add('is-active');
});

// Cerrar modal
btnCancelar.addEventListener('click', () => {
    modalEvento.classList.remove('is-active');
});

// Cargar categorías en el select
function cargarCategoriasEnSelect() {
    const selectCat = document.getElementById('eventos-categoria');
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    selectCat.innerHTML = '<option value="">Seleccione una categoría</option>';
    categorias.forEach(cat => {
        selectCat.innerHTML += `<option value="${cat.nombre}">${cat.nombre}</option>`;
    });
}

// Guardar o Actualizar
formEvento.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('eventos-id').value;
    const nuevoEvento = {
        id: id ? Number(id) : Date.now(),
        nombre: document.getElementById('eventos-nombre').value,
        categoria: document.getElementById('eventos-categoria').value,
        precio: document.getElementById('eventos-precio').value,
        fechaHora: document.getElementById('eventos-fecha-hora').value,
        ciudad: document.getElementById('eventos-ciudad').value,
        imagen: document.getElementById('eventos-img').value,
        descripcion: document.getElementById('eventos-desc').value
    };

    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    if (id) {
        eventos = eventos.map(e => Number(e.id) === Number(nuevoEvento.id) ? nuevoEvento : e);
    } else {
        eventos.push(nuevoEvento);
    }

    localStorage.setItem('eventos', JSON.stringify(eventos));
    formEvento.reset();
    modalEvento.classList.remove('is-active'); // Ocultar
    renderizarEventos();
});

// Renderizar tabla
function renderizarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    bodyEventos.innerHTML = eventos.map(e => `
        <tr>
            <td><img src="${e.imagen}" width="50" alt="img" style="border-radius:5px;"></td>
            <td>${e.nombre}</td>
            <td>${e.categoria}</td>
            <td>${e.ciudad}</td>
            <td>$${e.precio}</td>
            <td>
                <button onclick="editarEvento(${e.id})">Editar</button>
                <button onclick="eliminarEvento(${e.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// Eliminar
window.eliminarEvento = (id) => {
    if (confirm('¿Eliminar este evento?')) {
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos = eventos.filter(e => Number(e.id) !== Number(id));
        localStorage.setItem('eventos', JSON.stringify(eventos));
        renderizarEventos();
    }
};

// Editar
window.editarEvento = (id) => {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = eventos.find(e => Number(e.id) === Number(id));

    if (ev) {
        document.getElementById('eventos-id').value = ev.id;
        document.getElementById('eventos-nombre').value = ev.nombre;
        document.getElementById('eventos-categoria').value = ev.categoria;
        document.getElementById('eventos-precio').value = ev.precio;
        document.getElementById('eventos-fecha-hora').value = ev.fechaHora;
        document.getElementById('eventos-ciudad').value = ev.ciudad;
        document.getElementById('eventos-img').value = ev.imagen;
        document.getElementById('eventos-desc').value = ev.descripcion;

        document.getElementById('eventos-modal-titulo').innerText = "Editar Evento";
        modalEvento.classList.add('is-active'); // Mostrar
    }
};