const usuarioActual = verificarSesion();

if (usuarioActual) {
  pintarMenu(usuarioActual);

  if (usuarioActual.rol === "Admin") {
    mostrarHomeAdmin();
  } else {
    mostrarHomeCliente();
  }
}

function mostrarHomeAdmin() {
  document.getElementById("homeAdmin").style.display = "block";

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const encabezados = JSON.parse(localStorage.getItem("encabezados")) || [];

  const pendientes = usuarios.filter((u) => u.estado === "Pendiente");

  document.getElementById("totalUsuarios").textContent = usuarios.length;
  document.getElementById("totalPendientes").textContent = pendientes.length + " pendientes";
  document.getElementById("totalClientes").textContent = clientes.length;
  document.getElementById("totalProductos").textContent = productos.length;
  document.getElementById("totalCompras").textContent = encabezados.length;
}

function mostrarHomeCliente() {
  document.getElementById("homeCliente").style.display = "block";

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const cliente = clientes.find((c) => c.idUsuario === usuarioActual.id);

  if (cliente) {
    document.getElementById("saludoCliente").textContent = "Bienvenido, " + cliente.nombre;
  } else {
    document.getElementById("avisoDatos").style.display = "block";
  }
}
