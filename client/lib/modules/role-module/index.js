module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Role Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.setValues,self.role);
    };
    require('../../middleware')(self, options);
    self.role = function (req, callback) {
      return self.sendPage(req, self.renderer('role', {
        headerContent: "Section 1 of 5: Eligibility",
        headerDescription: " Before we get too far, let’s check that you or the child / young person is eligible to refer into this service.",
        backContent: '',
        home: false,
        showHeader: true,
        hideRefButton: false,
      }));
    };
    // save eligibitiy
    self.route('post', 'eligibility', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/eligibility';
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

    self.route('get', 'fetchEligibility/:userid', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility?user_id=' + req.params.userid;
      console.log("-------");
      console.log(req.params.userid);
      console.log(url);
      console.log("-------");
      self.middleware.get(req, url).then((data) => {
        return res.send(data);
      }).catch((error) => {
        // console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });

    // self.route('post', 'fetchEligibility', function (req, res) {
    //   var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/fetchEligibility';
    //   console.log("-------");
    //   console.log(url);
    //   console.log("-------");
    //   self.middleware.post(req, res, url, req.body).then((data) => {
    //     return res.send(data);
    //   }).catch((error) => {
    //     console.log("---- error -------", error)
    //     return res.status(error.statusCode).send(error.error);
    //   });
    // });
  }
}