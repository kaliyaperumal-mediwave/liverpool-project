module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Check Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.checkReferral);
    };

    self.checkReferral = function (req, callback) {
      return self.sendPage(req, self.renderer('check-referral', {
        showHeader: true,
        home: true
      }));
    };

  }
}