module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Completed Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      require('../../middleware')(self, options);
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.completed);
    };
    self.completed = function (req, callback) {
      return self.sendPage(req, self.renderer('completed', {
        showHeader: true,
        headerContent: "The referral has been made to Children’s and Young Person’s Liverpool & Sefton Mental Health Services",
        headerDescription: '',
        backContent: '',
        home: false,
        completed: true,
        hideRefButton: false,
      }));
    };
    require('../../middleware')(self, options);
    self.route('get', 'getRefNo/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/getRefNo?user_id=' + req.params.userid;
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //  console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'sendConfirmationMail', function (req, res) {
      //req.body.email = req.session.email
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/sendConfirmationMail'
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        //  console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}