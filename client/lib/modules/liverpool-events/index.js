module.exports = {
  extend: "apostrophe-pieces",
  name: "eventPage",
  label: "Event",
  pluralLabel: "Events",
  addFields: [
    {
      name: "Topic",
      label: "Topic",
      type: "string",
      def: "Events",
      readOnly: true,
    },
    {
      name: "title",
      label: "Title",
      type: "string",
      required: true,
    },
    {
      name: "thumbnail",
      label: "Thumbnail",
      type: "singleton",
      widgetType: "apostrophe-images",
      options: {
        limit: [1],
      },
    },
    {
      name: "eventsTopic",
      label: "Events_Topic",
      type: "string",
      textarea: true,
    },
    {
      name: "text",
      label: "Text",
      type: "string",
      required: true,
      textarea: true,
    },
    {
      name: "joinLink",
      label: "Join Event URL",
      type: "url",
      required: true,
    },
    {
      name: "location",
      label: "Location",
      type: "string",
      required: true,
    },
    // {
    //   name: 'latitude',
    //   label: 'Latitude',
    //   type: 'string',
    //   required: true
    // },
    // {
    //   name: 'landitude',
    //   label: 'Landitude',
    //   type: 'string',
    //   required: true
    // },

    {
      name: "date",
      label: "Date",
      type: "date",
      def: null,
      required: true,
      pikadayOptions: {
        showTime: true,
        format: "LLLL",
        firstDay: 1,
      },
    },
    {
      name: "starttime",
      label: "StartTime",
      type: "time",
      def: null,
      required: true,
      pikadayOptions: {
        showTime: true,
        format: "HH:MM:SS",
        firstDay: 1,
      },
    },
    {
      name: "endtime",
      label: "EndTime",
      type: "time",
      def: null,
      required: true,
      pikadayOptions: {
        showTime: true,
        format: "HH:MM:SS",
        firstDay: 1,
      },
    },
  ],
  arrangeFields: [
    {
      name: "events",
      label: "Events",
      fields: [
        "Topic",
        "title",
        "thumbnail",
        "eventsTopic",
        "text",
        "location",
        "joinLink",
      ],
    },
    {
      name: "admins",
      label: "Administratives",
      fields: ["date", "starttime", "endtime", "slug", "published", "tags"],
    },
  ],
};
