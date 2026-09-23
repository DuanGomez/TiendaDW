const usuarioActual = verificarSesion("Admin");
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

if (usuarioActual) {
  pintarMenu(usuarioActual);
  cargarPendientes();
  cargarUsuarios();
}

function guardarUsuarios() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function cargarPendientes() {
  const tabla = document.getElementById("tablaPendientes");
  const pendientes = usuarios.filter((u) => u.estado === "Pendiente");

  tabla.innerHTML = "";

  if (pendientes.length === 0) {
    tabla.innerHTML = '<tr><td colspan="3">No hay usuarios pendientes.</td></tr>';
    return;
  }

  pendientes.forEach(function (usuario) {
    tabla.innerHTML += `
      <tr>
        <td>${usuario.correo}</td>
        <td>
          <select id="rol-${usuario.id}">
            <option value="">Seleccione...</option>
            <option value="Cliente">Cliente</option>
            <option value="Admin">Admin</option>
          </select>
        </td>
        <td><button onclick="activarUsuario(${usuario.id})">Activar</button></td>
      </tr>`;
  });
}

function cargarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";

  usuarios.forEach(function (usuario) {
    let claseEstado = "estado-activo";
    if (usuario.estado === "Pendiente") {
      claseEstado = "estado-pendiente";
    }

    tabla.innerHTML += `
      <tr>
        <td>${usuario.correo}</td>
        <td>${usuario.rol || "Sin rol"}</td>
        <td class="${claseEstado}">${usuario.estado}</td>
      </tr>`;
  });
}

function activarUsuario(id) {
  const rol = document.getElementById("rol-" + id).value;

  if (rol === "") {
    mostrarMensaje("Debes seleccionar un rol antes de activar la cuenta.", "error");
    return;
  }

  const usuario = usuarios.find((u) => u.id === id);
  usuario.rol = rol;
  usuario.estado = "Activo";

  guardarUsuarios();
  mostrarMensaje("Usuario " + usuario.correo + " activado como " + rol + ".", "exito");

  cargarPendientes();
  cargarUsuarios();
}
