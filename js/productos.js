// traer todos los articulos de fakeStore y escribirlos en pagina
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById("contenedor-servicios");
    data.forEach(producto => {
      const productoCard = `
        <div class="servicios-card">
          <h2>${producto.title}</h3>
          <img src="${producto.image}" alt="${producto.title}">
          <h3>Precio: $${producto.price}</h3>
          <button onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
        </div>`;
      contenedor.innerHTML += productoCard;
    });
  });
