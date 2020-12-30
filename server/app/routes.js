
const Router = require('koa-router');
const userController = require('./controllers/user');
const router = new Router();




//User

router.post('/user/eligibility', userController.eligibility);
router.get('/user/fetchEligibility', userController.fetchEligibility);
router.put('/user/updateEligibilityInfo', userController.updateEligibilityInfo);


router.post('/user/about', userController.about);
router.post('/user/fetchAbout', userController.fetchAbout);
router.put('/user/updateAboutInfo', userController.updateAboutInfo);

router.post('/user/education', userController.profession);
router.post('/user/fetchProfession', userController.fetchProfession);
router.put('/user/updateSec3Info', userController.updateSec3Info);

router.post('/user/referral', userController.saveReferal);
router.post('/user/fetchReferral', userController.fetchReferral);
router.put('/user/updateSec4Info', userController.updateSec4Info);

router.get('/user/fetchReview/', userController.fetchReview);
router.post('/user/saveReview', userController.saveReview);

router.get('/user/getRefNo/', userController.getRefNo);



module.exports = router;
