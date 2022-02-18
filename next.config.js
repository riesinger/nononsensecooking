const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  compiler: {
    styledComponents: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  swcMinify: true
};
