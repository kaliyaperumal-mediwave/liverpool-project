module.exports = {
  extend: 'apostrophe-pieces',
  name: 'Resources',
  label: 'Resources',
  pluralLabel: 'Resources',
  addFields: [
    {
      name: 'topic',
      label: 'Topic',
      type: 'string',
      def: 'Resources',
      readOnly: true
    },
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
  },
  {
  name: '_readPage',
  label: 'Reads',
  type: 'joinByArray',
  withType: 'readPage',
},
{
name: '_watchPage',
label: 'Watchs',
type: 'joinByArray',
withType: 'watchPage',
},
{
name: '_eventPage',
label: 'Event',
type: 'joinByArray',
withType: 'eventPage',
},{
name: '_gamesPage',
label: 'Games',
type: 'joinByArray',
withType: 'gamesPage',
},{
name: '_partnerAgenciesPage',
label: 'Partner Agencies',
type: 'joinByArray',
withType: 'partnerAgenciesPage',
}
  ],
  arrangeFields: [
    {
      name: 'title',
      label: 'Title',
      fields: [ 'topic','title', 'text', 'tags','thumbnail','_readPage','_watchPage','_eventPage','_gamesPage','_partnerAgenciesPage']
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: ['slug', 'published']
    }
  ]
};
