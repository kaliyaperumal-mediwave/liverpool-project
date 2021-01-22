module.exports = {
  extend: 'apostrophe-pieces',
  name: 'Resources',
  label: 'Resources',
  pluralLabel: 'Resources',
  addFields: [
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true
    },
    {
      name: 'text',
      label: 'Text',
      type: 'string',
      required: true,
      textarea: true
    },
    {
    name: 'thumbnail',
    label: 'Thumbnail',
    type: 'singleton',
    required: true,
    widgetType: 'apostrophe-images',
    options: {
      limit: [ 1 ]
    }
  }
  ],
  arrangeFields: [
    {
      name: 'title',
      label: 'Title',
      fields: [ 'title', 'text', 'tags','thumbnail']
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: ['slug', 'published']
    }
  ]
};
