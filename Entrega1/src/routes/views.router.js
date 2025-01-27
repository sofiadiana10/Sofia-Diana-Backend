import { Router } from 'express';
import { getProductsService } from '../utils/ProductManager.js';

const router = Router();

router.get('/', async (req, res) => {
     try{
         const products = await getProductsService();
         res.render('home', { products });
    }
    catch (error){
         res.status(500).send({ message: error });
    }
});

router.get('/realtimeproducts', async (req, res) => {
     try{
        const products = await getProductsService();
        res.render('realTimeProducts', { products });
     }
    catch (error){
         res.status(500).send({ message: error });
     }

});

export default router;