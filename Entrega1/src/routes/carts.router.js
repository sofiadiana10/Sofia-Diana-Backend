import { Router } from 'express';
import {
    getCartService,
    getCartByIdService,
    createCartService,
    addProductToCartService,
    deleteCartService,
    deleteProductFromCartService
} from '../Entrega1/src/utils/CartManager.js';
import { getProductByIdService } from '../Entrega1/src/utils/ProductManager.js'; // Import para validar productos

const router = Router();

// Middleware para validar la existencia de un producto
const validateCartProduct = async (productId) => {
    const product = await getProductByIdService(productId);
    return product !== null;
};

router.get('/', async (req, res) => {
    try {
        const carts = await getCartService();
        res.json(carts); // Envío con res.json
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los carritos" }); // Mensaje de error JSON
    }
});

router.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await getCartByIdService(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" }); // Mensaje de error JSON
        }
        res.json(cart); // Envío con res.json
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" }); // Mensaje de error JSON
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await createCartService();
        res.status(201).json(newCart); // Envío con res.json
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" }); // Mensaje de error JSON
    }
});

router.post('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;

    // Validación de producto usando el middleware
    if (!(await validateCartProduct(productId))) {
        return res.status(400).json({ error: "Producto no encontrado" }); // Mensaje de error JSON
    }

    try {
        const updatedCart = await addProductToCartService(cartId, productId);
        res.json(updatedCart); // Envío con res.json
    } catch (error) {
        res.status(500).json({ error: error.message }); // Mensaje de error JSON
    }
});

router.delete('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        const updatedCart = await deleteProductFromCartService(cartId, productId);
        res.json(updatedCart); // Envío con res.json
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto del carrito" }); // Mensaje de error JSON
    }
});

export default router;