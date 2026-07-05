
const formCategoria = document.getElementById('form-categoria');
const tablaBody = document.querySelector('#tabla-categorias tbody');
const modal = document.getElementById('modal-categoria');

document.getElementById('btn-nueva-categoria').addEventListener('click', () => {
    document.getElementById('modal-titulo').innerText = "Nueva Categoría";
    formCategoria.reset();
    document.getElementById('cat-id').value = '';
    modal.style.display = 'block';
});

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', renderizarCategorias);

formCategoria.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('cat-id').value;
    const nombre = document.getElementById('cat-nombre').value;
    const desc = document.getElementById('cat-desc').value;

    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    if (id) {
        categorias = categorias.map(c => c.id == id ? { id, nombre, desc } : c);
    } else {
        categorias.push({ id: Date.now(), nombre, desc });
    }

    localStorage.setItem('categorias', JSON.stringify(categorias));
    formCategoria.reset();
    document.getElementById('cat-id').value = '';
    modal.style.display = 'none';
    renderizarCategorias();
    alert('Acción realizada con éxito');
});

function renderizarCategorias() {
    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    tablaBody.innerHTML = categorias.map(c => `
        <tr>
            <td>${c.nombre}</td>
            <td>${c.desc}</td>
            <td>
                <button onclick="editarCategoria(${c.id})">Editar</button>
                <button onclick="eliminarCategoria(${c.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

window.eliminarCategoria = (id) => {
    const idNum = Number(id);

    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
        let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
        categorias = categorias.filter(c => Number(c.id) !== idNum);
        localStorage.setItem('categorias', JSON.stringify(categorias));
        renderizarCategorias();
        alert('Categoría eliminada correctamente');
    }
};

window.editarCategoria = (id) => {
    const categorias = JSON.parse(localStorage.getItem('categorias'));
    const cat = categorias.find(c => c.id == id);
    document.getElementById('cat-id').value = cat.id;
    document.getElementById('cat-nombre').value = cat.nombre;
    document.getElementById('cat-desc').value = cat.desc;
    document.getElementById('modal-titulo').innerText = "Editar Categoría";
    modal.style.display = 'block';
};