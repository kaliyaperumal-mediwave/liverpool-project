var _ = require("lodash");
const moment = require("moment");

module.exports = {
  name: "Resources-pages",
  extend: "apostrophe-pieces-pages",
  label: "ResourcesPage",
  piecesFilters: [
    {
      name: "tags",
      counts: true,
    },
  ],
  moogBundle: {
    modules: ["liverpool-read-pages", "liverpool-games-pages"],
    directory: "lib/modules",
  },

  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      // console.log("orcha load Dis");
      self.dispatch("/", self.middleware.checkCommonPageAuth, self.orcha);
    };

    var superBefore = self.beforeShow;
    self.beforeShow = function (req, callback) {
      require("../../middleware")(self, options);
      console.log("show==========tst");
      //console.log(req.data.piece._url);
      self
        .checkCommonPageAuth(req)
        .then(async (req, res) => {
          console.log(req.session.loginIdUrl);
          let piecesArray = [];
          if (req.data.piece) {
            const today = moment().format("YYYY-MM-DD hh:mm:ss");
            var ThingsToWatchArray =
              req.data.piece._watchPage && req.data.piece._watchPage.length > 0
                ? req.data.piece._watchPage
                : [];
            var ThingsToWatch = _.map(ThingsToWatchArray, (item) => {
              item.custom_url = "/watch?piece_id=" + item._id;
              return item;
            });

            var ThingsToReadArray =
              req.data.piece._readPage && req.data.piece._readPage.length > 0
                ? req.data.piece._readPage
                : [];
            var ThingsToRead = _.map(ThingsToReadArray, (item) => {
              item.custom_url = "/read?piece_id=" + item._id;
              return item;
            });
            var GamesArray =
              req.data.piece._gamesPage && req.data.piece._gamesPage.length > 0
                ? req.data.piece._gamesPage
                : [];
            var Games = _.map(GamesArray, (item) => {
              item.custom_url = "/games?piece_id=" + item._id;
              return item;
            });
            var EventsArray =
              req.data.piece._eventPage && req.data.piece._eventPage.length > 0
                ? req.data.piece._eventPage
                : [];
            var Events = [];
            _.map(EventsArray, (item) => {
              item.custom_url = "/events?piece_id=" + item._id;
              const start_date = item.date + " " + item.starttime;
              const diff = moment(start_date, "YYYY-MM-DD hh:mm:ss").diff(
                moment(today, "YYYY-MM-DD hh:mm:ss"),
                "days",
                true
              );
              if (diff >= 0 && diff < 1) {
                const end_date = item.date + " " + item.endtime;
                if (
                  moment(moment(today, "YYYY-MM-DD hh:mm:ss")).isBetween(
                    moment(start_date, "YYYY-MM-DD hh:mm:ss"),
                    moment(end_date, "YYYY-MM-DD hh:mm:ss")
                  )
                ) {
                  item.uploadTime =
                    "On going end by " +
                    moment(item.endtime, "HH:mm").format("hh:mma");
                } else {
                  item.uploadTime =
                    "Today at " +
                    moment(item.starttime, "HH:mm").format("hh:mma");
                }
              } else if (diff >= 1 && diff < 2) {
                item.uploadTime =
                  "Tomorrow at " +
                  moment(item.starttime, "HH:mm").format("hh:mma");
              } else if (diff >= 2) {
                item.uploadTime =
                  moment(item.date, "YYYY-MM-DD").format("DD/MM/YYYY") +
                  " at " +
                  moment(item.starttime, "HH:mm").format("hh:mma");
              }
              if (diff >= 0) {
                Events.push(item);
              }
              return item;
            });
            req.data.piece._eventPage = Events;
            var PartnerAgenciesArray =
              req.data.piece._partnerAgenciesPage &&
                req.data.piece._partnerAgenciesPage.length > 0
                ? req.data.piece._partnerAgenciesPage
                : [];
            var PartnerAgencies = _.map(PartnerAgenciesArray, (item) => {
              item.custom_url = "/partner?piece_id=" + item._id;
              return item;
            });
            // piecesArray = ThingsToWatch.concat(ThingsToRead, Games, Events, PartnerAgencies)
          }
          //console.log("-----------shoiw=--------------")
          // req.data.piecesArray = piecesArray;
          //return superBefore(req, callback);
          var url =
            self.apos.LIVERPOOLMODULE.getOption(req, "phr-module") +
            "/orcha/getAllApps";
          //console.log(url)
          req.body.searchCategory = req.data.piece.title;
          req.session.categoryTitle = req.data.piece.title;
          req.session.resUrl = req.data.piece._url;
          self.middleware
            .post(req, res, url, req.body)
            .then((data) => {
              var appsName = [];
              var appTitle = {};
              var listOfApps = data.data.result.items;
              //console.log(listOfApps);
              for (var i = 0; i < listOfApps.length; i++) {
                appTitle = {};
                appTitle.title = listOfApps[i].appName;
                appTitle.platform = listOfApps[i].platform;
                appTitle.Topic = "Downloads";
                appTitle.custom_url = "/downloads?app_id=" + listOfApps[i].id;
                appTitle.score = listOfApps[i].score;
                appsName.push(appTitle);
              }
              // console.log( data.data.result.items);
              piecesArray = ThingsToWatch.concat(
                ThingsToRead,
                Games,
                Events,
                PartnerAgencies,
                appsName
              );
              // console.log(piecesArray);
              req.data.piecesArray = piecesArray;
              req.data.orchaApps = data.data.result.items;
              req.session.orchaApps = data.data.result.items;
              req.session.readArray = ThingsToRead;
              req.session.watchArray = ThingsToWatch;
              req.session.gamesArray = Games;
              req.session.eventsArray = Events;
              req.session.partnerAgenciesArray = PartnerAgencies;
              return superBefore(req, callback);
            })
            .catch((error) => {
              console.log("---- error -------", error);
              return superBefore(req, callback);
              //return res.status(error.statusCode).send(error.error);
            });
        })
        .catch((error) => {
          console.log("---- error2 -------", error);
          return superBefore(req, callback);
        });
    };

    var beforeIndex = self.beforeIndex;
    self.beforeIndex = function (req, callback) {
      require("../../middleware")(self, options);
      console.log("index==========tst");

      self.checkCommonPageAuth(req).then(async (req, res) => {
        // console.log(req.session.auth_token)
        var Resources = await self.apos.modules["Resources-pages"].pieces.find(req, {}).toArray();
        //console.log('--------------resource data ---------',Resources);
        var ThingsToWatchArray = await self.apos.modules[
          "liverpool-watch-pages"
        ].pieces
          .find(req, {})
          .toArray();
        var ThingsToWatch = _.map(ThingsToWatchArray, (item) => {
          item.custom_url = "/watch?piece_id=" + item._id;
          return item;
        });
        var ThingsToReadArray = await self.apos.modules[
          "liverpool-read-pages"
        ].pieces
          .find(req, {})
          .toArray();
        var ThingsToRead = _.map(ThingsToReadArray, (item) => {
          item.custom_url = "/read?piece_id=" + item._id;
          return item;
        });
        var GamesArray = await self.apos.modules[
          "liverpool-games-pages"
        ].pieces
          .find(req, {})
          .toArray();
        var Games = _.map(GamesArray, (item) => {
          item.custom_url = "/games?piece_id=" + item._id;
          return item;
        });
        var EventsArray = await self.apos.modules[
          "liverpool-events-pages"
        ].pieces
          .find(req, {})
          .toArray();
        var Events = _.map(EventsArray, (item) => {
          item.custom_url = "/events?piece_id=" + item._id;
          return item;
        });

        var PartnerAgenciesArray = await self.apos.modules[
          "liverpool-Partner-agencies-pages"
        ].pieces
          .find(req, {})
          .toArray();
        var PartnerAgencies = _.map(PartnerAgenciesArray, (item) => {
          item.custom_url = "/partner?piece_id=" + item._id;
          return item;
        });
        if (req.session.auth_token) {
          var dt = await getUserRec(req, req.data.pieces);
          var aposAry = req.data.pieces
          var recomArray = req.data.recommended
          aposAry = aposAry.filter(val => !recomArray.includes(val));
          req.data.pieces=aposAry
        }

        piecesArray = Resources.concat(
          ThingsToWatch,
          ThingsToRead,
          Games,
          Events,
          PartnerAgencies,
        );
        req.data.piecesArray = piecesArray;
        return beforeIndex(req, callback);
      })
        .catch((error) => {
          console.log('error---------------------', error);
        });
    };

    const getUserRec = async (req, cmsResources) => {
      var dbUserReason;
      try {
        const url = self.apos.LIVERPOOLMODULE.getOption(req, "phr-module") + "/resources/getReferralReason";
        dbUserReason = await self.middleware.get(req, url);
        var personalArray = [];
        var recommended = _.map(cmsResources, (item) => {
          _.map(item.tags, (tagObj) => {
            _.map(dbUserReason.data.reasonArray, (dbAr) => {
              if (tagObj.toLowerCase() == dbAr.toLowerCase()) {
                personalArray.push(item)
              }
            })
          });
        });
        personalArray = personalArray.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });
        req.data.recommended = personalArray
        return personalArray
      } catch (error) {
        console.log('\n popularity error...', error);
      }
    };


    self.orcha = function (req, callback) {
      // console.log("orcha load");
    };
  },
};
