var _ = require('lodash');

module.exports = {
  name: 'liverpool-about-service-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'About-Service-page',
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
        req.data.piecesArray = req.data.pieces;
        return superBefore(req, callback);
      }).catch(() => {
      });
    };

    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function (req, callback) {
      require('../../middleware')(self, options);
      self.checkCommonPageAuth(req).then(async (req) => {
        req.data.piecesArray = _.map(req.data.pieces, (item) => {
          item.custom_url = "/mental-health/people?piece_id=" + item._id
          return item;
        })
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
