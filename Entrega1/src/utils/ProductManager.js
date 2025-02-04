import fs from "node:fs";
import path from "node:path";
import { v4 as uuid } from "uuid";
import { __dirname } from "../dirname.js";

const productsFilePath = path.resolve(__dirname, "../data/products.json");
class ProductsService {
  path;
  products;

  /**
   *
   * @param { path } path - Path del archivo donde se guardan los productos
   */
  constructor({ path }) {
    this.path = path;

    if (fs.existsSync(path)) {
      try {
        this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
      } catch (error) {
        console.error("Error al leer el archivo de productos:", error);
        this.products = [];
      }
    } else {
      this.products = [];
    }
  }

  /**
   *
   * @returns { Promise<Array> } - Devuelve todos los productos
   */
  async getAll() {
    return this.products;
  }

  /**
   *
   * @param { productId } productId - Id del posteo a buscar
   *
   * @returns { Object } - Devuelve el producto con el id pasado por parámetro
   */
  async getById(productId) {
    const product = this.products.find(
      (product) => product.productId === productId
    );
    return product;
  }

  async create({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
  }) {
    const productId = uuid();

    const product = {
      productId,
      title,
      description,
      stock,
      code,
      category,
      precio,
      thumbnails,
    };
    this.products.push(product);

    try {
      await this.saveOnFile();
      return product;
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      throw new Error("Error guardando el producto");
    }
  }

  async addProduct({ title, precio, stock }) {
    if (!title || !precio || !stock) {
      throw new Error("Faltan datos obligatorios: nombre, precio o stock");
    }
    const productId = uuid();
    const newProduct = {
      productId,
      title,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
    };

    this.products.push(newProduct);

    try {
      await this.saveOnFile();
      return newProduct;
    } catch (error) {
      console.error("Error al guardar el producto básico:", error);
      throw new Error("Error guardando el producto básico");
    }
  }

  async update(
    productId,
    { title, description, stock, code, category, precio, thumbnails }
  ) {
    const product = this.products.find(
      (product) => product.productId === productId
    );

    if (!product) {
      return null;
    }

    product.title = title ?? product.title;
    product.description = description ?? product.description;
    product.stock = stock ?? product.stock;
    product.code = code ?? product.code;
    product.category = category ?? product.category;
    product.precio = precio ?? product.precio;
    product.thumbnails = thumbnails ?? product.thumbnails;

    const index = this.products.findIndex(
      (product) => product.productId === productId
    );
    this.products[index] = product;

    try {
      await this.saveOnFile();
      return product;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw new Error("Error al actualizar el producto");
    }
  }

  async delete(productId) {
    const index = this.products.findIndex(
      (product) => product.productId === productId
    );

    if (index === -1) {
      return null;
    }

    const [deletedProduct] = this.products.splice(index, 1);

    try {
      await this.saveOnFile();
      return deletedProduct;
    } catch (error) {
      console.error("Error al borrar el producto:", error);
      throw new Error("Error al borrar el producto");
    }
  }

  async deleteProduct(title) {
    const index = this.products.findIndex(
      (product) => product.title === title
    );
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }
    const [deletedProduct] = this.products.splice(index, 1);
    try {
      await this.saveOnFile();
      return deletedProduct;
    } catch (error) {
      console.error("Error al borrar el producto básico:", error);
      throw new Error("Error al borrar el producto básico");
    }
  }
  async saveOnFile() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.error("Error al guardar el archivo:", error);
      throw new Error("Error al guardar el archivo");
    }
  }
}

export const productsService = new ProductsService({
  path: productsFilePath,
});