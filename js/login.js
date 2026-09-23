const formLogin = document.getElementById("formLogin");

// Si ya hay una sesión abierta se envía directo al inicio
if (obtenerSesion()) {
  window.location.href = "home.html";
}

formLogin.addEventListener("submit", function (e) {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim().toLowerCase();
  const contrasena = document.getElementById("contrasena").value;

  if (correo === "" || contrasena === "") {
    mostrarMensaje("Debes llenar todos los campos.", "error");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find((u) => u.correo === correo);

  if (!usuario || usuario.contrasena !== contrasena) {
    mostrarMensaje("Correo o contraseña incorrectos.", "error");
    return;
  }

  if (usuario.estado !== "Activo") {
    mostrarMensaje("No puedes iniciar sesión porque tu cuenta está pendiente de aprobación.", "error");
    return;
  }

  // El usuario actual se guarda en la sesión
  const sesion = {
    id: usuario.id,
    correo: usuario.correo,
    rol: usuario.rol
  };
  localStorage.setItem("sesion", JSON.stringify(sesion));

  mostrarMensaje("Inicio de sesión correcto.", "exito");

  setTimeout(function () {
    window.location.href = "home.html";
  }, 800);
});
