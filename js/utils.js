let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(id) {
    const productoExistente = carrito.find(p => p.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }


    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function eliminarDelCarrito(id) {
  const index = carrito.findIndex(item => item.id === id);

  if (index !== -1) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad--;
    } else {
      carrito.splice(index, 1); // remove the item entirely
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito(); // refresh the view
  }

}

function actualizarContadorCarrito() {
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].cantidad;
    }

    document.getElementById("contador-carrito").innerHTML = `<a href="carrito.html">🛒 (${total})</a>`;
}

function mostrarCarrito() {
  carrito.sort((a, b) => a.id - b.id);

  const contenedor = document.getElementById("contenedor-carrito");
  contenedor.innerHTML = "";

  const fetches = carrito.map(item => {
    return fetch(`https://fakestoreapi.com/products/${item.id}`)
      .then(response => response.json())
      .then(producto => ({
        producto,
        cantidad: item.cantidad
      }));
  });

  Promise.all(fetches).then(items => {
    let precioTotal = 0;

    items.forEach(({ producto, cantidad }) => {
      const precioArticulo = cantidad * producto.price;
      precioTotal += precioArticulo;

      const card = `
        <div class="carrito-card">
          <div>
            <img src="${producto.image}" alt="${producto.title}">
          </div>
            <h2>${producto.title}</h2>
          <h3>Cantidad: ${cantidad}</h3>
          <h3>Precio: $${precioArticulo.toFixed(2)}</h3>
          <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
        </div>
      `;
      contenedor.innerHTML += card;
    });

    // Now append the subtotal after all items are rendered
    contenedor.innerHTML += `<h1>Subtotal: $${precioTotal.toFixed(2)}</h1>`;
  });
}