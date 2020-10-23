module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Education Employment Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.education);
    };
    self.education = function (req, callback) {
      return self.sendPage(req, self.renderer('education', {}));
    };
  }
}