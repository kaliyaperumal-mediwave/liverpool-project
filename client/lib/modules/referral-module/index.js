const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.referral);
    };
    self.referral = function (req, callback) {
      if (!req.session.user_role) {
        return req.res.redirect("/")
      }
      let labels;
      let decryptedUrl;
      const getParams = req.url.substring(req.url.indexOf("?") + 1);
      const deCodeParameter = atob(getParams)
      const decodeValues = deCodeParameter.split("&");
      const getParamsRedirect = "backbutton";
      decryptedUrl = btoa(getParamsRedirect);

      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return self.sendPage(req, self.renderer('referral', {
        headerContent: "Section 4 of 5: Reason for referral",
        headerDescription: "The most important part - why are you making a referral today?",
        backContent: '/education?' + decryptedUrl,
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };
    require('../../middleware')(self, options);
    self.route('post', 'saveReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/referral';
      //console.log("-------");
      //console.log(url);
      //console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('post', 'fetchReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchReferral';
      //console.log("-------");
      //console.log(url);
      //console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}