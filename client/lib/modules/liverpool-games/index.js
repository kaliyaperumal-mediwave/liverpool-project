module.exports = {
  extend: 'apostrophe-pieces',
  name: 'games',
  label: 'Games',
  pluralLabel: 'Games',
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
      name: 'games_title',
      label: 'Games_title',
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
      fields: ['title','thumbnail','games_title','text','tags']
    },
    {
      name: 'admins',
      label: 'Administratives',
      fields: [ 'slug','published']
    }
  ]
};
