import { Router } from 'express';
import {
    getProductsService,
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService
} from '../utils/ProductManager.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', createProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

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
      return res.status(404).send({message: 'Producto no encontrado'})
    }
    res.status(200).send(product);
  });

router.post('/', async (req, res) => {
   const product = req.body;
   await productManager.addProduct(product);
   res.status(201).send({message: 'Producto creado'});
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
