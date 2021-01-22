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
      name: 'role-module',
      label: 'Role Module'
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
    },
    {
      name: 'resources-module',
      label: 'Resources Module'
    },
    {
      name: 'dashboard-module',
      label: 'Dashboard Module'
    },
    {
      name: 'check-referral-module',
      label: 'Check Referral Module'
    },
    {
      name: 'mental-health-module',
      label: 'Mental Health Module',
    },
    {
      name: 'feedback-module',
      label: 'Feedback Module'
    },
    {
      name: 'footer-pages-module',
      label: 'Footer Pages Module'
    },
    {
      name: 'Resources-pages',
      label: 'ResourcesPages'
    },
    {
      name: 'account-settings-module',
      label: 'Account Settings Module'
    },
    {
      name: 'liverpool-watch-pages',
      label: 'Resources watch'
    },
    {
      name: 'liverpool-read-pages',
      label: 'Resources Read'
    },
    {
      name: 'liverpool-events-pages',
      label: 'Resources Events'
    },
    {
      name: 'liverpool-games-pages',
      label: 'Resources Games'
    },
    {
      name: 'liverpool-Partner-agencies-pages',
      label: 'Partner-agencies'
    }

    // Add more page types here, but make sure you create a corresponding
    // template in lib/modules/apostrophe-pages/views/pages!
  ]
};
