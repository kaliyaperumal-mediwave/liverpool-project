var _ = require('lodash');

module.exports = {
  name: 'Resources-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'ResourcesPage',
  piecesFilters: [
    {
      name: 'tags',
      counts: true
    }
  ],
  moogBundle: {
    modules: ['liverpool-read-pages', 'liverpool-games-pages'],
    directory: 'lib/modules'
  },

  construct: function (self, options) {

    var superBefore = self.beforeShow;
    self.beforeShow = function (req, callback) {
      require('../../middleware')(self, options);

      self.checkCommonPageAuth(req).then(async (req) => {
        let piecesArray = [];
        var ThingsToWatch = req.data.piece._watchPage;
        var ThingsToRead = req.data.piece._readPage;
        var Games = req.data.piece._gamesPage;
        var Events = req.data.piece._eventPage;
        var PartnerAgencies = req.data.piece._partnerAgenciesPage;
        piecesArray = ThingsToWatch.concat(ThingsToRead, Games, Events, PartnerAgencies)
        req.data.piecesArray = piecesArray;
        return superBefore(req, callback);
      }).catch(() => {
      });
    };

    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function (req, callback) {
      require('../../middleware')(self, options);

      self.checkCommonPageAuth(req).then(async (req) => {
        let piecesArray = [];
        var ThingsToWatch = req.data.piece._watchPage;
        var ThingsToRead = req.data.piece._readPage;
        var Games = req.data.piece._gamesPage;
        var Events = req.data.piece._eventPage;
        var PartnerAgencies = req.data.piece._partnerAgenciesPage;
        piecesArray = ThingsToWatch.concat(ThingsToRead, Games, Events, PartnerAgencies)
        req.data.piecesArray = piecesArray;
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
