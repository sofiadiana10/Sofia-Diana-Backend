import { Router } from 'express';
import {
    getCartService,
    getCartByIdService,
    createCartService,
    addProductToCartService,
    deleteCartService,
    deleteProductFromCartService
} from '../utils/CartManager.js';

const router = Router();


router.get('/', async (req, res, next) => {
  try {
    const carts = await getCartService();
    res.status(200).send(carts);
  } catch (error) {
    next(error);
  }
});


router.get('/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await getCartByIdService(cid);
     res.status(200).send(cart);
  } catch (error) {
   next(error);
  }
});

router.post('/', async (req, res, next) => {
    try {
      const newCart = await createCartService();
      res.status(201).send(newCart);
    } catch (error) {
      next(error)
    }

});


router.post('/:cid/product/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await addProductToCartService(cid, pid, quantity);
    res.status(200).send(cart);
  } catch (error) {
   next(error);
  }
});

router.delete('/:cid', async (req, res, next) => {
    try {
      const { cid } = req.params;
      await deleteCartService(cid);
      res.status(200).send({ message: 'Carrito eliminado' });
    } catch (error) {
      next(error);
    }
  });


router.delete('/:cid/products/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    await deleteProductFromCartService(cid, pid);
      res.status(200).send({ message: 'Producto eliminado del carrito' });
    } catch (error) {
      next(error);
    }

});
export default router;