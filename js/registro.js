const formRegistro = document.getElementById("formRegistro");

formRegistro.addEventListener("submit", function (e) {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim().toLowerCase();
  const contrasena = document.getElementById("contrasena").value;
  const confirmar = document.getElementById("confirmar").value;

  if (correo === "" || contrasena === "" || confirmar === "") {
    mostrarMensaje("Debes llenar todos los campos.", "error");
    return;
  }

  if (!correoValido(correo)) {
    mostrarMensaje("El correo no es válido.", "error");
    return;
  }

  if (contrasena.length < 6) {
    mostrarMensaje("La contraseña debe tener mínimo 6 caracteres.", "error");
    return;
  }

  if (contrasena !== confirmar) {
    mostrarMensaje("Las contraseñas no coinciden.", "error");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.find((u) => u.correo === correo)) {
    mostrarMensaje("Ese correo ya está registrado.", "error");
    return;
  }

  // El usuario nuevo queda pendiente y sin rol hasta que el admin lo active
  const nuevoUsuario = {
    id: Date.now(),
    correo: correo,
    contrasena: contrasena,
    rol: "",
    estado: "Pendiente"
  };

  usuarios.push(nuevoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  formRegistro.reset();
  mostrarMensaje("Registro realizado. Espera a que un administrador active tu cuenta.", "exito");
});
