const usuarioActual = verificarSesion();
const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
const formCliente = document.getElementById("formCliente");

if (usuarioActual) {
  pintarMenu(usuarioActual);

  if (usuarioActual.rol === "Admin") {
    cargarListaClientes();
  } else {
    cargarPerfil();
  }
}

function guardarClientes() {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

// El cliente se relaciona con su usuario por medio de idUsuario
function buscarMiCliente() {
  return clientes.find((c) => c.idUsuario === usuarioActual.id);
}

function cargarListaClientes() {
  document.getElementById("seccionAdmin").style.display = "block";
  const tabla = document.getElementById("tablaClientes");
  tabla.innerHTML = "";

  if (clientes.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5">No hay clientes registrados.</td></tr>';
    return;
  }

  clientes.forEach(function (cliente) {
    tabla.innerHTML += `
      <tr>
        <td>${cliente.id}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.apellido}</td>
        <td>${cliente.correo}</td>
        <td>${cliente.fecha}</td>
      </tr>`;
  });
}

function cargarPerfil() {
  document.getElementById("seccionPerfil").style.display = "block";
  const cliente = buscarMiCliente();

  if (cliente) {
    document.getElementById("nombre").value = cliente.nombre;
    document.getElementById("apellido").value = cliente.apellido;
    document.getElementById("correo").value = cliente.correo;
    document.getElementById("fecha").value = cliente.fecha;
  } else {
    // Primer ingreso: todavía no tiene registro de cliente
    document.getElementById("avisoDatos").style.display = "block";
    document.getElementById("correo").value = usuarioActual.correo;
    document.getElementById("fecha").value = new Date().toLocaleDateString("es-CO");
  }
}

formCliente.addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const correo = document.getElementById("correo").value.trim().toLowerCase();

  if (nombre === "" || apellido === "" || correo === "") {
    mostrarMensaje("Debes llenar todos los campos.", "error");
    return;
  }

  if (!correoValido(correo)) {
    mostrarMensaje("El correo no es válido.", "error");
    return;
  }

  const cliente = buscarMiCliente();

  if (cliente) {
    cliente.nombre = nombre;
    cliente.apellido = apellido;
    cliente.correo = correo;
    mostrarMensaje("Datos actualizados correctamente.", "exito");
  } else {
    const nuevoCliente = {
      id: Date.now(),
      idUsuario: usuarioActual.id,
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      fecha: document.getElementById("fecha").value
    };
    clientes.push(nuevoCliente);
    document.getElementById("avisoDatos").style.display = "none";
    mostrarMensaje("Datos guardados correctamente. Ya puedes realizar compras.", "exito");
  }

  guardarClientes();
});
