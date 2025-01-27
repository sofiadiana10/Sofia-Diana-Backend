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
app.use(express.static('./src/public'))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const server = http.createServer(app);
const io = new Server(server);

 // Middleware de error
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: 'Algo salió mal' });
});
io.on('connection', async socket => {
   console.log('Client connected');
    socket.on('disconnect', () => {
       console.log('Client disconnected');
    });
    socket.on('getProducts', async () => {
       try{
         const products = await getProductsService()
          socket.emit('products', products)
       }
       catch (error){
            socket.emit('products', []);
            console.log(error)
        }
   });
   socket.on('addProduct', async (product) => {
      try{
        await createProductService(product)
          const products = await getProductsService()
          io.emit('products', products)
       }
       catch (error){
            console.log(error)
        }
  });
   socket.on('deleteProduct', async (id) => {
     try{
          await deleteProductService(id);
        const products = await getProductsService()
          io.emit('products', products)
      }
      catch (error){
         console.log(error)
      }
   });
});
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

export { io };