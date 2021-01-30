module.exports = {
  extend: 'apostrophe-pieces',
  name: 'eventPage',
  label: 'Event',
  pluralLabel: 'Events',
  addFields: [
    {
      name: 'Topic',
      label: 'Topic',
      type: 'string',
      def: 'Events',
      readOnly: true
    },{
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
      fields: ['Topic','title','thumbnail','eventsTopic','text']
    },
    {
      name: 'admins',
      label: 'Administratives',
      fields: [ 'slug','published','tags']
    }
  ]
};
