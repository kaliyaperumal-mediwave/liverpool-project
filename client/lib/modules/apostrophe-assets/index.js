// This configures the apostrophe-assets module to push a 'site.less'
// stylesheet by default, and to use jQuery 3.x

module.exports = {
  //jQuery: 3,
  stylesheets: [
    {
      name: 'site'
    }, {
      name: 'styles',
      import: {
        inline: true
      }
    }
  ],
  scripts: [
    {
      name: 'site'
    },
    // {
    //   name: 'jquery.min'
    // },
    {
      name: 'jquery.cookie'
    },
    {
      name: 'autocomplete'
    },
    {
      name: 'popper.min'
    },
    {
      name: 'bootstrap.min'
    },
    {
      name: 'swiper'
    },
    {
      name: process.env.ENV === 'development' ? 'vue' : 'vue.min'
    },
    {
      name: 'utilities'
    },
    {
      name: 'filters'
    },
  ]
};
