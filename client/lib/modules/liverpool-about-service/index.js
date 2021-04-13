module.exports = {
  extend: 'apostrophe-pieces',
  name: 'About the services',
  label: 'About the services',
  pluralLabel: 'About the services',
  addFields: [
    {
      name: 'Topic',
      label: 'Topic',
      type: 'string',
      def: 'Services',
      readOnly: true
    },
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true
    },
    {
      name: 'subtitle',
      label: 'Sub Title',
      type: "area",
      options: {
        widgets: {
          "apostrophe-rich-text": {
            toolbar: ["Bold", "Italic", "Link", "Unlink","BulletedList"],
          },
        },
      },
    },
    {
      name: 'text',
      label: 'Text',
      type: "area",
      options: {
        widgets: {
          "apostrophe-rich-text": {
            toolbar: ["Bold", "Italic", "Link", "Unlink","BulletedList"],
          },
        },
      },
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
      fields: ['Topic', 'title','subtitle','text','thumbnail']
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: ['slug', 'published', 'tags']
    }
  ]
};
