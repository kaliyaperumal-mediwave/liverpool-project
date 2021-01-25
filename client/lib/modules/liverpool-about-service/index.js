module.exports = {
  extend: 'apostrophe-pieces',
  name: 'About the services',
  label: 'About the services',
  pluralLabel: 'About the services',
  addFields: [
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true
    },
    {
      name: 'subtitle',
      label: 'Sub Title',
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
      fields: [ 'title','subtitle','text','thumbnail']
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: ['slug', 'published', 'tags']
    }
  ]
};
