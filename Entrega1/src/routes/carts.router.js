import { Router } from 'express';
import CartManager from '../utils/CartManager.js';

const router = Router();
const cartManager = new CartManager('./data/carts.json');

cartManager.readFile();

router.post('/', async (req, res) => {
    await cartManager.addCart();
   res.status(201).send({message: 'Carrito creado'});
  });

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = cartManager.getCartById(parseInt(cid));
    if(!cart){
     return res.status(404).send({message: 'Carrito no encontrado'});
    }
    res.status(200).send(cart.products);
 });

router.post('/:cid/product/:pid', async (req, res) => {
     const { cid, pid } = req.params;
     const { quantity } = req.body;
   
    if(!quantity) {
      return res.status(400).send({message: 'La cantidad es requerida'})
    }
     await cartManager.addProductToCart(parseInt(cid), parseInt(pid), quantity)
      res.status(201).send({message: 'Producto agregado al carrito'});
   });

export default router;