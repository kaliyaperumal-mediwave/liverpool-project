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
      if (!req.session.user_role) {
        return req.res.redirect("/")
      }
      return self.sendPage(req, self.renderer('completed', {
        showHeader: true,
        headerContent: "The referral has been made to Children’s and Young Person’s Sefton & Liverpool Mental Health Services",
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

    self.route('get', 'getReferalByCode/:reqCode', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/getReferalByCode?reqCode=' + req.params.reqCode;
      //console.log("------- URL --------", url);
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        return res.status(error.statusCode).send(error.error);
      });
    });

    require('../../middleware')(self, options);
    self.route('post', 'doCreateAcc', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/referralSignup';
      self.middleware.post(req, res, url, req.body).then((data) => {
        if (data) {
          req.session.email = data.data.email
          req.session.auth_token = data.data.token;
          req.session.user_role = data.data.data.user_role;
          req.session.loginFlag = "true";
          req.session.prof_data = data.data.prof_data ? JSON.stringify(data.data.prof_data) : '';
          req.session.reload(function () { });
        }
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
    self.route('post', 'feedback', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/feedback';
      // console.log(req.body, "req.body=========");
      self.middleware.post(req, res, url, req.body).then((data) => {
        // console.log(data);
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}