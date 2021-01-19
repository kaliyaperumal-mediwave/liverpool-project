
const Router = require('koa-router');
const referralControler = require('./controllers/referralControler');
const authController = require('./controllers/authController');
const emailController = require('./controllers/emailController');
const validateToken = require('./utils/utils').validateToken;
const router = new Router();




//referral

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
router.get('/user/getRefNo', referralControler.getRefNo);

router.post('/user/signup/', authController.signup);
router.post('/user/login/', authController.login);

router.get('/referral/getIncompleteReferral', referralControler.getIncompleteReferral);
router.get('/referral/getUserReferral/', referralControler.getUserReferral);

router.post('/referral/sendConfirmationMail/', emailController.sendReferralConfirmation);


module.exports = router;
