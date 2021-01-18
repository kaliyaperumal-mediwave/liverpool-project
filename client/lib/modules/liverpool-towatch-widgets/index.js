module.exports = {
  extend: "apostrophe-widgets",
  label: "Logo Block",
  addFields: [
    {
      name: "logo_image",
      type: "singleton",
      widgetType: "apostrophe-images",
      label: "icon",
      required: true,
    },
    {
      name: "logo_url",
      type: "url",
      label: "URL",
      required: true,
    },
    {
      name: "logo_width",
      type: "string",
      label: "width",
    },
    {
      name: "logo_height",
      type: "string",
      label: "height",
    },
  ],
};
