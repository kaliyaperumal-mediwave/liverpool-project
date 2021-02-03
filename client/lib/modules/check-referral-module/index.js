module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Check Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.checkReferral);
    };

    self.checkReferral = function (req, callback) {
      return self.sendPage(req, self.renderer('check-referral', {
        showHeader: true,
        home: true,
        loginFlag:req.data.showLogout
      }));
    };
    require('../../middleware')(self, options);
    self.route('get', 'getUserReferral/:referralType', function (req, res) {
      console.log("----------------------------------------------------- " + req.params.referralType);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getUserReferral?referralType=' + req.params.referralType;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'getReferalByCode/:seachTxt', function (req, res) {
      console.log("----------------------------------------------------- " + req.params.seachTxt);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getReferalByCode?reqCode=' + req.params.seachTxt;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'searchReferalByCode/:reqCode', function (req, res) {
      console.log("----------------------------------------------------- " + req.params.reqCode);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/searchReferalByCode?reqCode=' + req.params.reqCode
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'continueIncompleteReferral/:uuid/:role/:refProgress', function (req, res) {
      //setting user role and uuid in session to navigate referral pages
      req.session.user_role = req.params.role;
      req.session.uuid = req.params.uuid;
      req.session.frm_ref_home = "Y";
      return res.send(req.params.refProgress);
    });
  }
}