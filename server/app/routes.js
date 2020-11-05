
const Router = require('koa-router');
const userController = require('./controllers/user');
const router = new Router();




//User
router.post('/signup', userController.signUpUser);

router.post('/user/eligibility', userController.eligibility);
router.post('/user/fetchEligibility', userController.fetchEligibility);

router.post('/user/about', userController.about);
router.post('/user/education', userController.profession);




module.exports = router;
