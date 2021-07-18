const path = require("path");

module.exports = {
  i18n: {
    locales: ["en-US", "de-DE"],
    defaultLocale: "en-US",
  },
  localePath: path.resolve("./public/locales"),
};
