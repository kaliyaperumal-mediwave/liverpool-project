module.exports = {
  extend: 'apostrophe-pieces',
  name: 'Watch',
  label: 'Watch',
  pluralLabel: 'Things to Watch',
  addFields: [{
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true,
    },
    {
      name: 'topic',
      label: 'what do you want to watch?',
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
      name: 'watch',
      label: 'watch',
      fields: ['topic','text']
    },
    {
      name: 'admins',
      label: 'Administratives',
      fields: ['slug', 'tags','published']
    }
  ]
};
