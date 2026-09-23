const usuarioActual = verificarSesion("Admin");
const productos = JSON.parse(localStorage.getItem("productos")) || [];
const formProducto = document.getElementById("formProducto");

if (usuarioActual) {
  pintarMenu(usuarioActual);
  cargarProductos();
}

function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}

function cargarProductos() {
  const tabla = document.getElementById("tablaProductos");
  tabla.innerHTML = "";

  if (productos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5">No hay productos registrados.</td></tr>';
    return;
  }

  productos.forEach(function (producto) {
    tabla.innerHTML += `
      <tr>
        <td>${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>${formatoPrecio(producto.valorUnitario)}</td>
        <td>${producto.stock}</td>
        <td><button onclick="editarProducto(${producto.id})">Editar</button></td>
      </tr>`;
  });
}

// Pasa los datos del producto al formulario para editarlo
function editarProducto(id) {
  const producto = productos.find((p) => p.id === id);

  document.getElementById("idProducto").value = producto.id;
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("valorUnitario").value = producto.valorUnitario;
  document.getElementById("stock").value = producto.stock;

  document.getElementById("tituloFormulario").textContent = "Editar producto";
  document.getElementById("btnGuardar").textContent = "Actualizar";
  window.scrollTo(0, 0);
}

function limpiarFormulario() {
  formProducto.reset();
  document.getElementById("idProducto").value = "";
  document.getElementById("tituloFormulario").textContent = "Nuevo producto";
  document.getElementById("btnGuardar").textContent = "Guardar";
}

document.getElementById("btnCancelar").addEventListener("click", limpiarFormulario);

formProducto.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("idProducto").value;
  const nombre = document.getElementById("nombre").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const valorTexto = document.getElementById("valorUnitario").value;
  const stockTexto = document.getElementById("stock").value;

  const valorUnitario = Number(valorTexto);
  const stock = Number(stockTexto);

  if (nombre === "") {
    mostrarMensaje("El nombre es obligatorio.", "error");
    return;
  }

  if (descripcion === "") {
    mostrarMensaje("La descripción es obligatoria.", "error");
    return;
  }

  if (valorTexto === "" || isNaN(valorUnitario) || valorUnitario <= 0) {
    mostrarMensaje("El valor unitario debe ser un número mayor que 0.", "error");
    return;
  }

  if (stockTexto === "" || !Number.isInteger(stock) || stock < 0) {
    mostrarMensaje("El stock debe ser un número entero mayor o igual a 0.", "error");
    return;
  }

  if (id === "") {
    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre,
      descripcion: descripcion,
      valorUnitario: valorUnitario,
      stock: stock
    };
    productos.push(nuevoProducto);
    mostrarMensaje("Producto creado correctamente.", "exito");
  } else {
    const producto = productos.find((p) => p.id === Number(id));
    producto.nombre = nombre;
    producto.descripcion = descripcion;
    producto.valorUnitario = valorUnitario;
    producto.stock = stock;
    mostrarMensaje("Producto actualizado correctamente.", "exito");
  }

  guardarProductos();
  limpiarFormulario();
  cargarProductos();
});
