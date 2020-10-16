module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Auth Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.role);
    };
    self.role = function (req, callback) {
      return self.sendPage(req, self.renderer('role', {}));
    };
  }
}