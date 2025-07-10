import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d',
        }
    );
};

// Middleware function to verify the authenticity of a token in the request header
export const isAuth = (req, res, next) => {
  // Extract the token from the 'Authorization' header
  const authorization = req.headers.authorization;
  if (authorization) {
    // Remove 'Bearer ' prefix from the token string
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        // If verification fails, send a 401 Unauthorized response
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        // If verification is successful, attach the decoded user information to the request
        req.user = decode;
        next(); // Move to the next middleware or route handler
      }
    });
  } else {
    // If no token is provided in the header, send a 401 Unauthorized response
    res.status(401).send({ message: 'No Token' });
  }
};
