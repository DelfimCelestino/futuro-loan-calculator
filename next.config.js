/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const nextConfig = {
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
  }),
  httpAgentOptions: {
    keepAlive: true,
  },
};

module.exports = nextConfig;
