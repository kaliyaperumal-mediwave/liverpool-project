// This configures the apostrophe-pages module to add a "home" page type to the
// pages menu

module.exports = {
  types: [
    {
      name: 'home',
      label: 'Home'
    },
    {
      name: 'home-module',
      label: 'Home Module'
    },
    {
      name: 'auth-module',
      label: 'Auth Module'
    },
    {
      name: 'about-module',
      label: 'About Module'
    },
    {
      name: 'referral-home-module',
      label: 'Referral Home Module'
    },
    {
      name: 'education-employment-module',
      label: 'Education Employment Module'
    },
    {
      name: 'referral-module',
      label: 'Referral Module'
    },
    {
      name: 'review-module',
      label: 'Review Module'
    },
    {
      name: 'referral-complete-module',
      label: 'Referral Completed Module'
    }

    // Add more page types here, but make sure you create a corresponding
    // template in lib/modules/apostrophe-pages/views/pages!
  ]
};
