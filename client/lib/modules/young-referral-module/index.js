const config = require("../../gplist.json");
var _ = require("lodash");
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Young Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.young_referral_screen1);
    };
    require('../../middleware')(self, options);
    self.young_referral_screen1 = function (req, callback) {
      if (!req.session.frm_ref_home) {
        return req.res.redirect("/")
      }
      if (req.session.referralCode) {
        return req.res.redirect("/acknowledge")
      }
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return self.sendPage(req, self.renderer('young_referral_form', {
        headerContent: "Section 1 of 5: Eligibility",
        headerDescription: "Before we get too far, let’s check we can support you",
        backContent: '',
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };
    // save eligibitiy
    self.route('post', 'eligibility', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/eligibility';
      self.middleware.post(req, res, url, req.body).then((data) => {
        // setting the uuid and userrole to use in upcoming sections.
        if (!req.body.editFlag) {
          if (req.session.auth_token) {
            req.session.uuid = data.userid;
          }
          else {
            req.session.user_role = data.user_role;
            req.session.uuid = data.userid;
          }
        }
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'fetchEligibility/:userid', function (req, res) {
      //console.log("faf" + req.params.userid);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility?user_id=' + req.params.userid;
      //console.log("-------");
      ////console.log(req.params.userid);
      //console.log(url);
      //console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'getGpByName/:name', function (req, res) {
      var searchTxt = req.params.name;
      var searchRslt=[]
      var result = _.filter(config, function (gp) {
        if (!!~gp.Name.toLowerCase().indexOf(searchTxt.toLowerCase())) {
          searchRslt.push(gp);
      }
      });
      return res.send(searchRslt);
    });


    self.route('get', 'getGpByPostCode/:postcode', function (req, res) {
      var searchTxt = req.params.postcode;
      var searchRslt=[]
      var result = _.filter(config, function (gp) {
        if (!!~gp.Postcode.toLowerCase().indexOf(searchTxt.toLowerCase())) {
          searchRslt.push(gp);
      }
      });
      return res.send(searchRslt);
    });
  }
}
