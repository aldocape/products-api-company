const database = require("../database");
const requestHandler = require("../middlewares/requestHandler");

export const createProduct = requestHandler(async (req, res) => {
  //   console.log(req.body);
  const product = {
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    imgUrl: req.body.imgUrl,
  };

  const productSaved = await database.add(product);

  res.status(201).json(productSaved);
});

export const getProducts = requestHandler(async (req, res) => {
  const products = await database.list();
  res.json(products);
});

export const getProductById = requestHandler(async (req, res) => {
  const product = await database.findById(req.params.productId);
  res.status(200).json(product);
});

export const updateProductById = requestHandler(async (req, res) => {
  const updatedProduct = await database.update(req.params.productId, req.body);
  res.json(updatedProduct);
});

export const deleteProductById = requestHandler(async (req, res) => {
  const { productId } = req.params;
  await database.remove(productId);
  res.status(204).json("Product deleted");
});
