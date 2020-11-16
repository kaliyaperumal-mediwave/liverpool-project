module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Review Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.review);
    };
    self.review = function (req, callback) {
      return self.sendPage(req, self.renderer('review', {
        content: "hello",
        subContent: ""
      }));
    };
  }
}