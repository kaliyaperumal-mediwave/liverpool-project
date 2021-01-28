
//   }
// };
// remove unused var
const { btoa } = require('../../utils')
const { atob } = require('../../utils')
var _ = require('lodash');
module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Dashboard Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkAuth, self.landing);
    };
    self.landing = async function (req, callback) {
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

      return self.sendPage(req, self.renderer('dashboard', {
        showHeader: true,
        home: true,
        hideRefButton: true,
        piecesArray: piecesArray
      }));
    };
    // need a change loginId/:userRole
    self.route('get', 'getIncompleteReferral', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getIncompleteReferral';
      console.log(url)
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
    // need a change loginId/:userRole

    self.route('get', 'searchReferalByCode/:reqCode', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/searchReferalByCode?reqCode=' + req.params.reqCode
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('get', 'getUserIncompleteReferral/:referralType', function (req, res) {
      console.log("----------------------------------------------------- " + req.params.referralType);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getUserReferral?referralType=' + req.params.referralType;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });


    self.route('get', 'continueIncompleteReferral/:uuid/:role/:refProgress', function (req, res) {
      //setting user role and uuid in session to navigate referral pages
      req.session.user_role = req.params.role;
      req.session.uuid = req.params.uuid;
      return res.send(req.params.refProgress);
    });
  }
}