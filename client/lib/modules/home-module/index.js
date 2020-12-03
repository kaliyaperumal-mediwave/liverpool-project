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
        headerContent: "Make a referral to Children’s and Young Person’s Liverpool & Sefton Mental Health Services",
        headerDescription: '',
        backContent: '',
        home: true
      }));
    };
  }
}