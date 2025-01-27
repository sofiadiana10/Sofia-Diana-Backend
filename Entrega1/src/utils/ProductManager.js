import fs from 'fs/promises';
const path = './data/products.json';


export const getProductsService = async () => {
  try {
    const data = await fs.readFile(path, 'utf-8');
    const products = JSON.parse(data);
    return products;
  } catch (error) {
        throw new Error("Error al leer el archivo de productos", error);
    }
}


export const getProductByIdService = async (id) => {
    try {
      const data = await fs.readFile(path, 'utf-8');
      const products = JSON.parse(data);
      const product = products.find(item => item.id === parseInt(id));
      if (!product) {
          throw new Error(`No existe un producto con el id ${id}`);
      }
      return product;
  } catch (error) {
        throw new Error("Error al leer el archivo de productos", error);
    }
}
export const createProductService = async (product) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = product;
        if (!title || !description || !code || !price || !stock || !category || !thumbnails || !Array.isArray(thumbnails)) {
          throw new Error("Todos los campos son obligatorios");
        }
        const data = await fs.readFile(path, 'utf-8');
        const products = JSON.parse(data);
        const codeExists = products.find(item => item.code === code)
        if(codeExists){
          throw new Error(`Ya existe un producto con el código ${code}`);
        }
        const lastProduct = products[products.length - 1];
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        const newProduct = { id: newId, ...product };
        products.push(newProduct);
        await fs.writeFile(path, JSON.stringify(products, null, 2));
        return newProduct;
    } catch (error) {
        throw new Error("Error al crear el producto", error);
    }
}


export const updateProductService = async (id, product) => {
    try{
      const data = await fs.readFile(path, 'utf-8');
      const products = JSON.parse(data);
      const productIndex = products.findIndex(item => item.id === parseInt(id));
      if (productIndex === -1) {
            throw new Error(`No existe un producto con el id ${id}`);
        }
       products[productIndex] = { ...products[productIndex], ...product};
        await fs.writeFile(path, JSON.stringify(products, null, 2));
        return products[productIndex];
    } catch (error) {
       throw new Error("Error al actualizar el producto", error);
    }
}

export const deleteProductService = async (id) => {
    try{
       const data = await fs.readFile(path, 'utf-8');
       const products = JSON.parse(data);
       const productIndex = products.findIndex(item => item.id === parseInt(id));
       if (productIndex === -1) {
            throw new Error(`No existe un producto con el id ${id}`);
        }
        products.splice(productIndex, 1);
        await fs.writeFile(path, JSON.stringify(products, null, 2));
    } catch (error) {
       throw new Error("Error al borrar el producto", error);
    }
}