module.exports = {
  extend: "apostrophe-custom-pages",
  label: "Auth Module",
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      self.dispatch('/login',self.middleware.checkCommonPageAuth, self.login);
      self.dispatch('/sign_up',self.middleware.checkCommonPageAuth, self.sign_up);
    };

    self.login = function (req, callback) {

       // check already logged user 
      // if yes redirect user to dashboard directly else redirect them to login page
      if(req.session.auth_token)
      {
        return req.res.redirect("/dashboard");
      }
      return self.sendPage(req, self.renderer('login', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };

    self.sign_up = function (req, callback) {

       // check already logged user 
      // if yes redirect user to dashboard directly else redirect them to signup page
      if(req.session.auth_token)
      {
        return req.res.redirect("/dashboard");
      }
      return self.sendPage(req, self.renderer('sign_up', {
        showHeader: true,
        home: true,
      }));
    };

    require('../../middleware')(self, options);
    self.route('post', 'doCreateAcc', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/signup';
      self.middleware.post(req, res, url, req.body).then((data) => {
        console.log(data.data.data.user_role)
        if (data) {
          ///req.session.auth_token = data.data.token;
          req.session.email = data.data.email
          req.session.auth_token = data.data.token;
          req.session.user_role = data.data.data.user_role;
          req.session.loginFlag = "true";
          req.session.reload(function () { });
        }
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('post', 'doLogin', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/login';
      self.middleware.post(req, res, url, req.body).then((data) => {
        console.log(data)
        if (data) {
          req.session.auth_token = data.data.sendUserResult.token;
          req.session.user_role=data.data.sendUserResult.role
          req.session.email = data.data.sendUserResult.email
          req.session.loginFlag = "true";
          // need a change - decrypt
          req.session.reload(function () { });
        }
        return res.send(data);
      }).catch((error) => {
        console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  },
};
