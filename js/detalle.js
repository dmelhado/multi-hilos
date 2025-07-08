async function mostrarDetalle(id) {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    const fetchedItem = await response.json();

    const contenedor = document.getElementById("contenedor-detalle");

    console.log(fetchedItem.title);

    let cantidades = "";
    for (let i = 1; i <= 10; i++) {
        cantidades += `<option value="${i}">${i}</option>`;
    }

    const detalleCard = `
        <div class="left">
            <img src="${fetchedItem.image}" alt="${fetchedItem.title}">
        </div>
        
        <div class="right">
            <h2>${fetchedItem.title}</h2>
            <detail>${fetchedItem.description}</detail>
            <h3>Precio por unidad: $${fetchedItem.price}</h3>

            <div class="cantidad-wrapper">
                <label for="cantidad">Cantidad:</label>
                <select id="cantidad">
                        ${cantidades}
                </select>
            </div>

            <button id="agregar-carrito">Agregar al carrito</button>
        </div>
    `;

    contenedor.innerHTML = detalleCard;  // Use = instead of += to avoid duplicates

    // Now the button exists, attach the event listener here:
    document.getElementById("agregar-carrito").addEventListener("click", () => {
        const cantidad = parseInt(document.getElementById("cantidad").value);
        const id = fetchedItem.id;

        agregarAlCarrito(id, cantidad);
    });
}
