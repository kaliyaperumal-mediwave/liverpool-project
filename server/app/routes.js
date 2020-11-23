
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

router.post('/user/referral', userController.saveReferal);
router.post('/user/fetchReferral', userController.fetchReferral);

router.get('/user/fetchReview/', userController.fetchReview);
router.post('/user/saveReview', userController.saveReview);




module.exports = router;
