
const express = require("express");
const mongoose = require("mongoose");
const { engine } = require("express-handlebars");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const Product = require("./models/Product");
const Cart = require("./models/Cart");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("🟢 Conectado a MongoDB Atlas"))
  .catch(err => console.error("🔴 Error al conectar a MongoDB", err));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ruta principal
app.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("home", { products });
});

// Vista en tiempo real
app.get("/realtimeproducts", async (req, res) => {
  const products = await Product.find();
  res.render("realTimeProducts", { products });
});

// Ruta para agregar producto
app.post("/products", async (req, res) => {
  const product = await Product.create(req.body);
  const products = await Product.find();
  io.emit("updateProducts", products);
  res.json(product);
});

// Ruta para eliminar producto
app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  const products = await Product.find();
  io.emit("updateProducts", products);
  res.json({ message: "Producto eliminado" });
});

// Vista del carrito
app.get("/cart", async (req, res) => {
  const cart = await Cart.findOne().populate("products.product");
  res.render("cart", { cart });
});

// Agregar producto al carrito
app.post("/cart/add", async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne();
  if (!cart) cart = new Cart({ products: [] });
  const index = cart.products.findIndex(p => p.product.toString() === productId);
  if (index !== -1) cart.products[index].quantity++;
  else cart.products.push({ product: productId, quantity: 1 });
  await cart.save();
  io.emit("updateCart", cart);
  res.json({ message: "Producto agregado al carrito" });
});

// Eliminar producto del carrito
app.post("/cart/remove", async (req, res) => {
  const { productId } = req.body;
  let cart = await Cart.findOne();
  if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
  cart.products = cart.products.filter(p => p.product.toString() !== productId);
  await cart.save();
  io.emit("updateCart", cart);
  res.json({ message: "Producto eliminado del carrito" });
});

io.on("connection", socket => {
  console.log("Cliente conectado a WebSocket");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor corriendo en puerto", PORT));
