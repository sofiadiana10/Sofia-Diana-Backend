import fs from 'fs/promises';
const path = './data/carts.json';

export const getCartService = async () => {
   try {
     const data = await fs.readFile(path, 'utf-8');
     const carts = JSON.parse(data);
    return carts;
   } catch (error) {
        throw new Error("Error al leer el archivo de carritos", error);
    }
}

export const getCartByIdService = async (id) => {
    try {
        const data = await fs.readFile(path, 'utf-8');
        const carts = JSON.parse(data);
      const cart = carts.find(item => item.id === parseInt(id))
        if (!cart) {
            throw new Error(`No existe un carrito con el id ${id}`);
        }
        return cart;
    } catch (error) {
         throw new Error("Error al leer el archivo de carritos", error)
    }

 }

export const createCartService = async () => {
  try {
    const data = await fs.readFile(path, 'utf-8');
    const carts = JSON.parse(data);
    const lastCart = carts[carts.length - 1];
    const newId = lastCart ? lastCart.id + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await fs.writeFile(path, JSON.stringify(carts, null, 2));
    return newCart;
  } catch (error) {
         throw new Error("Error al crear un nuevo carrito", error);
   }
}

export const addProductToCartService = async (cartId, productId, quantity) => {
  try {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("La cantidad debe ser un número entero positivo");
    }
    const data = await fs.readFile(path, 'utf-8');
    const carts = JSON.parse(data);
    const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId));
    if (cartIndex === -1) {
        throw new Error(`No existe un carrito con el id ${cartId}`);
    }
     const productIndex = carts[cartIndex].products.findIndex(item => item.id === parseInt(productId))

       if(productIndex !== -1){
           carts[cartIndex].products[productIndex].quantity += quantity;
       }
       else {
          const newProduct = { id: parseInt(productId), quantity: quantity };
          carts[cartIndex].products.push(newProduct);
        }
        await fs.writeFile(path, JSON.stringify(carts, null, 2));
        return carts[cartIndex];
  } catch (error) {
      throw new Error("Error al agregar un producto al carrito", error);
  }

}

export const deleteCartService = async (id) => {
  try {
     const data = await fs.readFile(path, 'utf-8');
     const carts = JSON.parse(data);
     const cartIndex = carts.findIndex(cart => cart.id === parseInt(id));
     if (cartIndex === -1) {
           throw new Error(`No existe un carrito con el id ${id}`);
        }
     carts.splice(cartIndex, 1);
     await fs.writeFile(path, JSON.stringify(carts, null, 2));
   } catch (error) {
      throw new Error("Error al borrar un carrito", error);
  }
}

export const deleteProductFromCartService = async (cartId, productId) => {
  try {
     const data = await fs.readFile(path, 'utf-8');
     const carts = JSON.parse(data);
     const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId));
     if (cartIndex === -1) {
        throw new Error(`No existe un carrito con el id ${cartId}`);
      }
    const productIndex = carts[cartIndex].products.findIndex(item => item.id === parseInt(productId));
     if (productIndex === -1) {
        throw new Error(`No existe un producto con el id ${productId} en el carrito`);
     }
      carts[cartIndex].products.splice(productIndex, 1);
     await fs.writeFile(path, JSON.stringify(carts, null, 2));
   } catch (error) {
       throw new Error("Error al borrar un producto del carrito", error);
    }
};