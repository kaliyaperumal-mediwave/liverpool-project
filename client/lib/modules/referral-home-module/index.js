module.exports = {
  extend: 'apostrophe-custom-pages',
  label: 'Referral Home Module',
  afterConstruct: function (self) {
    self.addDispatchRoutes();
  },
  construct: function (self, options) {
    require('../../middleware')(self, options);
    self.addDispatchRoutes = function () {
      // clearSessionReferral - to clear uuid and userrole in referrance home page. 
      self.dispatch('/', self.middleware.clearSessionReferral,self.refHome);
    };
    self.refHome = function (req, callback) {
      req.res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      return self.sendPage(req, self.renderer('referral-home', {
        headerContent: "Make a referral to children and young people's mental health services in Sefton & Liverpool",
        headerDescription: '',
        backContent: '',
        home: true,
        showHeader: true,
      }));
    };

    //set session to use in role module to maintain session logout
    self.route('get', 'setSessionRefHome/:fromHome', function (req, res) {
      req.session.frm_ref_home = 'Y';
      if(req.session && req.session.loginFlag == 'true' && req.session.user_role == 'professional') {
        var url = self.apos.LIVERPOOLMODULE.getOption(req, 'phr-module') + '/referral/profReferral';
        self.middleware.get(req, url).then((data) => {
          req.session.prof_data = Object.keys(data.data).length ? JSON.stringify(data.data) : '';
          return res.send({data: {success:'true',message:'session ref_home set'}});
        }).catch((error) => {
          return res.status(error.statusCode).send(error.error);
        });
      } else {
        return res.send({data: {success:'true',message:'session ref_home set'}});
      }
    });
  }
}