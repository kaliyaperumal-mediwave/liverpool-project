module.exports = {
  extend: 'apostrophe-pieces',
  name: 'partnerAgenciesPage',
  label: 'partnerAgencies',
  pluralLabel: 'Partner Agencies',
  addFields: [{
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true,
    },
    {
    name: 'thumbnail',
    label: 'Thumbnail',
    type: 'singleton',
    widgetType: 'apostrophe-images',
    options: {
      limit: [ 1 ]
    }
  },
    {
      name: 'partnerAgencies',
      label: 'Partner-Agencies',
      type: 'string',
      textarea: true
    },
    {
    name: 'text',
    label: 'Text',
    type: 'string',
    required: true,
    textarea: true
  }

  ],
  arrangeFields: [{
      name: 'read',
      label: 'Read',
      fields: ['title','thumbnail','partnerAgencies','text','tags']
    },
    {
      name: 'admins',
      label: 'Administratives',
      fields: [ 'slug','published']
    }
  ]
};
