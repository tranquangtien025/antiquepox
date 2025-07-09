// Importing the mongoose library for MongoDB schema modeling
import mongoose from 'mongoose';

// Defining the schema for the user model
const userSchema = new mongoose.Schema(
  {
    // User's name, required
    name: { type: String, required: true },

    // User's email, required and must be unique
    email: { type: String, required: true, unique: true },

    // User's password, required
    password: { type: String, required: true },

    // Admin status of the user, default is false, required
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    // Adding timestamps for createdAt and updatedAt
    timestamps: true,
  }
);

// Creating the User model based on the schema
const User = mongoose.model('User', userSchema);

// Exporting the User model
export default User;
