module.exports = {
  extend: "apostrophe-pieces",
  name: "About the people",
  label: "About the people",
  pluralLabel: "About the people",
  addFields: [
    {
      name: "Topic",
      label: "Topic",
      type: "string",
      def: "People",
      readOnly: true,
    },
    {
      name: "title",
      label: "Title",
      type: "string",
      required: true,
    },
    {
      name: "subtitle",
      label: "Sub Title",
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
      name: "text",
      label: "Text",
      type: "area",
      options: {
        widgets: {
          "apostrophe-rich-text": {
            toolbar: ["Bold", "Italic", "Link", "Unlink","BulletedList"],
          },
        },
      },
      required: true,
    },
    {
      name: "thumbnail",
      label: "Thumbnail",
      type: "singleton",
      required: true,
      widgetType: "apostrophe-images",
      options: {
        limit: [1],
      },
    },
  ],
  arrangeFields: [
    {
      name: "title",
      label: "Title",
      fields: ["Topic", "title", "subtitle", "text", "tags", "thumbnail"],
    },
    {
      name: "admin",
      label: "Administrative",
      fields: ["slug", "published"],
    },
  ],
};
