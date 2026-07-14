const formEvento = document.getElementById('eventos-form');
const bodyEventos = document.getElementById('body-eventos');
const modalEvento = document.getElementById('eventos-modal');
const btnNuevoEvento = document.getElementById('btn-nuevo-evento');
const btnCancelar = document.getElementById('eventos-btn-cancelar');

document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosIniciales();
    renderizarEventos();
    cargarCategoriasEnSelect();
    cargarCiudadesEnSelect();
    configurarEventListeners();
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

    if (!localStorage.getItem('ciudades')) {
        try {
            const response = await fetch('../data/ciudades.JSON');
            const data = await response.json();
            localStorage.setItem('ciudades', JSON.stringify(data));
        } catch (error) {
            console.error("Error al cargar ciudades.JSON:", error);

            const ciudadesDefecto = ["Barranquilla", "Bogotá", "Bucaramanga", "Medellín"];
            localStorage.setItem('ciudades', JSON.stringify(ciudadesDefecto));
        }
    }
}

function configurarEventListeners() {
    const btnMostrar = document.getElementById('btn-mostrar-nueva-ciudad');
    const divNueva = document.getElementById('nueva-ciudad-div');
    const btnAgregar = document.getElementById('boton-agregar-ciudad');
    const inputCiudad = document.getElementById('eventos-nueva-ciudad');

    if (btnMostrar) {
        btnMostrar.addEventListener('click', () => {
            divNueva.hidden = !divNueva.hidden;
        });
    }

    if (btnAgregar) {
        btnAgregar.addEventListener('click', () => {
            const nombreCiudad = inputCiudad.value.trim();
            if (!nombreCiudad) {
                alert('Escribe el nombre de la ciudad.');
                return;
            }

            let ciudades = JSON.parse(localStorage.getItem('ciudades')) || [];
            if (ciudades.some(c => c.toLowerCase() === nombreCiudad.toLowerCase())) {
                alert('Esa ciudad ya existe.');
                return;
            }

            ciudades.push(nombreCiudad);
            localStorage.setItem('ciudades', JSON.stringify(ciudades));

            cargarCiudadesEnSelect();
            document.getElementById('eventos-ciudad').value = nombreCiudad;

            inputCiudad.value = "";
            divNueva.hidden = true;
        });
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
        imagen: document.getElementById('eventos-img').value,
        descripcion: document.getElementById('eventos-desc').value
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
        document.getElementById('eventos-desc').value = ev.descripcion || '';
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

function cargarCiudadesEnSelect() {
    const selectCiudad = document.getElementById('eventos-ciudad');
    const ciudades = JSON.parse(localStorage.getItem('ciudades')) || [];
    selectCiudad.innerHTML = '<option value="">Seleccione una ciudad</option>';
    ciudades.forEach(ciudad => {
        selectCiudad.innerHTML += `<option value="${ciudad}">${ciudad}</option>`;
    });
}