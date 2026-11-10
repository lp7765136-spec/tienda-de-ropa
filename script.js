// Productos en arreglo de objetos - renderizado dinámico en el DOM
const productos = [
  { id:1, nombre:"Camiseta Oversize Negra", categoria:"Camisetas", tallas:["S","M","L","XL"], precio:45000, img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" },
  { id:2, nombre:"Camiseta Blanca Básica", categoria:"Camisetas", tallas:["S","M","L"], precio:39000, img:"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800" },
  { id:3, nombre:"Camiseta Gráfica Urban", categoria:"Camisetas", tallas:["M","L","XL"], precio:55000, img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800" },
  { id:4, nombre:"Jean Azul Clásico", categoria:"Jeans", tallas:["S","M","L","XL"], precio:89000, img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=800" },
  { id:5, nombre:"Jean Negro Skinny", categoria:"Jeans", tallas:["S","M","L"], precio:95000, img:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800" },
  { id:6, nombre:"Jean Cargo Beige", categoria:"Jeans", tallas:["M","L","XL"], precio:99000, img:"https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800" },
  { id:7, nombre:"Sudadera Gris Hoodie", categoria:"Sudaderas", tallas:["S","M","L","XL"], precio:95000, img:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800" },
  { id:8, nombre:"Sudadera Negra Oversize", categoria:"Sudaderas", tallas:["M","L","XL"], precio:110000, img:"https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800" },
  { id:9, nombre:"Sudadera Blanca con Capucha", categoria:"Sudaderas", tallas:["S","M","L"], precio:105000, img:"https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800" },
  { id:10, nombre:"Chaqueta Jean", categoria:"Chaquetas", tallas:["S","M","L"], precio:130000, img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800" },
  { id:11, nombre:"Chaqueta Bomber Negra", categoria:"Chaquetas", tallas:["M","L","XL"], precio:150000, img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800" },
  { id:12, nombre:"Chaqueta Cuero Café", categoria:"Chaquetas", tallas:["S","M","L","XL"], precio:175000, img:"https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800" }
];

// Carrito persistente en localStorage
let carrito = JSON.parse(localStorage.getItem("carritoUrbanStyle")) || [];
let descuento = 0;
let cuponAplicado = "";

function guardarCarrito(){
  localStorage.setItem("carritoUrbanStyle", JSON.stringify(carrito));
  actualizarContador();
  mostrarResumen();
}

function actualizarContador(){
  let totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById("contadorCarrito").textContent = totalItems;
}

// Renderizar catálogo con filtros y ordenamiento
function mostrarProductos(){
  let categoria = document.getElementById("filtroCategoria").value;
  let talla = document.getElementById("filtroTalla").value;
  let orden = document.getElementById("ordenPrecio").value;

  let filtrados = productos.filter(p => {
    let okCat = categoria === "todos" || p.categoria === categoria;
    let okTalla = talla === "todos" || p.tallas.includes(talla);
    return okCat && okTalla;
  });

  if(orden === "menor") filtrados.sort((a,b) => a.precio - b.precio);
  if(orden === "mayor") filtrados.sort((a,b) => b.precio - a.precio);

  let cont = document.getElementById("contenedorProductos");
  cont.innerHTML = "";
  if(filtrados.length === 0){
    cont.innerHTML = "<p>No hay productos con esos filtros.</p>";
    return;
  }
  filtrados.forEach(p => {
    cont.innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.nombre}">
        <div class="card-body">
          <h3>${p.nombre}</h3>
          <p>${p.categoria}</p>
          <p><span class="tallas">Tallas: ${p.tallas.join(" - ")}</span></p>
          <p class="precio">$${p.precio.toLocaleString()} COP</p>
          <button class="btn" onclick="agregarAlCarrito(${p.id})">🛒 Agregar</button>
        </div>
      </div>
    `;
  });
}

function filtrarDesdeColeccion(cat){
  document.getElementById("filtroCategoria").value = cat;
  mostrarProductos();
  document.getElementById("catalogo").scrollIntoView({behavior:"smooth"});
}

document.getElementById("filtroCategoria").addEventListener("change", mostrarProductos);
document.getElementById("filtroTalla").addEventListener("change", mostrarProductos);
document.getElementById("ordenPrecio").addEventListener("change", mostrarProductos);

// Carrito: agregar, quitar, cambiar cantidades
function agregarAlCarrito(id){
  let prod = productos.find(p => p.id === id);
  let existe = carrito.find(i => i.id === id);
  if(existe){ existe.cantidad++; }
  else { carrito.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, img: prod.img, cantidad: 1 }); }
  guardarCarrito();
  alert(`${prod.nombre} agregado al carrito ✅`);
}

function cambiarCantidad(id, nueva){
  let item = carrito.find(i => i.id === id);
  if(!item) return;
  item.cantidad = parseInt(nueva);
  if(item.cantidad < 1) item.cantidad = 1;
  guardarCarrito();
  mostrarCarrito();
}

function quitarDelCarrito(id){
  carrito = carrito.filter(i => i.id !== id);
  guardarCarrito();
  mostrarCarrito();
}

function verCarrito(){
  document.getElementById("carrito").classList.remove("oculto");
  mostrarCarrito();
  document.getElementById("carrito").scrollIntoView({behavior:"smooth"});
}
function cerrarCarrito(){ document.getElementById("carrito").classList.add("oculto"); }
function irCheckout(){
  document.getElementById("checkout").scrollIntoView({behavior:"smooth"});
}

function mostrarCarrito(){
  let lista = document.getElementById("listaCarrito");
  if(carrito.length === 0){
    lista.innerHTML = "<p>Tu carrito está vacío. Agrega productos del catálogo.</p>";
  } else {
    lista.innerHTML = "";
    carrito.forEach(item => {
      lista.innerHTML += `
        <div class="item-carrito">
          <img src="${item.img}">
          <div><b>${item.nombre}</b><br>$${item.precio.toLocaleString()} c/u</div>
          <label>Cant: <input type="number" min="1" value="${item.cantidad}" onchange="cambiarCantidad(${item.id}, this.value)"></label>
          <b>$${(item.precio * item.cantidad).toLocaleString()}</b>
          <button class="btn-eliminar" onclick="quitarDelCarrito(${item.id})">Quitar</button>
        </div>
      `;
    });
  }
  mostrarTotales();
}

function mostrarTotales(){
  let subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  let valorDescuento = subtotal * descuento;
  let total = subtotal - valorDescuento;
  document.getElementById("totales").innerHTML = `
    <p>Subtotal: <b>$${subtotal.toLocaleString()} COP</b></p>
    <p>Descuento (${cuponAplicado || "Sin cupón"}): <b>-$${valorDescuento.toLocaleString()} COP</b></p>
    <hr>
    <p style="font-size:20px">Total a pagar: <b>$${total.toLocaleString()} COP</b></p>
  `;
}

// Cupón de descuento validado con JavaScript
function aplicarCupon(){
  let codigo = document.getElementById("codigoCupon").value.trim().toUpperCase();
  let msg = document.getElementById("mensajeCupon");
  if(codigo === "URBAN10"){
    descuento = 0.10;
    cuponAplicado = "URBAN10 - 10%";
    msg.textContent = "✅ Cupón aplicado: 10% de descuento";
    msg.style.color = "green";
  } else {
    descuento = 0;
    cuponAplicado = "";
    msg.textContent = "❌ Cupón no válido. Prueba con URBAN10";
    msg.style.color = "red";
  }
  mostrarTotales();
  mostrarResumen();
}

// Resumen del pedido en checkout
function mostrarResumen(){
  let subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  let valorDescuento = subtotal * descuento;
  let total = subtotal - valorDescuento;
  let cont = document.getElementById("resumenPedido");
  if(carrito.length === 0){
    cont.innerHTML = "<p>Sin productos. Agrega algo del catálogo.</p>";
    return;
  }
  let itemsHtml = carrito.map(i => `<p>${i.nombre} x ${i.cantidad} - $${(i.precio*i.cantidad).toLocaleString()}</p>`).join("");
  cont.innerHTML = itemsHtml + `<hr><p>Subtotal: $${subtotal.toLocaleString()}</p><p>Descuento: -$${valorDescuento.toLocaleString()}</p><p><b>Total: $${total.toLocaleString()} COP</b></p>`;
}

// Validación del formulario de envío y mensaje de confirmación
document.getElementById("formEnvio").addEventListener("submit", function(e){
  e.preventDefault();
  let nombre = document.getElementById("nombreEnvio").value.trim();
  let telefono = document.getElementById("telefonoEnvio").value.trim();
  let direccion = document.getElementById("direccionEnvio").value.trim();
  let pago = document.getElementById("metodoPago").value;

  if(!nombre || !telefono || !direccion || !pago){
    alert("Por favor completa todos los campos de envío.");
    return;
  }
  if(!/^3\d{9}$/.test(telefono)){
    alert("Escribe un celular válido de 10 dígitos que empiece por 3, ejemplo: 3146039495");
    return;
  }
  if(carrito.length === 0){
    alert("Tu carrito está vacío. Agrega productos antes de confirmar.");
    return;
  }

  let subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  let total = subtotal - (subtotal * descuento);
  let numeroPedido = "US-" + Math.floor(Math.random()*9000+1000);

  let conf = document.getElementById("confirmacionPedido");
  conf.classList.remove("oculto");
  conf.innerHTML = `
    <h3>✅ ¡Pedido confirmado!</h3>
    <p><b>Número de pedido:</b> ${numeroPedido}</p>
    <p><b>Nombre:</b> ${nombre}</p>
    <p><b>Celular:</b> ${telefono}</p>
    <p><b>Dirección:</b> ${direccion}</p>
    <p><b>Pago:</b> ${pago} (simulado)</p>
    <p><b>Total pagado:</b> $${total.toLocaleString()} COP</p>
    <p>Gracias por comprar en Urban Style. Te confirmamos por WhatsApp al ${telefono}.</p>
    <a href="https://wa.me/573146039495?text=${encodeURIComponent(`Hola Urban Style, soy ${nombre}. Mi pedido ${numeroPedido} por $${total.toLocaleString()} ya está confirmado.`)}" target="_blank" class="btn" style="text-decoration:none">Confirmar por WhatsApp</a>
  `;
  conf.scrollIntoView({behavior:"smooth"});

  // Vaciar carrito después de comprar
  carrito = [];
  descuento = 0; cuponAplicado = "";
  guardarCarrito();
  mostrarCarrito();
});

mostrarProductos();
actualizarContador();
mostrarResumen();