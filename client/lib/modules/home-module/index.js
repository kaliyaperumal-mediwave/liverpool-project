var _ = require('lodash');
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.home);
    };
    self.home = function (req, callback) {
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate'); //This will force the browser to obtain new copy of the page even when they hit "back".
      if (req.session.auth_token) {
        return req.res.redirect("/dashboard");
      }
      else {
        //req.session.destroy();
        req.data.showHome = false;
        return self.sendPage(req, self.renderer('home', {
          showHeader: true,
          //piecesArray: piecesArray
        }));
      }
    };

    self.route('get', 'getPiecesData', async function (req, res) {


      var Resources = await self.apos.modules['Resources-pages'].pieces.find(req, {}).toArray();
      var ThingsToWatchArray = await self.apos.modules['liverpool-watch-pages'].pieces.find(req, {}).toArray();
      var ThingsToWatch = _.map(ThingsToWatchArray, (item) => {
        item.custom_url = "/watch?piece_id=" + item._id
        return item;
      })
      var ThingsToReadArray = await self.apos.modules['liverpool-read-pages'].pieces.find(req, {}).toArray();
      var ThingsToRead = _.map(ThingsToReadArray, (item) => {
        item.custom_url = "/read?piece_id=" + item._id
        return item;
      })
      var GamesArray = await self.apos.modules['liverpool-games-pages'].pieces.find(req, {}).toArray();
      var Games = _.map(GamesArray, (item) => {
        item.custom_url = "/games?piece_id=" + item._id
        return item;
      })
      var EventsArray = await self.apos.modules['liverpool-events-pages'].pieces.find(req, {}).toArray();
      var Events = _.map(EventsArray, (item) => {
        item.custom_url = "/events?piece_id=" + item._id
        return item;
      })

      var PartnerAgenciesArray = await self.apos.modules['liverpool-Partner-agencies-pages'].pieces.find(req, {}).toArray();
      var PartnerAgencies = _.map(PartnerAgenciesArray, (item) => {
        item.custom_url = "/partner?piece_id=" + item._id
        return item;
      })
      var AboutService = await self.apos.modules['liverpool-about-service-pages'].pieces.find(req, {}).toArray();
      var PeopleService = await self.apos.modules['liverpool-mental-health-pages'].pieces.find(req, {}).toArray();
      piecesArray = Resources.concat(ThingsToWatch, ThingsToRead, Games, Events, PartnerAgencies, AboutService, PeopleService)
      req.data.piecesArray = piecesArray;
      req.data.piecesArray = piecesArray;
      req.session.readArray = ThingsToRead;
      req.session.watchArray = ThingsToWatch;
      req.session.gamesArray = Games;
      req.session.eventsArray = Events;
      req.session.partnerAgenciesArray = PartnerAgencies;

      return res.send({ data: { success: "true", message: "session ref_home set", searchData: req.data.piecesArray } });
    });
  }
};
