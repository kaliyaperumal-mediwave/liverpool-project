var _ = require('lodash');
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
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.checkCommonPageAuth, self.aboutMentalHealth);

    };

    self.aboutMentalHealth = async function (req, callback) {
      var AboutService = await self.apos.modules['liverpool-about-service-pages'].pieces.find(req, {}).toArray();
      var PeopleService = await self.apos.modules['liverpool-mental-health-pages'].pieces.find(req, {}).toArray();
      piecesArray = AboutService.concat(PeopleService)
      req.data.piecesArray = piecesArray;
      return self.sendPage(req, self.renderer('mentalHealth', {
        showHeader: true,
        hideRefButton: true,
      }));
    };

  }
}
