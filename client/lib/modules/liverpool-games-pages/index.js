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
      req.data.piecesArray = req.data.pieces;

      if (req.query && req.query.piece_id) {
        const pieces = [];
        let todayDate = moment().format('DD-MM-YYYY HH:MM:SS');
        for (let index = 0; index < req.data.pieces.length; index++) {
          let videoTime = moment(req.data.pieces[index].createdAt).format('DD-MM-YYYY HH:MM:SS');
          let value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'days');
          let time = '';
          if (value < 1) {
            value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'hours');
            if (value <= 1) {
              value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'minutes');
              time = 'minute';
            } else {
              time = 'hour';
            }
          } else if (value < 30) {
            time = 'day';
          } else if (value < 365) {
            value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'months');
            time = 'month';
          } else {
            value = moment(todayDate, 'DD-MM-YYYY HH:MM:SS').diff(moment(videoTime, 'DD-MM-YYYY HH:MM:SS'), 'years');
            time = 'year';
          }
          req.data.pieces[index].uploadTime = setVideoValue(value, time);
          if (req.data.pieces[index]._id == req.query.piece_id) {
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

    function setVideoValue(value, time) {
      if (value == 1) {
        return `${value} ${time} ago`;
      } else {
        return `${value} ${time}s ago`;
      }
    }
  }
};
