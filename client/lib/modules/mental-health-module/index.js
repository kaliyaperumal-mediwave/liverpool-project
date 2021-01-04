module.exports = {
  extend: 'apostrophe-module',
  label: 'Mental Health Module',
  construct: function (self, options, callback) {

  }
};

module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Mental Health Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.aboutMentalHealth);
      // self.dispatch('/people', self.aboutPeople);
      // self.dispatch('/service', self.aboutService);

    };

    self.aboutMentalHealth = function (req, callback) {
      return self.sendPage(req, self.renderer('mentalHealth', {
        showHeader: true,
        hideRefButton: true

      }));
    };

    // self.termsCondition = function (req, callback) {
    //   return self.sendPage(req, self.renderer('terms', {
    //     showHeader: true
    //   }));
    // };
  }
}