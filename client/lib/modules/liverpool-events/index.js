module.exports = {
  extend: 'apostrophe-pieces',
  name: 'eventPage',
  label: 'Event',
  pluralLabel: 'Events',
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
      name: 'eventsTopic',
      label: 'Events_Topic',
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
      name: 'events',
      label: 'Events',
      fields: ['title','thumbnail','eventsTopic','text']
    },
    {
      name: 'admins',
      label: 'Administratives',
      fields: [ 'slug','published','tags']
    }
  ]
};
