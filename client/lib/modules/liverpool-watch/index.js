module.exports = {
  extend: 'apostrophe-pieces',
  name: 'Watch',
  label: 'Watch',
  pluralLabel: 'Things to Watch',
  addFields: [
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
      fields: ['title','SubTitle','text','video','tags']
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: ['slug','published']
    }
  ]
};
