// Importing the Express framework, the Product and User models, and sample data
import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';
import User from '../models/userModel.js';

// Creating an instance of the Express Router
const seedRouter = express.Router();

// Route for seeding data
seedRouter.get('/', async (req, res) => {
  // Removing all existing products from the database
  await Product.remove({});

  // Inserting sample products into the database
  const createdProducts = await Product.insertMany(data.products);

  // Removing all existing users from the database
  await User.remove({});

  // Inserting sample users into the database
  const createdUsers = await User.insertMany(data.users);

  // Sending a response with information about created products and users
  res.send({ createdProducts, createdUsers });
});

// Exporting the seedRouter
export default seedRouter;
