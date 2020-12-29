const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  validateToken: (ctx, next) => {
    
    const authorizationHeaader = ctx.request.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = ctx.request.headers.authorization.split(' ')[1]; // Bearer <token>
      const options = {
        expiresIn: '2d',
        issuer: 'https://scotch.io'
      };
      try {
        console.log("err");
        // verify makes sure that the token hasn't expired and has been issued by us
        result = jwt.verify(token, process.env.JWT_SECRET, options);

        // Let's pass back the decoded token to the request object
        ctx.request.decryptedUser = result;
        // We call next to pass execution to the subsequent middleware
        return next();
      } catch (err) {
        console.log(err);
        // Throw an error just in case anything goes wrong with verification
        throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  }
};