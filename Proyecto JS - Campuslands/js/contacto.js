// ==========================================================================
// CONTACTO - ENVÍO DE MENSAJE VÍA WHATSAPP
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    configurarFormularioContacto();
});

// ==========================================================================
// CONFIGURAR FORMULARIO DE CONTACTO
// ==========================================================================
function configurarFormularioContacto() {
    const form = document.getElementById('form-contacto');

    if (!form) {
        console.error('Formulario de contacto no encontrado');
        return;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        // Validar que los campos no estén vacíos
        if (!nombre) {
            alert('Por favor, ingresa tu nombre.');
            document.getElementById('nombre').focus();
            return;
        }

        if (!mensaje) {
            alert('Por favor, escribe un mensaje.');
            document.getElementById('mensaje').focus();
            return;
        }

        // Construir el mensaje para WhatsApp
        const numeroTelefono = '573167221636';
        const textoMensaje = `Hola, soy ${nombre} y este es mi mensaje: ${mensaje}`;

        // Codificar el mensaje para URL
        const mensajeCodificado = encodeURIComponent(textoMensaje);

        // Construir la URL de WhatsApp
        const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`;

        // Abrir WhatsApp en una nueva pestaña
        window.open(urlWhatsApp, '_blank');

        // Opcional: Mostrar mensaje de éxito
        alert(`¡Gracias ${nombre}! Serás redirigido a WhatsApp para completar tu mensaje.`);

        // Resetear el formulario
        form.reset();
    });
}

// ==========================================================================
// FUNCIÓN PARA VALIDAR EL NÚMERO DE TELÉFONO
// ==========================================================================
function validarTelefono(numero) {
    // Eliminar cualquier caracter no numérico
    const numerosLimpios = numero.replace(/\D/g, '');

    // Verificar que tenga al menos 10 dígitos (código país + número)
    return numerosLimpios.length >= 10;
}