module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Completed Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.completed);
    };
    self.completed = function (req, callback) {
      return self.sendPage(req, self.renderer('completed', {}));
    };
  }
}