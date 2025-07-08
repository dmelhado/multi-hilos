let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosCache = {};

function actualizarItemCarrito(id, cantidad) {
  cantidad = parseInt(cantidad);
  const productoExistente = carrito.find(p => p.id === id);

  if (productoExistente) {
    productoExistente.cantidad = cantidad;
  } else {
    carrito.push({ id: id, cantidad: cantidad });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  console.log("Carrito actualizado:", carrito);
}

function agregarAlCarrito(id, cantidad) {
  actualizarItemCarrito(id, cantidad);
  actualizarContadorCarrito();
}

function eliminarDelCarrito(id) {
  const index = carrito.findIndex(item => item.id === id);

  if (index !== -1) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
}

function actualizarContadorCarrito() {
  let total = 0;
  for (let i = 0; i < carrito.length; i++) {
    total += parseInt(carrito[i].cantidad);
  }

  const elem = document.getElementById("contador-carrito");
  if (elem) {
    elem.innerHTML = `<a href="carrito.html" class="contador-carrito">🛒 (${total})</a>`;
  }
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

    items.forEach(({ producto }) => {
      productosCache[producto.id] = producto;
    });

    items.forEach(({ producto, cantidad }) => {
      const precioArticulo = cantidad * producto.price;
      precioTotal += precioArticulo;

      const card = `
      <div class="carrito-card">
        <div class="image-container">
          <img src="${producto.image}" alt="${producto.title}">
        </div>
        <h2>${producto.title}</h2>

        <label for="cantidad-${producto.id}">Cantidad:</label>
        <select id="cantidad-${producto.id}" onchange="
          actualizarItemCarrito(${producto.id}, this.value);
          actualizarSubtotal();
          actualizarContadorCarrito();
        ">
          ${[...Array(10).keys()].map(i => {
        const val = i + 1;
        return `<option value="${val}" ${val == cantidad ? 'selected' : ''}>${val}</option>`;
      }).join("")}
        </select>

        <h3>Precio por unidad: $${producto.price.toFixed(2)}</h3>
        <button onclick="eliminarDelCarrito(${producto.id})">Eliminar</button>
      </div>
      `;
      contenedor.innerHTML += card;
    });
    actualizarSubtotal()
  });

}

function actualizarSubtotal() {
  let total = 0;

  for (const item of carrito) {
    const producto = productosCache[item.id];
    if (producto) {
      total += producto.price * parseInt(item.cantidad);
    }
  }

  const subtotalElem = document.getElementById("subtotal");
  if (subtotalElem) {
    subtotalElem.textContent = `Subtotal: $${total.toFixed(2)}`;
  }
}
