
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Liverpool Orcha Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.orcha);
    };
    self.orcha = function (req, callback) {
      return self.sendPage(req, self.renderer('orcha', {
        showHeader: true,
        hideRefButton: true,
      }));
    };
  }
}