module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Auth Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/login', self.login);
      self.dispatch('/sign_up', self.sign_up);
    };

    self.login = function (req, callback) {
      return self.sendPage(req, self.renderer('login', {
        showHeader: true,
        home: true,
        navigateMkeRfrl: "/role?",
      }));
    };

    self.sign_up = function (req, callback) {
      return self.sendPage(req, self.renderer('sign_up', {
        showHeader: true,
        home: true
      }));
    };

    require('../../middleware')(self, options);
    self.route('post', 'doCreateAcc', function (req, res) {
      console.log(url);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/signup';
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'doLogin', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/login';
      console.log("-------");
      console.log(url);
      console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

  }
}