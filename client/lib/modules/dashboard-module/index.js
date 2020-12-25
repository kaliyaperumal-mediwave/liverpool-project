// module.exports = {
//   extend: 'apostrophe-module',
//   label: 'Dashboard Module',
//   construct: function (self, options, callback) {

//   }
// };

module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Dashboard Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.landing);
    };
    self.landing = function (req, callback) {
      return self.sendPage(req, self.renderer('dashboard', {
        showHeader: true,
        home: true
      }));
    };
  }
}