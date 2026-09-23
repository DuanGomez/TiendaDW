// Este archivo se carga en todas las páginas.
// Tiene los datos iniciales y las funciones que se usan en varias pantallas.

function crearDatosIniciales() {
  // Si es la primera vez que se abre la app, se crea el administrador
  if (localStorage.getItem("usuarios") === null) {
    const usuarios = [
      {
        id: 1,
        correo: "admin@admin.com",
        contrasena: "123456",
        rol: "Admin",
        estado: "Activo"
      }
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  const claves = ["clientes", "productos", "encabezados", "detalles"];
  claves.forEach(function (clave) {
    if (localStorage.getItem(clave) === null) {
      localStorage.setItem(clave, "[]");
    }
  });
}

crearDatosIniciales();

function obtenerSesion() {
  return JSON.parse(localStorage.getItem("sesion"));
}

// Revisa que haya sesión. Si se pasa un rol, solo deja entrar a ese rol.
function verificarSesion(rolPermitido) {
  const sesion = obtenerSesion();

  if (!sesion) {
    window.location.href = "index.html";
    return null;
  }

  if (rolPermitido && sesion.rol !== rolPermitido) {
    alert("No tienes permiso para entrar a esta página.");
    window.location.href = "home.html";
    return null;
  }

  return sesion;
}

// El menú cambia según el rol del usuario
function pintarMenu(sesion) {
  const menu = document.getElementById("menu");
  let enlaces = "";

  if (sesion.rol === "Admin") {
    enlaces =
      '<a href="home.html">Inicio</a>' +
      '<a href="usuarios.html">Usuarios</a>' +
      '<a href="clientes.html">Clientes</a>' +
      '<a href="productos.html">Productos</a>' +
      '<a href="compras.html">Compras</a>';
  } else {
    enlaces =
      '<a href="home.html">Inicio</a>' +
      '<a href="clientes.html">Mi perfil</a>' +
      '<a href="compra.html">Comprar</a>' +
      '<a href="compras.html">Mis compras</a>';
  }

  menu.innerHTML =
    '<span class="logo"><span class="logo-cuadro">DW</span> Tienda DW</span>' +
    '<div class="enlaces">' +
    enlaces +
    '<a href="#" id="btnSalir">Cerrar sesión</a>' +
    "</div>" +
    '<span class="usuario-menu">' + sesion.correo + " (" + sesion.rol + ")</span>";

  document.getElementById("btnSalir").addEventListener("click", cerrarSesion);

  // Resalta la página en la que está el usuario
  const paginaActual = window.location.pathname.split("/").pop();
  menu.querySelectorAll("a").forEach(function (enlace) {
    if (enlace.getAttribute("href") === paginaActual) {
      enlace.classList.add("activo");
    }
  });
}

function cerrarSesion(e) {
  e.preventDefault();
  localStorage.removeItem("sesion");
  window.location.href = "index.html";
}

// Muestra un mensaje en el párrafo con id="mensaje"
function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
}

function correoValido(correo) {
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return formato.test(correo);
}

function formatoPrecio(valor) {
  return "$" + Number(valor).toLocaleString("es-CO");
}
