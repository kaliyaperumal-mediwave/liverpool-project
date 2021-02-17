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
      req.data.piecesArray = _.map(req.session.gamesArray, (item) => {
        item.custom_url = "/games?piece_id=" + item._id
        return item;
      })

      const pieces = [];
      for (let index = 0; index < req.session.gamesArray.length; index++) {
        if(req.session.gamesArray[index].createdAt) {
          req.session.gamesArray[index].uploadTime = moment(req.session.gamesArray[index].createdAt).fromNow();
        } else {
          req.session.gamesArray[index].uploadTime = '';
        }
        if (req.query && req.query.piece_id) {
          if (req.session.gamesArray[index]._id == req.query.piece_id) {
            pieces.splice(0, 0, req.session.gamesArray[index]);
          } else {
            pieces.push(req.session.gamesArray[index]);
          }
        }
      }
      req.data.pieces = pieces;
      self.checkCommonPageAuth(req).then((req) => {
        return beforeIndex(req, callback);
      }).catch(() => {
      });
    };
  }
};
