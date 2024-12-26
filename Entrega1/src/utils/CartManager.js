import fs from 'node:fs/promises';

class CartManager {
    constructor(path) {
       this.path = path;
       this.carts = [];
       this.id = 0;
    }
   async addCart(){
        this.id++;
        const newCart = { id: this.id, products: [] };
        this.carts.push(newCart)
        try{
            await this.writeFile();
        }
        catch (error){
          console.log(error)
         }
    }
    getCartById(id){
        const cart = this.carts.find(item => item.id === id)
        if (!cart) {
            console.log("Not found")
            return
         }
       return cart
    }
    async addProductToCart(cartId, productId, quantity){
        const cart = await this.getCartById(cartId);
        if (!cart) {
            console.log(`No existe un carrito con el id ${cartId}`)
           return;
         }
        const productExists = cart.products.find(item => item.product === productId)
        if (productExists){
            productExists.quantity += quantity;
        }
        else {
            const newProduct = { product: productId, quantity: quantity };
           cart.products.push(newProduct);
        }
         try{
            await this.writeFile();
         }
         catch (error){
           console.log(error)
         }
    }
     async readFile() {
        try {
          const data = await fs.readFile(this.path, 'utf-8');
          const jsonData = JSON.parse(data);
           this.carts = jsonData;
            this.id = this.carts.length;
         } catch (error) {
          console.log("Error al leer el archivo:", error)
         }
      }
    async writeFile() {
       try{
         await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        }
       catch (error){
           console.log("Error al escribir el archivo: ", error);
        }
    }
 }

 export default CartManager;