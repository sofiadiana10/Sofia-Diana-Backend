import express from 'express';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import http from 'http';
import { createProductService, deleteProductService, getProductsService } from './utils/ProductManager.js';

const app = express();
const PORT = 8080;

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const server = http.createServer(app);
const io = new Server(server);

// Middleware de error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Algo salió mal', message: err.message });
});

// Función para obtener la lista de productos y emitirla a los clientes
const emitProducts = async () => {
  try {
    const products = await getProductsService();
    io.emit('productos', products);
  } catch (error) {
    console.error('Error al obtener los productos:', error.message);
  }
};

io.on('connection', async (socket) => {
  console.log('Client connected');

  // Emitir la lista de productos al cliente que se conecta
  emitProducts();

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('agregarProducto', async (product) => {
    try {
      await createProductService(product);
      emitProducts(); // Emitir la lista de productos actualizada
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
      socket.emit('error', { message: 'Error al agregar el producto' }); // Enviar un error al cliente
    }
  });

  socket.on('eliminarProducto', async (title) => {
    try {
      await deleteProductService(title);
      emitProducts(); // Emitir la lista de productos actualizada
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
      socket.emit('error', { message: 'Error al eliminar el producto' }); // Enviar un error al cliente
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

export { io };