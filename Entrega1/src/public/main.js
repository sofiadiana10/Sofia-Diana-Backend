const socket = io();

// Agregar producto
const formAgregar = document.querySelector('#form-agregar');
formAgregar.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const description = document.querySelector('#description').value;
  const code = document.querySelector('#code').value;
  const price = document.querySelector('#price').value;
  const stock = document.querySelector('#stock').value;
  const category = document.querySelector('#category').value;
  const thumbnails = document.querySelector('#thumbnails').value;
  socket.emit('agregarProducto', {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  });
  formAgregar.reset();
});

// Eliminar producto
const formEliminar = document.querySelector('#form-eliminar');
formEliminar.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title-eliminar').value;
  socket.emit('eliminarProducto', title);
  formEliminar.reset();
});

// Recibir productos
socket.on('productos', (productos) => {
  const listaProductos = document.querySelector('#lista-productos');
  listaProductos.innerHTML = '';
  productos.forEach((producto) => {
    const li = document.createElement('li');
    li.classList.add('collection-item', 'col', 's12', 'm6');
    li.innerHTML = `
      <p><span
            class="yellow accent-2"
            style="border-radius: 10%; padding: 10px 15px; margin-right: 10px; font-weight: bold;"
          >${producto.title}</span>
          Precio: $${producto.price}
          | Stock:
          ${producto.stock}</p>
    `;
    listaProductos.appendChild(li);
  });
});