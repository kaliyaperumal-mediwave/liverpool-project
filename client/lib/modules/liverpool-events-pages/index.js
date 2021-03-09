var _ = require("lodash");
const moment = require("moment");

module.exports = {
  name: "liverpool-events-pages",
  extend: "apostrophe-pieces-pages",
  label: "eventPage",
  piecesFilters: [{ name: "tags" }],

  construct: function (self, options) {
    var superBefore = self.beforeShow;
    self.beforeShow = function (req, callback) {
      delete ($el, value);
      console.log("--------", +$el);

      require("../../middleware")(self, options);

      self
        .checkCommonPageAuth(req)
        .then((req) => {
          return superBefore(req, callback);
        })
        .catch(() => {});
    };
    var beforeIndex = self.beforeIndex;
    self.beforeIndex = async function (req, callback) {
      require("../../middleware")(self, options);
      req.data.piecesArray = _.map(req.session.eventsArray, (item) => {
        item.custom_url = "/events?piece_id=" + item._id;
        return item;
      });
      console.log(req.session.eventsArrayArray);

      const pieces = [];
      const today = moment().format("YYYY-MM-DD hh:mm:ss");
      for (let index = 0; index < req.session.eventsArray.length; index++) {
        req.session.eventsArray[index].piece_date = moment(
          req.session.eventsArray[index].date
        ).format("dddd Do MMMM YYYY"); // Tuesday 23rd February 2021
        req.session.eventsArray[index].start_time = moment(
          req.session.eventsArray[index].starttime,
          "HH:mm"
        ).format("hh:mma");

        req.session.eventsArray[index].end_time = moment(
          req.session.eventsArray[index].endtime,
          "HH:mm"
        ).format("hh:mma");

        const start_date =
          req.session.eventsArray[index].date +
          " " +
          req.session.eventsArray[index].starttime;
        const diff = moment(start_date, "YYYY-MM-DD hh:mm:ss").diff(
          moment(today, "YYYY-MM-DD hh:mm:ss"),
          "days",
          true
        );
        if (diff >= 0 && diff < 1) {
          const end_date =
            req.session.eventsArray[index].date +
            " " +
            req.session.eventsArray[index].endtime;
          if (
            moment(moment(today, "YYYY-MM-DD hh:mm:ss")).isBetween(
              moment(start_date, "YYYY-MM-DD hh:mm:ss"),
              moment(end_date, "YYYY-MM-DD hh:mm:ss")
            )
          ) {
            req.session.eventsArray[index].uploadTime =
              "On going end by " + req.session.eventsArray[index].end_time;
          } else {
            req.session.eventsArray[index].uploadTime =
              "Today at " + req.session.eventsArray[index].start_time;
          }
        } else if (diff >= 1 && diff < 2) {
          req.session.eventsArray[index].uploadTime =
            "Tomorrow at " + req.session.eventsArray[index].start_time;
        } else if (diff >= 2) {
          req.session.eventsArray[index].uploadTime =
            moment(req.session.eventsArray[index].date, "YYYY-MM-DD").format(
              "DD/MM/YYYY"
            ) +
            " at " +
            req.session.eventsArray[index].start_time;
        }

        console.log("\n", req.session.eventsArray[index].title, "   ", diff);

        //   req.session.eventsArray[index].uploadTime = moment(
        //     req.session.eventsArray[index].createdAt
        //   ).fromNow();
        if (req.query && req.query.piece_id && diff >= 0) {
          if (req.session.eventsArray[index]._id == req.query.piece_id) {
            pieces.splice(0, 0, req.session.eventsArray[index]);
          } else {
            pieces.push(req.session.eventsArray[index]);
          }
        }
      }
      req.data.pieces = pieces;
      self
        .checkCommonPageAuth(req)
        .then((req) => {
          return beforeIndex(req, callback);
        })
        .catch(() => {});
    };
  },
};
