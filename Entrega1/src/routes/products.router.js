import { Router } from 'express';
import {
    getProductsService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService
} from '../Entrega1/src/utils/ProductManager.js';
import { io } from '../app.js'; // Importa la instancia de io desde app.js

const router = Router();

const validateProductFields = (product) => {
  const {title, description, code, price, status, stock, category} =
    product;

  if (
    !title ||
    !description ||
    !code||
    !category ||
    price === undefined ||
    stock === undefined
  ) {
    return {
      valid: false,
      message: "Todos los campos son obligatorios excepto thumbnails",
    };
  }

  if (typeof precio !== "number" || typeof stock !== "number") {
    return { valid: false, message: "Precio y stock deben ser números" };
  }

  if (status !== undefined && typeof status !== "boolean") {
    return { valid: false, message: "Status debe ser un valor booleano" };
  }

  return { valid: true };
};

router.get('/', async (req, res) => {
  try {
    const products = await getProductsService();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error.message);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await getProductByIdService(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error al obtener el producto:", error.message);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post('/', async (req, res) => {
  const newProduct = req.body;
  const validation = validateProductFields(newProduct);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const createdProduct = await createProductService(newProduct);
    io.emit("nuevo-producto", createdProduct); // Emitir evento de Socket.IO
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error al crear el producto:", error.message);
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

router.put('/:productId', async (req, res) => {
  const { productId } = req.params;
  const updatedProduct = req.body;
  const validation = validateProductFields(updatedProduct);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const product = await updateProductService(productId, updatedProduct);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error al actualizar el producto:", error.message);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const productDeleted = await deleteProductService(productId);
    if (!productDeleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    io.emit("eliminar-producto", productId)
    res.status(200).json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error.message);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});