module.exports = {
  extend: 'apostrophe-pieces',
  name: 'watchPage',
  label: 'Watchs',
  pluralLabel: 'Things to Watch',
    sortify: true,
  addFields: [
    {
      name: 'Topic',
      label: 'Topic',
      type: 'string',
      def: 'Watch',
      readOnly: true
    },
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true,
    },
    {
      name: 'SubTitle',
      label: 'what do you want to watch?',
      type: 'string',
      required: true,
      textarea: true
        },
        {
          name: 'text',
          label: 'Text',
          type: 'area',
            options: {
              widgets: {
                'apostrophe-rich-text': {
                  toolbar: ['Bold', 'Italic', 'Link', 'Unlink']
                }
              }
            }
        },
      {
      name: 'video',
      label: 'video',
      type: 'url'

    },
    {
      name: 'by_author',
      label: 'By',
      type: 'area',
        options: {
          widgets: {
            'apostrophe-rich-text': {
              toolbar: ['Bold', 'Italic', 'Link', 'Unlink']
            }
          }
        }
    }
  ],
  arrangeFields: [{
      name: 'watch',
      label: 'watch',
      fields: ['Topic','title','SubTitle','text','video','by_author']
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: ['slug','published','tags']
    }
  ]
};
