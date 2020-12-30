// module.exports = {
//   extend: 'apostrophe-module',
//   label: 'Dashboard Module',
//   construct: function (self, options, callback) {

//   }
// };
const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Dashboard Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.landing);
    };
    self.landing = function (req, callback) {
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = "loginFlag&"+atob(getParams);
      let decodeValues = deCodeParameter.split("&");
      //console.log("getParams: "+"/role?l"+deCodeParameter)
      return self.sendPage(req, self.renderer('dashboard', {
        showHeader: true,
        navigateMkeRfrl:"/role?"+btoa(deCodeParameter),
        home: true
      }));
    };
    require('../../middleware')(self, options);
    self.route('get', 'getIncompleteReferral/:loginId/:userRole', function (req, res) {
      console.log(req.params.loginId); 
     // console.log(req.params.userRole); 
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getIncompleteReferral?loginId=' +  req.params.loginId +"&userRole=" +req.params.userRole;
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });


    self.route('get', 'fetchEligibility/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility?user_id=' + req.params.userid;
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}