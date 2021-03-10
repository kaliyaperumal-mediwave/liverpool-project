module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Orcha Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.orcha);
    };
    require('../../middleware')(self, options);

    self.orcha = function (req, callback) {
      return self.sendPage(req, self.renderer('orcha', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };
  }
}