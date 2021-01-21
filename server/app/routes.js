
const Router = require('koa-router');
const referralControler = require('./controllers/referralControler');
const authController = require('./controllers/authController');
const validateToken = require('./utils/utils').validateToken;
const commonAuth = require('./utils/utils').commonAuth;
const router = new Router();




//referral

router.post('/user/eligibility', commonAuth, referralControler.eligibility);
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

router.get('/referral/getIncompleteReferral', validateToken, referralControler.getIncompleteReferral);
router.get('/referral/getUserReferral/', validateToken, referralControler.getUserReferral);

router.post('/user/changePassword', validateToken, authController.changePassword);
router.post('/user/changeEmail', validateToken, authController.changeEmail);
router.post('/user/forgotPassword', authController.forgotPassword);
router.post('/user/resetPassword', authController.resetPassword);
router.post('/user/resetEmail', authController.resetEmail);

module.exports = router;
