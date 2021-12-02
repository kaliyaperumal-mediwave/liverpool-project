
const Router = require('koa-router');
const referralControler = require('./controllers/referralControler');
const authController = require('./controllers/authController');
// const emailController = require('./controllers/emailController');
const adminController = require('./controllers/adminController');
const orchaController = require('./controllers/orchaController');
const userController = require('./controllers/userController');
const youngControler = require('./controllers/youngController');
const validateToken = require('./utils/utils').validateToken;
//const commonAuth = require('./utils/utils').commonAuth;
const auth = require('./middlewares/auth');
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
router.post('/user/logOut/', validateToken, authController.logOut);
router.post('/user/referralSignup/', validateToken, authController.referralSignup);
router.get('/user/token', authController.verifyToken);

router.get('/referral/getIncompleteReferral', validateToken, referralControler.getIncompleteReferral);
router.get('/referral/getUserReferral/', validateToken, referralControler.getUserReferral);
router.get('/referral/getReferalByCode/', validateToken, referralControler.getReferalByCode);
router.get('/referral/searchReferalByCode/', validateToken, referralControler.searchReferalByCode);
router.get('/referral/profReferral', validateToken, referralControler.getProfReferral);
router.post('/referral/sendReferralToMe/', validateToken, referralControler.sendReferralToMe);
router.get('/resources/getReferralReason/', validateToken, referralControler.getReferralReasonUser);
router.get('/resources/getSavedRes/', validateToken, referralControler.getSavedRes);


router.post('/user/changePassword', validateToken, authController.changePassword);
router.post('/user/changeEmail', validateToken, authController.changeEmail);
router.post('/user/forgotPassword', authController.forgotPassword);
router.post('/user/resetPassword', authController.resetPassword);
router.post('/user/resetEmail', authController.resetEmail);
router.get('/user/resetPassword/verifyToken', authController.verifyPasswordToken);
router.post('/user/feedback', validateToken, authController.sendFeedback);
router.post('/user/refFeedback', validateToken, authController.sendReferralFeedback);

router.post('/addUser', validateToken, userController.addAdminUsers);

router.get('/admin/referral', validateToken, adminController.getReferral);
router.put('/admin/referral', validateToken, adminController.updateReferral);
router.put('/admin/referralStatusUpdate', validateToken, adminController.referralStatusUpdate);
router.get('/admin/getAllreferral', validateToken, adminController.getAllReferral);
router.get('/admin/downloadReferral', validateToken, adminController.downloadReferral);
router.get('/admin/sendReferral', validateToken, adminController.sendReferral);
router.get('/admin/sendReferralByApi', validateToken, adminController.sendReferralByApi);
router.get('/admin/getArchived', validateToken, adminController.getArchived);
router.get('/getActivity', validateToken, adminController.getActivity);

//orcha
router.post('/orcha/getAllApps', auth.checkOrchaToken, orchaController.getAllApps);
router.get('/orcha/getApp/', auth.checkOrchaToken, orchaController.getApp);
router.get('/orcha/getFilterData/', auth.checkOrchaToken, orchaController.getFilterDropDwnData);
router.post('/orcha/getSearchData/', auth.checkOrchaToken, orchaController.getSearchData);


//Utils
router.get('/admin/downloadJson', validateToken, adminController.toJson);
router.put('/admin/updateApiValue', validateToken, adminController.updateApiValue);
router.get('/admin/getApiService', validateToken, adminController.getApiService);


//google analytics

router.get('/admin/getCount', adminController.getCount);




// Appointments
router.post('/appointment/create', adminController.createAppointmentDetails);
router.get('/appointment/get', adminController.getAppointmentDetails);
router.post('/appointment/sendMail', adminController.appointmentNeeded);

//Apis for form 2 
//Sec 1
router.post('/user/youngEligibility', validateToken, youngControler.eligibility);
router.get('/user/youngFetchEligibility', validateToken, youngControler.fetchEligibility);

//Sec 2
router.post('/user/saveYoungAbout', validateToken, youngControler.about);
router.post('/user/fetchYoungAbout', validateToken, youngControler.fetchAbout);

//sec 3
router.post('/user/saveYoungeducation', validateToken, youngControler.profession);
router.post('/user/fetchYoungProfession', validateToken, youngControler.fetchProfession);
// router.put('/user/updateSec3Info', validateToken, referralControler.updateSec3Info);

//sec 4
router.post('/user/saveYoungReferral', validateToken, youngControler.saveReferal);
router.post('/user/fetchYoungReferral', validateToken, youngControler.fetchReferral);
// router.put('/user/updateSec4Info', validateToken, youngControler.updateSec4Info);

//sec 5
router.get('/user/fetchYoungReview/', validateToken, youngControler.fetchReview);
router.post('/user/saveYoungReview', validateToken, youngControler.saveReview);
router.get('/user/getRefNo', validateToken, youngControler.getRefNo);

module.exports = router;
