module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.referral);
    };
    self.referral = function (req, callback) {
      return self.sendPage(req, self.renderer('referral', {}));
    };
  }
}