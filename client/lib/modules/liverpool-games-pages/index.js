var _ = require('lodash');
const moment = require('moment');

module.exports = {
  name: 'liverpool-games-pages',
  extend: 'apostrophe-pieces-pages',
  label: 'gamesPage',
  piecesFilters: [
    { name: 'tags' }
  ],


  construct: function (self, options) {
    var superBefore = self.beforeShow;
    self.beforeShow = function (req, callback) {
      require('../../middleware')(self, options);

      self.checkCommonPageAuth(req).then((req) => {
        return superBefore(req, callback);
      }).catch(() => {
      });
    };
    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function (req, callback) {
      require('../../middleware')(self, options);
      req.data.piecesArray = _.map(req.data.pieces, (item) => {
        item.custom_url = "/games?piece_id=" + item._id
        return item;
      })

      if (req.query && req.query.piece_id) {
        for (let index = 0; index < req.data.pieces.length; index++) {
          if(req.data.pieces[index].createdAt) {
            req.data.pieces[index].uploadTime = moment(req.data.pieces[index].createdAt).fromNow();
          } else {
            req.data.pieces[index].uploadTime = '';
          }
        }
      }

      self.checkCommonPageAuth(req).then((req) => {
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
