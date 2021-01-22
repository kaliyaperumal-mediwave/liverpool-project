var _ = require('lodash');

module.exports = {
  name: 'liverpool-read-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'readPage',
  piecesFilters: [
    { name: 'tags'}
  ],

  construct: function(self, options) {
    // console.log("-------------read log",self.filters);

    var superBefore = self.beforeShow;
    self.beforeShow = function(req, callback) {
      require('../../middleware')(self, options);
      self.checkCommonPageAuth(req).then((req) => {
        console.log("-------------read log");
        return superBefore(req, callback);
      }).catch(() => {
      });
    };
    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function(req, callback) {
      require('../../middleware')(self, options);

      // console.log("--------2-----read log",self);
       // piece.title = piece.Title + ' ' + piece.Text;
      self.checkCommonPageAuth(req).then((req) => {
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
