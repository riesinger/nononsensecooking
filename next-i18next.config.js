const path = require("path");

module.exports = {
  i18n: {
    locales: ["en", "de"],
    defaultLocale: "en",
  },
  localePath: path.resolve("./public/locales"),
};
