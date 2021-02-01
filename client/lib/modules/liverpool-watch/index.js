module.exports = {
  extend: 'apostrophe-pieces',
  name: 'watchPage',
  label: 'Watchs',
  pluralLabel: 'Things to Watch',
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
          type: 'string',
          required: true,
          textarea: true
        },
      {
      name: 'video',
      label: 'video',
      type: 'url'

    }
  ],
  arrangeFields: [{
      name: 'watch',
      label: 'watch',
      fields: ['Topic','title','SubTitle','text','video']
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: ['slug','published','tags']
    }
  ]
};
