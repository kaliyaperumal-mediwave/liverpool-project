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
      self.dispatch('/about',self.middleware.setValues, self.aboutUs);
      self.dispatch('/terms',self.middleware.setValues, self.termsCondition);
      self.dispatch('/privacy',self.middleware.setValues, self.privacyPolicy);
      self.dispatch('/urgent-help',self.middleware.setValues, self.urgentHelp);
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
  }
}