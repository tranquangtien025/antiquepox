// Importing the Express framework, bcrypt for password hashing,
// expressAsyncHandler for handling asynchronous errors,
// the User model, and a token generation utility function
import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken } from '../utils.js';

// Creating an instance of the Express Router
const userRouter = express.Router();

// Route for user sign-in
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    // Finding a user by email in the database
    const user = await User.findOne({ email: req.body.email });
    console.log(user);


    // Checking if the user exists
    if (user) {
      // Comparing the provided password with the stored hashed password
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // If passwords match, send user details along with a token as a response
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }

    // If email or password is invalid, send a 401 (Unauthorized) status
    // along with an error message
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

// Route for user signup
userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    // Create a new user with hashed password and save to the database
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    // Generate and send a token for the newly registered user
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

// Exporting the userRouter
export default userRouter;
