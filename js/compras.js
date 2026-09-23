const usuarioActual = verificarSesion();

const encabezados = JSON.parse(localStorage.getItem("encabezados")) || [];
const detalles = JSON.parse(localStorage.getItem("detalles")) || [];
const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
const productos = JSON.parse(localStorage.getItem("productos")) || [];

if (usuarioActual) {
  pintarMenu(usuarioActual);

  if (usuarioActual.rol === "Cliente") {
    document.getElementById("titulo").textContent = "Mis compras";
  }

  cargarCompras();
}

function nombreCliente(idCliente) {
  const cliente = clientes.find((c) => c.id === idCliente);
  if (cliente) {
    return cliente.nombre + " " + cliente.apellido;
  }
  return "Desconocido";
}

function nombreProducto(idProducto) {
  const producto = productos.find((p) => p.id === idProducto);
  if (producto) {
    return producto.nombre;
  }
  return "Producto eliminado";
}

function cargarCompras() {
  let lista = encabezados;

  // El cliente solo ve sus propias compras
  if (usuarioActual.rol === "Cliente") {
    const cliente = clientes.find((c) => c.idUsuario === usuarioActual.id);
    if (cliente) {
      lista = encabezados.filter((e) => e.idCliente === cliente.id);
    } else {
      lista = [];
    }
  }

  const tabla = document.getElementById("tablaCompras");
  tabla.innerHTML = "";

  if (lista.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5">No hay compras registradas.</td></tr>';
    return;
  }

  lista.forEach(function (encabezado) {
    tabla.innerHTML += `
      <tr>
        <td>${encabezado.id}</td>
        <td>${nombreCliente(encabezado.idCliente)}</td>
        <td>${encabezado.fecha}</td>
        <td>${formatoPrecio(encabezado.total)}</td>
        <td><button onclick="verDetalle(${encabezado.id})">Ver detalle</button></td>
      </tr>`;
  });
}

function verDetalle(idEncabezado) {
  const lista = detalles.filter((d) => d.idEncabezado === idEncabezado);
  const tabla = document.getElementById("tablaDetalle");
  tabla.innerHTML = "";

  lista.forEach(function (detalle) {
    tabla.innerHTML += `
      <tr>
        <td>${nombreProducto(detalle.idProducto)}</td>
        <td>${detalle.cantidad}</td>
        <td>${formatoPrecio(detalle.valor)}</td>
      </tr>`;
  });

  document.getElementById("tituloDetalle").textContent = "Detalle de la compra #" + idEncabezado;
  document.getElementById("seccionDetalle").style.display = "block";
  document.getElementById("seccionDetalle").scrollIntoView();
}
