module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Auth Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.auth);
    };
    self.auth = function (req, callback) {
      return self.sendPage(req, self.renderer('home', {}));
    };
  }
}