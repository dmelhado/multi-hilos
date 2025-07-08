// traer todos los articulos de fakeStore y escribirlos en pagina
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    const contenedor = document.getElementById("contenedor-servicios");
    data.forEach(producto => {
      const productoCard = `
        <a href="detalle.html?id=${producto.id}" class="card-link">
        <div class="servicios-card">
          <h2>${producto.title}</h3>
          <img src="${producto.image}" alt="${producto.title}">
          <h3>Precio: $${producto.price}</h3>
        </div>
        </a>`;
      contenedor.innerHTML += productoCard;
    });
  });
