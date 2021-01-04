module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Resources Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.resources);
    };

    self.resources = function (req, callback) {
      return self.sendPage(req, self.renderer('resources', {
        showHeader: true,
        home: true
      }));
    };

  }
}