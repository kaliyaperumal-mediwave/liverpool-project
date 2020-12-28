module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Feedback Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.feedback);
    };
    self.feedback = function (req, callback) {
      return self.sendPage(req, self.renderer('feedback', {
        showHeader: true,
        home: true
      }));
    };
  }
}