const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Footer Pages Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/about', self.middleware.checkCommonPageAuth, self.aboutUs);
      self.dispatch('/terms', self.middleware.checkCommonPageAuth, self.termsCondition);
      self.dispatch('/privacy', self.middleware.checkCommonPageAuth, self.privacyPolicy);
      self.dispatch('/urgent-help', self.middleware.checkCommonPageAuth, self.urgentHelp);
      self.dispatch('/wellbeing', self.middleware.checkCommonPageAuth, self.wellBeing);
      self.dispatch('/contact', self.middleware.checkCommonPageAuth, self.contact);

    };

    self.aboutUs = function (req, callback) {
      return self.sendPage(req, self.renderer('about', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

    self.termsCondition = function (req, callback) {
      return self.sendPage(req, self.renderer('terms', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

    self.privacyPolicy = function (req, callback) {
      return self.sendPage(req, self.renderer('privacy', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

    self.urgentHelp = function (req, callback) {
      return self.sendPage(req, self.renderer('urgent', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

    self.wellBeing = function (req, callback) {
      return self.sendPage(req, self.renderer('wellbeing', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

    self.contact = function (req, callback) {
      return self.sendPage(req, self.renderer('contact', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

    self.route('get', 'searchReferalByCode/:reqCode', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/searchReferalByCode?reqCode=' + req.params.reqCode
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}