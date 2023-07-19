const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.query, headers, or context
    let token = req.body.token || req.headers.authorization || req.headers['x-access-token'] || req.context.token;

    if (!token) {
      return null;
    }

    // check for token format "Bearer <tokenvalue>"
    if (token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    try {
      // verify token and get user data out of it
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      return { user: data };
    } catch {
      // If the token is invalid, throw an error
      throw new Error('Invalid token');
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};


// The authMiddleware function now takes an object as its parameter, destructuring it to access the req object directly from the context.
// We check for the token in multiple locations, including req.body.token, req.headers.authorization, req.headers['x-access-token'], and req.context.token. 
// This ensures compatibility with various ways of passing the token in the GraphQL context.
//Instead of returning a response with status and message, we now return null if no token is found. 
//This will signify that the user is not authenticated in the GraphQL context.
// If the token is present, we verify it using JWT, and if it's valid, we return an object with the authenticated user data, 
// which will be stored in the context and can be accessed by resolvers during the execution of GraphQL queries/mutations.