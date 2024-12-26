import { Router } from 'express';
import ProductManager from '../utils/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

productManager.readFile()

router.get('/', async (req, res) => {
  const products = productManager.getProducts();
  res.status(200).send(products);
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params
    const product = productManager.getProductById(parseInt(pid));
    if(!product){
      return res.status(404).send({message: 'Product not found'})
    }
    res.status(200).send(product);
  });

router.post('/', async (req, res) => {
   const product = req.body;
   await productManager.addProduct(product);
   res.status(201).send({message: 'Product created'});
 });

router.put('/:pid', async (req, res) => {
     const { pid } = req.params;
     const product = req.body;
     await productManager.updateProduct(parseInt(pid), product);
     res.status(200).send({message: 'Producto cargado'});
   });

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    await productManager.deleteProduct(parseInt(pid));
    res.status(200).send({message: 'Producto eliminado'});
})


export default router;