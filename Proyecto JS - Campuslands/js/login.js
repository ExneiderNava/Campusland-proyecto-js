const formulario = document.querySelector("form");


formulario.addEventListener("submit", function (event) {



    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;


    if (correo === "" || contrasena === "") {
        alert("Debe completar todos los campos.");
        return;
    }


    if (correo === "admin@gmail.com" && contrasena === "1234") {
        alert("Bienvenido Administrador");

    }

    else {
        alert("Correo o contraseña incorrectos.");
    }

});