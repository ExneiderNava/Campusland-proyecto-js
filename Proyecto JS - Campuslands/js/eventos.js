
const formEvento = document.getElementById('eventos-form');
const bodyEventos = document.getElementById('body-eventos');
const modalEvento = document.getElementById('eventos-modal');
const btnNuevoEvento = document.getElementById('btn-nuevo-evento');
const btnCancelar = document.getElementById('eventos-btn-cancelar');

document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosIniciales();
    renderizarEventos();
    cargarCategoriasEnSelect();
});

async function cargarDatosIniciales() {
    if (!localStorage.getItem('eventos')) {
        try {
            const response = await fetch('../data/cliente.JSON');
            const data = await response.json();
            localStorage.setItem('eventos', JSON.stringify(data));
        } catch (error) {
            console.error("Error al cargar cliente.JSON:", error);
        }
    }
}

btnNuevoEvento.addEventListener('click', () => {
    document.getElementById('eventos-modal-titulo').innerText = "Nuevo Evento";
    formEvento.reset();
    document.getElementById('eventos-id').value = "";
    modalEvento.classList.add('is-active');
});

btnCancelar.addEventListener('click', () => {
    modalEvento.classList.remove('is-active');
});
function renderizarEventos() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    bodyEventos.innerHTML = eventos.map(e => `
        <tr>
            <td><img src="${e.imagen}" width="50" style="border-radius:4px;"></td>
            <td>${e.titulo}</td>
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

formEvento.addEventListener('submit', (e) => {
    e.preventDefault();
    let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const id = document.getElementById('eventos-id').value;

    const nuevoEvento = {
        id: id ? Number(id) : Date.now(),
        titulo: document.getElementById('eventos-nombre').value,
        categoria: document.getElementById('eventos-categoria').value,
        precio: Number(document.getElementById('eventos-precio').value),
        fecha: document.getElementById('eventos-fecha-hora').value,
        ciudad: document.getElementById('eventos-ciudad').value,
        imagen: document.getElementById('eventos-img').value
    };

    if (id) {
        eventos = eventos.map(ev => ev.id === Number(id) ? nuevoEvento : ev);
    } else {
        eventos.push(nuevoEvento);
    }

    localStorage.setItem('eventos', JSON.stringify(eventos));
    modalEvento.classList.remove('is-active');
    renderizarEventos();
    formEvento.reset();
});

window.eliminarEvento = (id) => {
    if (confirm('¿Eliminar este evento?')) {
        let eventos = JSON.parse(localStorage.getItem('eventos')) || [];
        eventos = eventos.filter(e => Number(e.id) !== Number(id));
        localStorage.setItem('eventos', JSON.stringify(eventos));
        renderizarEventos();
    }
};

window.editarEvento = (id) => {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const ev = eventos.find(e => Number(e.id) === Number(id));

    if (ev) {
        document.getElementById('eventos-id').value = ev.id;
        document.getElementById('eventos-nombre').value = ev.titulo;
        document.getElementById('eventos-categoria').value = ev.categoria;
        document.getElementById('eventos-precio').value = ev.precio;
        document.getElementById('eventos-fecha-hora').value = ev.fecha;
        document.getElementById('eventos-ciudad').value = ev.ciudad;
        document.getElementById('eventos-img').value = ev.imagen;
        document.getElementById('eventos-modal-titulo').innerText = "Editar Evento";
        modalEvento.classList.add('is-active');
    }
};

function cargarCategoriasEnSelect() {
    const selectCat = document.getElementById('eventos-categoria');
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    selectCat.innerHTML = '<option value="">Seleccione una categoría</option>';
    categorias.forEach(cat => {
        selectCat.innerHTML += `<option value="${cat.nombre}">${cat.nombre}</option>`;
    });
}