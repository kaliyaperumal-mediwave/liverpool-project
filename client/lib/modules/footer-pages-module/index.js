module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Footer Pages Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/about', self.aboutUs);
      self.dispatch('/terms', self.termsCondition);
    };

    self.aboutUs = function (req, callback) {
      return self.sendPage(req, self.renderer('about', {
        showHeader: true
      }));
    };

    self.termsCondition = function (req, callback) {
      return self.sendPage(req, self.renderer('terms', {
        showHeader: true
      }));
    };
  }
}