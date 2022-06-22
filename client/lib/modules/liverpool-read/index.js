module.exports = {
  extend: 'apostrophe-pieces',
  name: 'readPage',
  label: 'Reads',
  pluralLabel: 'Things to Read',
  sortify: true,
  addFields: [
    {
      name: 'Topic',
      label: 'Topic',
      type: 'string',
      def: 'Read',
      readOnly: true
    },
    {
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
  },
  {
    name: 'link',
    label: 'Link',
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

    name: 'doc_pdf',
    type: 'attachment',
    label: 'File',
    group: 'pdf',
    required: true

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
      name: 'read',
      label: 'Read',
      fields: ['Topic','title','thumbnail','read_topic','text','link','doc_pdf','by_author']
    },
    {
      name: 'admins',
      label: 'Administratives',
      fields: [ 'slug','published','tags']
    }
  ]
};
