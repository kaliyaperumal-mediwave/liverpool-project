module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Role Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/', self.middleware.checkCommonPageAuth, self.role);
    };
    require('../../middleware')(self, options);
    self.role = function (req, callback) {
      //console.log("dfafa")
      //console.log("user_role", req.session.user_role);
      //console.log("uuid", req.session.uuid);
      //console.log("---", req.session.frm_ref_home);
      //console.log("Professional_data", req.session.prof_data);
      if (!req.session.frm_ref_home) {
        return req.res.redirect("/")
      }
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return self.sendPage(req, self.renderer('role', {
        headerContent: "Section 1 of 5: Eligibility",
        headerDescription: "Before we get too far, let’s check we can support you",
        backContent: '',
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };
    // save eligibitiy
    self.route('post', 'eligibility', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/eligibility';
      //console.log("-------");
      //console.log(url);
      //console.log("-------");
      self.middleware.post(req, res, url, req.body).then((data) => {
        // setting the uuid and userrole to use in upcoming sections. 
        if (!req.body.editFlag) {
          if (req.session.auth_token) {
            req.session.uuid = data.userid;
          }
          else {
            req.session.user_role = data.user_role;
            req.session.uuid = data.userid;
          }
        }
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    self.route('get', 'fetchEligibility/:userid', function (req, res) {
      //console.log("faf" + req.params.userid);
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility?user_id=' + req.params.userid;
      //console.log("-------");
      ////console.log(req.params.userid);
      //console.log(url);
      //console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    // self.route('post', 'fetchEligibility', function (req, res) {
    //   var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility';
    //   //console.log("-------");
    //   //console.log(url);
    //   //console.log("-------");
    //   self.middleware.post(req, res, url, req.body).then((data) => {
    //     return res.send(data);
    //   }).catch((error) => {
    //     //console.log("---- error -------", error)
    //     return res.status(error.statusCode).send(error.error);
    //   });
    // });
  }
}