// Importing the Express framework and the Product model
import express from 'express';
import Product from '../models/productModel.js';

// Creating an instance of the Express Router
const productRouter = express.Router();

// Route for getting all products
productRouter.get('/', async (req, res) => {
  // Fetching all products from the database
  const products = await Product.find();

  // Sending the products as a response
  res.send(products);
});

// Route for getting a product by slug
productRouter.get('/slug/:slug', async (req, res) => {
  // Finding a product by slug in the database
  const product = await Product.findOne({ slug: req.params.slug });

  // Checking if the product is found
  if (product) {
    // If found, send the product as a response
    res.send(product);
  } else {
    // If not found, send a 404 (Not Found) status along with an error message
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// Route for getting a product by ID
productRouter.get('/:id', async (req, res) => {
  // Finding a product by ID in the database
  const product = await Product.findById(req.params.id);

  // Checking if the product is found
  if (product) {
    // If found, send the product as a response
    res.send(product);
  } else {
    // If not found, send a 404 (Not Found) status along with an error message
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// Exporting the productRouter
export default productRouter;
