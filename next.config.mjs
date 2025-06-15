/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
    ],
  },
    i18n: {
    locales: ["en", "es"],
    defaultLocale: "en",
  },
};

export default nextConfig;
