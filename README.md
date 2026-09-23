# Tienda DW

Sistema de compras sencillo hecho con **HTML, CSS y JavaScript**. Toda la información se guarda en el navegador con **LocalStorage**, así que no necesita servidor, base de datos ni instalar nada.

Proyecto del parcial práctico de Desarrollo Web.

---

## Contenido

1. [Cómo ejecutarlo](#cómo-ejecutarlo)
2. [Qué hace la aplicación](#qué-hace-la-aplicación)
3. [Roles y menú](#roles-y-menú)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Modelo de datos](#modelo-de-datos)
6. [Cómo se guarda la información](#cómo-se-guarda-la-información)
7. [Cómo funciona una compra](#cómo-funciona-una-compra)
8. [Validaciones](#validaciones)
9. [Guía para probarla](#guía-para-probarla)
10. [Preguntas frecuentes](#preguntas-frecuentes)

---

## Cómo ejecutarlo

1. Descarga o copia la carpeta `ParcialDW`.
2. Abre el archivo **`index.html`** con doble clic (Chrome, Edge o Firefox).
3. Listo. La primera vez se crea automáticamente el usuario administrador.

**Usuario administrador de prueba:**

| Correo            | Contraseña |
| ----------------- | ---------- |
| `admin@admin.com` | `123456`   |

---

## Qué hace la aplicación

- Registrar usuarios nuevos (quedan **pendientes** hasta que un admin los active).
- Iniciar y cerrar sesión.
- Manejar dos roles: **Admin** y **Cliente**.
- El admin activa cuentas y asigna roles.
- El admin crea, lista y edita productos.
- El cliente completa y edita sus datos personales.
- El cliente compra uno o varios productos.
- Cada compra guarda un **encabezado** y sus **detalles**, y descuenta el **stock**.
- El admin ve todas las compras; el cliente ve solo las suyas.

### Tecnologías

| Usado                          | No usado                                        |
| ------------------------------ | ----------------------------------------------- |
| HTML                           | Frameworks (React, Angular, Vue)                |
| CSS (Flexbox)                  | Bootstrap, Tailwind, librerías de íconos        |
| JavaScript vanilla             | Node.js, npm, APIs, backend                     |
| LocalStorage + JSON            | Bases de datos reales                           |

---

## Roles y menú

El menú se arma en la función `pintarMenu()` de `js/datos.js` y **cambia según el rol** guardado en la sesión.

| Admin         | Cliente       |
| ------------- | ------------- |
| Inicio        | Inicio        |
| Usuarios      | Mi perfil     |
| Clientes      | Comprar       |
| Productos     | Mis compras   |
| Compras       | Cerrar sesión |
| Cerrar sesión |               |

### Control de acceso

Cada página llama a `verificarSesion()` al cargar:

- **Sin sesión:** vuelve al login.
- **Cliente en una página de Admin** (Usuarios, Productos): muestra un aviso y vuelve al inicio.
- **Admin en la página de Comprar:** también vuelve al inicio, porque comprar es solo para clientes.

> Es una simulación académica de autenticación. Como todo está en el navegador, no es seguridad real de backend.

---

## Estructura del proyecto

```
ParcialDW/
│
├── index.html        Login
├── registro.html     Registro de usuarios
├── home.html         Inicio (cambia según el rol)
├── usuarios.html     Admin: activar usuarios y asignar rol
├── clientes.html     Admin: lista de clientes / Cliente: mi perfil
├── productos.html    Admin: crear, listar y editar productos
├── compra.html       Cliente: elegir productos y comprar
├── compras.html      Admin: todas las compras / Cliente: mis compras
│
├── css/
│   └── styles.css    Todo el diseño
│
└── js/
    ├── datos.js      Se carga en todas las páginas (datos iniciales, sesión, menú)
    ├── login.js
    ├── registro.js
    ├── home.js
    ├── usuarios.js
    ├── clientes.js
    ├── productos.js
    ├── compra.js
    └── compras.js
```

Cada página HTML carga **primero `datos.js`** y después **su propio archivo JS**.

### Funciones de `datos.js`

| Función                  | Qué hace                                                      |
| ------------------------ | ------------------------------------------------------------- |
| `crearDatosIniciales()`  | Si es la primera vez, crea el admin y los arrays vacíos       |
| `obtenerSesion()`        | Devuelve el usuario que inició sesión                         |
| `verificarSesion(rol)`   | Revisa que haya sesión y que el rol tenga permiso             |
| `pintarMenu(sesion)`     | Dibuja el menú según el rol y marca la página actual          |
| `cerrarSesion()`         | Borra la sesión y vuelve al login                             |
| `mostrarMensaje()`       | Muestra mensajes de éxito o error                             |
| `correoValido()`         | Validación básica de correo                                   |
| `formatoPrecio()`        | Muestra los valores como `$20.000`                            |

---

## Modelo de datos

### Usuario

| Campo        | Ejemplo              | Nota                               |
| ------------ | -------------------- | ---------------------------------- |
| `id`         | `1727112000000`      | Se genera con `Date.now()`         |
| `correo`     | `juan@mail.com`      |                                    |
| `contrasena` | `abcdef`             | Mínimo 6 caracteres                |
| `rol`        | `Admin` / `Cliente`  | Vacío mientras está pendiente      |
| `estado`     | `Pendiente` / `Activo` |                                  |

### Cliente

| Campo       | Nota                                                   |
| ----------- | ------------------------------------------------------ |
| `id`        |                                                        |
| `idUsuario` | Relaciona el cliente con su usuario                    |
| `nombre`    |                                                        |
| `apellido`  |                                                        |
| `correo`    |                                                        |
| `fecha`     | Fecha en que el cliente completó sus datos             |

### Producto

| Campo           | Regla                              |
| --------------- | ---------------------------------- |
| `id`            |                                    |
| `nombre`        | Obligatorio                        |
| `descripcion`   | Obligatoria                        |
| `valorUnitario` | Número mayor que 0                 |
| `stock`         | Número entero mayor o igual a 0    |

### Encabezado de compra

| Campo       | Nota                              |
| ----------- | --------------------------------- |
| `id`        |                                   |
| `idCliente` | Cliente que hizo la compra        |
| `fecha`     | Fecha y hora de la compra         |
| `total`     | Suma de todos los subtotales      |

### Detalle de compra

| Campo          | Nota                                   |
| -------------- | -------------------------------------- |
| `id`           |                                        |
| `idEncabezado` | Compra a la que pertenece              |
| `idProducto`   | Producto comprado                      |
| `cantidad`     | Unidades compradas                     |
| `valor`        | Subtotal: `cantidad × valorUnitario`   |

### Cómo se relacionan

```
Usuario 1 ──── 1 Cliente 1 ──── * Encabezado 1 ──── * Detalle * ──── 1 Producto
```

- Un **usuario** con rol Cliente tiene un registro de **cliente**.
- Un **cliente** puede tener muchas **compras** (encabezados).
- Cada **encabezado** tiene uno o varios **detalles**.
- Cada **detalle** apunta a un **producto**.

---

## Cómo se guarda la información

Todo se guarda en **LocalStorage** como texto JSON:

| Clave         | Contenido                          |
| ------------- | ---------------------------------- |
| `usuarios`    | Array de usuarios                  |
| `clientes`    | Array de clientes                  |
| `productos`   | Array de productos                 |
| `encabezados` | Array de encabezados de compra     |
| `detalles`    | Array de detalles de compra        |
| `sesion`      | Usuario que tiene la sesión abierta |

Así se lee y se guarda en el código:

```javascript
// Leer
const productos = JSON.parse(localStorage.getItem("productos")) || [];

// Guardar
function guardarProductos() {
  localStorage.setItem("productos", JSON.stringify(productos));
}
```

Para ver los datos en el navegador: **F12 → Application → Local Storage**.

---

## Cómo funciona una compra

El código está en `js/compra.js`.

### Mientras el cliente elige

1. Se leen los productos de LocalStorage y se muestran en tarjetas.
2. Los productos con stock 0 aparecen como **Agotado** y no se pueden agregar.
3. Al presionar **Agregar**, se valida la cantidad y se guarda en el array `carrito`.
4. Si el mismo producto se agrega dos veces, se suman las cantidades (sin pasar el stock).
5. El resumen muestra: **Producto | Cantidad | Valor unitario | Subtotal** y el **Total**.

### Al presionar "Confirmar compra"

La función `confirmarCompra()` hace **primero todas las validaciones** y **después** guarda. Si algo falla, no se modifica nada.

| Paso | Qué hace                                                                 |
| ---- | ------------------------------------------------------------------------ |
| 1    | Comprueba que el cliente tenga sus datos registrados                     |
| 2    | Comprueba que haya al menos un producto seleccionado                     |
| 3    | Vuelve a leer el **stock actual** de LocalStorage y lo compara           |
| 4    | Crea el **encabezado** (id, idCliente, fecha, total)                     |
| 5    | Crea un **detalle** por cada producto                                    |
| 6    | Descuenta el stock: `stock = stock - cantidad`                           |
| 7    | Guarda encabezados, detalles y productos en LocalStorage                 |
| 8    | Muestra *"Compra realizada correctamente."* y limpia el carrito          |

> El paso 3 es importante: aunque el producto mostraba cierto stock cuando se agregó, antes de confirmar se revisa otra vez lo que hay guardado, por si el admin lo cambió.

---

## Validaciones

### Registro
- Todos los campos son obligatorios.
- El correo debe tener un formato válido.
- La contraseña debe tener mínimo 6 caracteres.
- Las dos contraseñas deben coincidir.
- No se puede registrar un correo que ya existe.

### Login
- Si el correo o la contraseña están mal: *"Correo o contraseña incorrectos."*
- Si la cuenta está pendiente: *"No puedes iniciar sesión porque tu cuenta está pendiente de aprobación."*

### Productos
- Nombre y descripción obligatorios.
- Valor unitario numérico y mayor que 0.
- Stock entero y mayor o igual a 0.

### Compra
- La cantidad mínima es 1 (no se aceptan 0, negativos ni decimales).
- No se puede comprar más que el stock: *"No puedes comprar más unidades que el stock disponible."*
- Sin datos de cliente: *"Debes completar tus datos antes de realizar una compra."*
- Sin productos registrados: *"No hay productos disponibles para realizar una compra."*

---

## Guía para probarla

Un recorrido completo en pocos minutos:

1. **Registro:** entra a *Regístrate aquí* y crea `juan@mail.com` con contraseña `abcdef`.
2. **Cuenta pendiente:** intenta iniciar sesión con Juan. No te deja.
3. **Activar:** entra como `admin@admin.com`, ve a **Usuarios**, elige el rol *Cliente* y presiona **Activar**.
4. **Productos:** en **Productos** crea, por ejemplo:
   - Camiseta, $20.000, stock 5
   - Gorra, $15.000, stock 0
   - Pantalón, $50.000, stock 3
5. **Cerrar sesión** e ingresar como Juan.
6. **Primer ingreso:** el inicio avisa que debe completar sus datos. Ve a **Mi perfil**, llena nombre y apellido y guarda.
7. **Comprar:** agrega 2 camisetas y 3 pantalones. El total debe ser **$190.000**.
   - Prueba poner 6 camisetas: sale el error de stock.
   - La gorra aparece como *Agotado*.
8. **Confirmar compra.** La camiseta queda con stock 3 y el pantalón con 0.
9. **Mis compras:** aparece la compra; con **Ver detalle** se ven los productos.
10. **Como admin:** en **Compras** se ve la compra de Juan y en **Clientes** aparece Juan.

---

## Preguntas frecuentes

**¿Cómo reinicio todos los datos?**
Abre la consola del navegador (F12 → Console) y escribe `localStorage.clear()`. Al recargar se vuelve a crear el admin.

**¿Por qué no veo los datos en otro navegador o en otro computador?**
LocalStorage guarda la información solo en el navegador donde se usó.

**¿Por qué los ids son números tan largos?**
Se generan con `Date.now()`, que devuelve los milisegundos desde 1970. Así cada id es distinto.

**¿Dónde se guarda quién inició sesión?**
En la clave `sesion` de LocalStorage (id, correo y rol). Al cerrar sesión se borra.
