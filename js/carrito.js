// Obtener los productos del carrito desde el localStorage
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito) || []; // Si no hay productos, inicializar como un arreglo vacío

// Seleccionar elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Cargar los productos en el carrito al cargar la página
function cargarProductosCarrito() {
    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}
cargarProductosCarrito();

// Actualizar los botones de eliminar producto
function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;

    // Encuentra el índice del producto en el arreglo
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    if (index !== -1) {
        // Elimina el producto del arreglo
        productosEnCarrito.splice(index, 1);

        // Actualiza el localStorage y vuelve a cargar los productos en el carrito
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito();

        Toastify({
            text: "Producto eliminado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right,#f4720f , #eba330 )",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            },
            offset: {
                x: '1.5rem',
                y: '1.5rem'
            },
            onClick: function () { }
        }).showToast();
    }
}
// Event listener para vaciar el carrito
botonVaciar.addEventListener("click", vaciarCarrito);

// Función para vaciar el carrito
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.length} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        customClass: {
            confirmButton: 'custom-confirm-button'
        },
        confirmButtonColor: '#f4720f' 

    }).then((result) => {
        if (result.isConfirmed) {
            // Vaciar el arreglo de productos en el carrito y actualizar el localStorage
            productosEnCarrito = [];
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Actualizar la vista del carrito
            cargarProductosCarrito();

            Toastify({
                text: "Carrito vaciado",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right,#f4720f , #eba330 )",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                },
                offset: {
                    x: '1.5rem',
                    y: '1.5rem'
                },
                onClick: function () { }
            }).showToast();
        }
    });
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

// Event listener para comprar el carrito
botonComprar.addEventListener("click", comprarCarrito);


// Función para finalizar la compra
function comprarCarrito() {
    if (productosEnCarrito.length === 0) {
        // Si el carrito está vacío, mostrar un mensaje de advertencia
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agrega productos al carrito antes de finalizar la compra.',
            timer: 3000,
            showConfirmButton: false
        });

    } else {

        productosEnCarrito = [];
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        // Actualizar la vista del carrito
        cargarProductosCarrito();

        // Mostrar un mensaje de éxito
        Swal.fire({
            icon: 'success',
            title: 'Compra exitosa',
            text: 'Gracias por tu compra. Te hemos enviado un correo de confirmación.',
            timer: 3000,
            showConfirmButton: false
        });
    }
}





