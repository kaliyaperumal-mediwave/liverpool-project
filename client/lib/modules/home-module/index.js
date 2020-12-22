module.exports = {
  extend: 'apostrophe-module',
  label: 'Home Module',
  construct: function (self, options, callback) {

  }
};

module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.home);
    };
    self.home = function (req, callback) {
      return self.sendPage(req, self.renderer('home', {
        showHeader: false
      }));
    };
  }
}