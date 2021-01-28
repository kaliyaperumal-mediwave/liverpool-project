
//   }
// };
// remove unused var
const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Dashboard Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkAuth, self.landing);
    };
    self.landing = function (req, callback) {
      return self.sendPage(req, self.renderer('dashboard', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };
    // need a change loginId/:userRole
    self.route('get', 'getIncompleteReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getIncompleteReferral';
      console.log(url)
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
    // need a change loginId/:userRole

    self.route('get', 'searchReferalByCode/:reqCode', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/searchReferalByCode?reqCode=' + req.params.reqCode
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        if(error.statusCode==401)
        {//unauthorized access
          console.log(error.statusCode)
          req.session.destroy();
        }
         return res.status(error.statusCode).send(error.error);
       });
    });
    self.route('get', 'getUserIncompleteReferral/:referralType', function (req, res) {
      console.log("----------------------------------------------------- " + req.params.referralType);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getUserReferral?referralType=' + req.params.referralType;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
       if(error.statusCode==401)
       {//unauthorized access
         console.log(error.statusCode)
         req.session.destroy();
       }
        return res.status(error.statusCode).send(error.error);
      });
    });


    self.route('get', 'continueIncompleteReferral/:uuid/:role/:refProgress', function (req, res) {
      //setting user role and uuid in session to navigate referral pages
      req.session.user_role = req.params.role;
      req.session.uuid = req.params.uuid;
      return res.send(req.params.refProgress);
    });
  }
}