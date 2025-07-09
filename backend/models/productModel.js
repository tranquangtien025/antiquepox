// Importing the mongoose library for MongoDB schema modeling
import mongoose from 'mongoose';

// Defining the schema for the product model
const productSchema = new mongoose.Schema(
  {
    // Product name, required and must be unique
    name: { type: String, required: true, unique: true },

    // Slug for SEO-friendly URL, required and must be unique
    slug: { type: String, required: true, unique: true },

    // Category of the product, required
    category: { type: String, required: true },

    // URL of the product image, required
    image: { type: String, required: true },

    // Price of the product, required
    price: { type: Number, required: true },

    // Quantity available in stock, required
    countInStock: { type: Number, required: true },

    // Country of origin, required
    from: { type: String, required: true },

    // Finish or type of the product, required
    finish: { type: String, required: true },

    // Rating of the product, required
    rating: { type: Number, required: true },

    // Number of reviews for the product, required
    numReviews: { type: Number, required: true },

    // Description of the product, required
    description: { type: String, required: true },
  },
  {
    // Adding timestamps for createdAt and updatedAt
    timestamps: true,
  }
);

// Creating the Product model based on the schema
const Product = mongoose.model('Product', productSchema);

// Exporting the Product model
export default Product;
