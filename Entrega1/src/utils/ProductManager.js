import fs from 'node:fs/promises';

class ProductManager {
   constructor(path) {
      this.path = path;
      this.products = [];
      this.id = 0;
   }
   async addProduct(product) {
        const { title, description, code, price, stock, category, thumbnails } = product;
        if (!title || !description || !code || !price || !stock || !category || !thumbnails || !Array.isArray(thumbnails)) {
          console.log('Todos los campos son obligatorios');
          return;
        }
      
        const codeExists = this.products.find(item => item.code === code)
        if(codeExists){
          console.log(`Ya existe un producto con el código ${code}`);
          return
        }
        this.id++;
        const newProduct = { id: this.id, ...product };
        this.products.push(newProduct);
        try{
          await this.writeFile();
        }
        catch (error){
          console.log(error)
        }
   }
   getProducts() {
      return this.products
   }
   getProductById(id) {
      const product = this.products.find(item => item.id === id)
      if (!product) {
          console.log("Not found")
          return
      }
      return product
   }
  async updateProduct(id, product){
        const productIndex = this.products.findIndex(item => item.id === id);
        if (productIndex === -1){
          console.log(`No existe un producto con el id ${id}`);
          return
        }
         this.products[productIndex] = { ...this.products[productIndex], ...product};
         try{
             await this.writeFile();
           }
         catch (error){
          console.log(error)
          }
   }
  async deleteProduct(id){
        const productIndex = this.products.findIndex(item => item.id === id);
        if (productIndex === -1){
            console.log(`No existe un producto con el id ${id}`);
            return
         }
        this.products.splice(productIndex, 1);
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
          this.products = jsonData;
          this.id = this.products.length;
      } catch (error) {
          console.log("Error al leer el archivo:", error)
      }
   }
  async writeFile() {
    try{
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
    }
    catch (error){
      console.log("Error al escribir el archivo: ", error);
    }
  }
}

export default ProductManager;