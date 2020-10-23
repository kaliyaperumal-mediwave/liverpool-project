module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'About Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.about);
    };
    self.about = function (req, callback) {
      return self.sendPage(req, self.renderer('about', {}));
    };
  }
}