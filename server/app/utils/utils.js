const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  validateToken: (ctx, next) => {
    const authorizationHeaader = ctx.request.headers.authorization;
    let result;
    // testing if login users or not. if logged user decrypt and append user obj in auth token
    if (authorizationHeaader) {
      const token = ctx.request.headers.authorization.split(' ')[1]; // Bearer <token>
      const user = ctx.orm().User;

      try {
        // verify makes sure that the token hasn't expired and has been issued by us
        result = jwt.verify(token, process.env.JWT_SECRET);
        // Let's pass back the decoded token to the request object
        ctx.request.decryptedUser = result;
        // console.log("checkatuh")
        // console.log(ctx.request.decryptedUser)
        return user.findOne({
          where: {
              email: result.email,
          },
          attributes: ['email', 'session_token','session_token_expiry', 'service_type', 'user_role']
        }).then(async (userResult) => {
            if(userResult.session_token!=null && userResult.session_token==token){
              if(userResult.user_role === 'service_admin'){
                let resultWithServiceType = {...result};
                resultWithServiceType.service_type = userResult.service_type;
                ctx.request.decryptedUser = resultWithServiceType;
              }
              return next();
            }
            else
            {
              return ctx.res.unauthorizedError({
                message: 'Session Expired',
              });
            }
        })
        // We call next to pass execution to the subsequent middleware
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification
        return ctx.res.unauthorizedError({
          message: 'Token decryption failed',
        });
      }
    } else {
      //if not logged user let them continue
      return next();
    }
  },
};