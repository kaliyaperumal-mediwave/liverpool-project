const { btoa } = require('../../utils')
const { atob } = require('../../utils')
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Feedback Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.checkCommonPageAuth, self.feedback);
    };
    self.feedback = function (req, callback) {
      return self.sendPage(req, self.renderer('feedback', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };
  }
}