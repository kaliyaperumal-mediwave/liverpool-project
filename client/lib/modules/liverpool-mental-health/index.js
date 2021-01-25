module.exports = {
  extend: 'apostrophe-pieces',
  name: 'About the people',
  label: 'About the people',
  pluralLabel: 'About the people',
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
      fields: [ 'title','subtitle','text', 'tags','thumbnail']
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: ['slug', 'published']
    }
  ]
};
