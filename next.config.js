/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["uploadthing.com"] },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs",
    });
    return config;
  },
};

module.exports = nextConfig;
