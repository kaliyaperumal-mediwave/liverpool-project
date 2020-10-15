
const Router = require('koa-router');
const userController = require('./controllers/user');
const router = new Router();




//User
router.post('/signup', userController.signUpUser);




module.exports = router;
