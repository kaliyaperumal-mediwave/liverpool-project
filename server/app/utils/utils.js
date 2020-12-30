const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  validateToken: (ctx, next) => {
    const authorizationHeaader = ctx.request.headers.authorization;
    let result;
    if (authorizationHeaader) {
      const token = ctx.request.headers.authorization.split(' ')[1]; // Bearer <token>
      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        result = jwt.verify(token, process.env.JWT_SECRET);
        // Let's pass back the decoded token to the request object
        ctx.request.decryptedUser = result;
        // We call next to pass execution to the subsequent middleware
        return next();
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification
        return ctx.res.unauthorizedError({
          message: 'Token decryption failed',
        });
      }
    } else {
      return ctx.res.unauthorizedError({
        message: 'Invalid token',
      });
    }
  }
};