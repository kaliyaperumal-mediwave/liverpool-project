module.exports = {
  label: 'Mixed Resources',
  addFields: [
    {
      name: 'headline',
      label: 'Headline',
      type: 'string'
    },
    {
      name: '_content',
      label: 'Content to Link',
      type: 'joinByArray',
      withType: ['liverpool-watch','liverpool-read','liverpool-events','liverpool-games','liverpool-Partner-agencies'],
      filters: {
        projection: {
          _url: 1,
          slug: 1,
          title: 1,
          type: 1,
          thumbnail: 1,
          year: 1
        }
      }
    }
  ]
};
