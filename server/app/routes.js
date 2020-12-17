
const Router = require('koa-router');
const referralControler = require('./controllers/referralControler');
const authController = require('./controllers/authController');
const router = new Router();




//User

router.post('/user/eligibility', referralControler.eligibility);
router.get('/user/fetchEligibility', referralControler.fetchEligibility);
router.put('/user/updateEligibilityInfo', referralControler.updateEligibilityInfo);


router.post('/user/about', referralControler.about);
router.post('/user/fetchAbout', referralControler.fetchAbout);
router.put('/user/updateAboutInfo', referralControler.updateAboutInfo);

router.post('/user/education', referralControler.profession);
router.post('/user/fetchProfession', referralControler.fetchProfession);
router.put('/user/updateSec3Info', referralControler.updateSec3Info);

router.post('/user/referral', referralControler.saveReferal);
router.post('/user/fetchReferral', referralControler.fetchReferral);
router.put('/user/updateSec4Info', referralControler.updateSec4Info);

router.get('/user/fetchReview/', referralControler.fetchReview);
router.post('/user/saveReview', referralControler.saveReview);

router.post('/user/signup/', authController.signup);



module.exports = router;
