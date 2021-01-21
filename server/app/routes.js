
const Router = require('koa-router');
const referralControler = require('./controllers/referralControler');
const authController = require('./controllers/authController');
const emailController = require('./controllers/emailController');
const validateToken = require('./utils/utils').validateToken;
//const commonAuth = require('./utils/utils').commonAuth;
const router = new Router();




//referral

router.post('/user/eligibility', validateToken, referralControler.eligibility);
router.get('/user/fetchEligibility', validateToken, referralControler.fetchEligibility);
router.put('/user/updateEligibilityInfo', validateToken, referralControler.updateEligibilityInfo);


router.post('/user/about', validateToken, referralControler.about);
router.post('/user/fetchAbout', validateToken, referralControler.fetchAbout);
router.put('/user/updateAboutInfo', validateToken, referralControler.updateAboutInfo);

router.post('/user/education', validateToken, referralControler.profession);
router.post('/user/fetchProfession', validateToken, referralControler.fetchProfession);
router.put('/user/updateSec3Info', validateToken, referralControler.updateSec3Info);

router.post('/user/referral', validateToken, referralControler.saveReferal);
router.post('/user/fetchReferral', validateToken, referralControler.fetchReferral);
router.put('/user/updateSec4Info', validateToken, referralControler.updateSec4Info);

router.get('/user/fetchReview/', validateToken, referralControler.fetchReview);
router.post('/user/saveReview', validateToken, referralControler.saveReview);
router.get('/user/getRefNo', validateToken, referralControler.getRefNo);

router.post('/user/signup/', validateToken, authController.signup);
router.post('/user/login/', validateToken, authController.login);

router.get('/referral/getIncompleteReferral', validateToken, referralControler.getIncompleteReferral);
router.get('/referral/getUserReferral/', validateToken, referralControler.getUserReferral);
router.get('/referral/getReferalByCode/', validateToken, referralControler.getReferalByCode);

router.post('/referral/sendConfirmationMail/', validateToken, emailController.sendReferralConfirmation);

router.post('/user/changePassword', validateToken, authController.changePassword);
router.post('/user/changeEmail', validateToken, authController.changeEmail);
router.post('/user/forgotPassword', authController.forgotPassword);
router.post('/user/resetPassword', authController.resetPassword);
router.post('/user/resetEmail', authController.resetEmail);

module.exports = router;
