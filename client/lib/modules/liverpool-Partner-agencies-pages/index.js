var _ = require('lodash');

module.exports = {
  name: 'liverpool-Partner-agencies-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'partnerAgenciesPage',
  piecesFilters: [
    { name: 'tags' }
  ],


  construct: function(self, options) {
    var superBefore = self.beforeShow;
    self.beforeShow = function(req, callback) {
      require('../../middleware')(self, options);

      self.checkCommonPageAuth(req).then((req) => {
        return superBefore(req, callback);
      }).catch(() => {
      });
    };
    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function(req, callback) {
      require('../../middleware')(self, options);
      if(req.query && req.query.piece_id) {
        const pieces = [];
        for(let index = 0; index < req.data.pieces.length; index++) {
          if(req.data.pieces[index]._id == req.query.piece_id) {
            pieces.splice(0, 0, req.data.pieces[index]);
          } else {
            pieces.push(req.data.pieces[index]);
          }
        }
        req.data.pieces = pieces;
      }
      self.checkCommonPageAuth(req).then((req) => {
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
