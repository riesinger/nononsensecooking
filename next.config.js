const { i18n } = require("./next-i18next.config");
const { withPlaiceholder } = require("@plaiceholder/next");

module.exports = withPlaiceholder({
  i18n,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "api.preview.nononsense.cooking",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "api.nononsense.cooking",
        pathname: "/api/**",
      },
    ],
  },
  swcMinify: true,
});
