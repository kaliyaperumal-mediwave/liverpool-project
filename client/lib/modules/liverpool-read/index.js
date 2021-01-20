module.exports = {
  extend: 'apostrophe-pieces',
  name: 'Read',
  label: 'Read',
  pluralLabel: 'Things to Read',
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
      name: 'read_topic',
      label: 'Read_Topic',
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
      fields: ['title','thumbnail','read_topic','text','tags']
    },
    {
      name: 'admins',
      label: 'Administratives',
      fields: [ 'slug','published']
    }
  ]
};
