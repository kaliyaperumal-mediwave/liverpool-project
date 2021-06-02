module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Feedback Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);

    self.addDispatchRoutes = function () {
      self.dispatch('/',self.middleware.checkCommonPageAuth, self.feedback);
    };

    self.feedback = function (req, callback) {
      return self.sendPage(req, self.renderer('feedback', {
        showHeader: true,
        home: true,
        hideRefButton: true,
      }));
    };

    self.route('post', 'feedback', function (req, res) {
      var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/user/feedback';
     // //console.log(req.body, "req.body=========");
      self.middleware.post(req, res, url, req.body).then((data) => {
       // //console.log(data);
        return res.send(data);
      }).catch((error) => {
        //console.log("---- error -------", error)
        return res.status(error.statusCode).send(error.error);
      });
    });
  }
}