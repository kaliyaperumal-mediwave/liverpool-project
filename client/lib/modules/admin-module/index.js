module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Admin Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.admin);
    };
    self.admin = function (req, callback) {
      return self.sendPage(req, self.renderer('admin', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };
  }
}