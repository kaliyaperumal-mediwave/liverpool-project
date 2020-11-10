
const Router = require('koa-router');
const userController = require('./controllers/user');
const router = new Router();




//User

router.post('/user/eligibility', userController.eligibility);
router.post('/user/fetchEligibility', userController.fetchEligibility);

router.post('/user/about', userController.about);
router.post('/user/fetchAbout', userController.fetchAbout);

router.post('/user/education', userController.profession);
router.post('/user/fetchProfession', userController.fetchProfession);

router.post('/user/referral', userController.fetchReferral);




module.exports = router;
