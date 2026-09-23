const usuarioActual = verificarSesion("Cliente");

// Aquí se guardan los productos que el cliente va seleccionando
let carrito = [];

if (usuarioActual) {
  pintarMenu(usuarioActual);
  iniciarCompra();
}

// Siempre se leen los productos de LocalStorage para tener el stock actualizado
function obtenerProductos() {
  return JSON.parse(localStorage.getItem("productos")) || [];
}

function buscarCliente() {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  return clientes.find((c) => c.idUsuario === usuarioActual.id);
}

function iniciarCompra() {
  if (!buscarCliente()) {
    document.getElementById("avisoDatos").style.display = "block";
  }

  if (obtenerProductos().length === 0) {
    document.getElementById("avisoProductos").style.display = "block";
    return;
  }

  document.getElementById("zonaCompra").style.display = "block";
  cargarProductos();
  mostrarResumen();
}

// Cada producto se muestra en una tarjeta
function cargarProductos() {
  const productos = obtenerProductos();
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";

  productos.forEach(function (producto) {
    let clase = "producto";
    let parteFinal = `
      <div class="agregar">
        <input type="number" id="cant-${producto.id}" value="1" min="1" max="${producto.stock}">
        <button onclick="agregarProducto(${producto.id})">Agregar</button>
      </div>`;

    // Solo se pueden seleccionar productos con stock mayor a 0
    if (producto.stock <= 0) {
      clase = "producto agotado";
      parteFinal = '<p class="etiqueta-agotado">Agotado</p>';
    }

    lista.innerHTML += `
      <div class="${clase}">
        <h3>${producto.nombre}</h3>
        <p class="descripcion">${producto.descripcion}</p>
        <p class="precio">${formatoPrecio(producto.valorUnitario)}</p>
        <p class="stock">Stock: ${producto.stock}</p>
        ${parteFinal}
      </div>`;
  });
}

function agregarProducto(id) {
  const producto = obtenerProductos().find((p) => p.id === id);
  const cantidad = Number(document.getElementById("cant-" + id).value);

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    mostrarMensaje("La cantidad debe ser un número entero mayor o igual a 1.", "error");
    return;
  }

  // Si el producto ya está en el carrito se suma la cantidad
  const item = carrito.find((i) => i.idProducto === id);
  let cantidadTotal = cantidad;
  if (item) {
    cantidadTotal = item.cantidad + cantidad;
  }

  if (cantidadTotal > producto.stock) {
    mostrarMensaje("No puedes comprar más unidades que el stock disponible.", "error");
    return;
  }

  if (item) {
    item.cantidad = cantidadTotal;
  } else {
    carrito.push({
      idProducto: producto.id,
      nombre: producto.nombre,
      valorUnitario: producto.valorUnitario,
      cantidad: cantidad
    });
  }

  mostrarMensaje(producto.nombre + " agregado a la compra.", "exito");
  mostrarResumen();
}

function quitarProducto(id) {
  carrito = carrito.filter((i) => i.idProducto !== id);
  mostrarResumen();
}

function calcularTotal() {
  let total = 0;
  carrito.forEach(function (item) {
    total = total + item.cantidad * item.valorUnitario;
  });
  return total;
}

function mostrarResumen() {
  const tabla = document.getElementById("tablaResumen");
  tabla.innerHTML = "";

  if (carrito.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5">No has seleccionado productos.</td></tr>';
  }

  carrito.forEach(function (item) {
    const subtotal = item.cantidad * item.valorUnitario;
    tabla.innerHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.cantidad}</td>
        <td>${formatoPrecio(item.valorUnitario)}</td>
        <td>${formatoPrecio(subtotal)}</td>
        <td><button class="btn-peligro" onclick="quitarProducto(${item.idProducto})">Quitar</button></td>
      </tr>`;
  });

  document.getElementById("total").textContent = formatoPrecio(calcularTotal());
}

document.getElementById("btnConfirmar").addEventListener("click", confirmarCompra);

function confirmarCompra() {
  // 1. Comprobar que el cliente tenga sus datos
  const cliente = buscarCliente();
  if (!cliente) {
    mostrarMensaje("Debes completar tus datos antes de realizar una compra.", "error");
    return;
  }

  // 2. Comprobar que haya seleccionado productos
  if (carrito.length === 0) {
    mostrarMensaje("Debes seleccionar al menos un producto.", "error");
    return;
  }

  // 3. Volver a revisar el stock guardado en LocalStorage
  const productos = obtenerProductos();

  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    const producto = productos.find((p) => p.id === item.idProducto);

    if (!producto) {
      mostrarMensaje("El producto " + item.nombre + " ya no existe.", "error");
      return;
    }

    if (item.cantidad > producto.stock) {
      mostrarMensaje("La cantidad de " + producto.nombre + " supera el stock disponible (" + producto.stock + ").", "error");
      cargarProductos();
      return;
    }

    // Se usa el precio actual por si el admin lo cambió
    item.valorUnitario = producto.valorUnitario;
  }

  // Si llegamos aquí todo es válido, ahora sí se guardan los datos
  const total = calcularTotal();
  const encabezados = JSON.parse(localStorage.getItem("encabezados")) || [];
  const detalles = JSON.parse(localStorage.getItem("detalles")) || [];

  // 4. Crear el encabezado
  const encabezado = {
    id: Date.now(),
    idCliente: cliente.id,
    fecha: new Date().toLocaleString("es-CO"),
    total: total
  };
  encabezados.push(encabezado);

  carrito.forEach(function (item, i) {
    const producto = productos.find((p) => p.id === item.idProducto);

    // 5. Crear un detalle por cada producto
    detalles.push({
      id: encabezado.id + i + 1,
      idEncabezado: encabezado.id,
      idProducto: item.idProducto,
      cantidad: item.cantidad,
      valor: item.cantidad * item.valorUnitario
    });

    // 6. Descontar el stock
    producto.stock = producto.stock - item.cantidad;
  });

  // 7. Guardar todo en LocalStorage
  localStorage.setItem("encabezados", JSON.stringify(encabezados));
  localStorage.setItem("detalles", JSON.stringify(detalles));
  localStorage.setItem("productos", JSON.stringify(productos));

  // 8. Limpiar y avisar
  carrito = [];
  cargarProductos();
  mostrarResumen();
  mostrarMensaje("Compra realizada correctamente.", "exito");
}
