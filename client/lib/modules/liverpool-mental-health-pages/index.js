var _ = require('lodash');

module.exports = {
  name: 'liverpool-mental-health-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'Mental-Health-Page',
  piecesFilters: [
    {
      name: 'tags',
      counts: true
    }
  ],
  construct: function (self, options) {

    var superBefore = self.beforeShow;
    self.beforeShow = function (req, callback) {
      require('../../middleware')(self, options);
      self.checkCommonPageAuth(req).then(async (req) => {
        req.data.piecesArray = await self.apos.modules['liverpool-mental-health-pages'].pieces.find(req, {}).toArray();;
        return superBefore(req, callback);
      }).catch(() => {
      });
    };

    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function (req, callback) {
      require('../../middleware')(self, options);

      self.checkCommonPageAuth(req).then(async (req) => {
        req.data.piecesArray = req.data.pieces;
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
