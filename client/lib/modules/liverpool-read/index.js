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
      name: 'topic',
      label: 'Read_Topic',
      type: 'area',
      required: true,
      options: {
        widgets: {
          'apostrophe-rich-text': {
            toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
          }
        }
      }
    },
    {
      name: 'text',
      label: 'Text',
      type: 'area',
      required: true,
      options: {
        widgets: {
          'apostrophe-rich-text': {
            toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
          }
        }
      }
    }

  ],
  arrangeFields: [{
      name: 'read',
      label: 'Read',
      fields: ['topic','text']
    },
    {
      name: 'admins',
      label: 'Administratives',
      fields: [ 'slug', 'tags','published']
    }
  ]
};
