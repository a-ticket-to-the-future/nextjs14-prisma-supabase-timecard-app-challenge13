/** @type {import('next').NextConfig} */
const nextConfig = {

    experimental: {
        serverActions: true,
    },

    images: {
        domains: ['lh3.googleusercontent.com',
                    'res.cloudinary.com'],
    },

    // webpack: (config) => {
    //     config.externals = [...config.externals, "bcrypt"];
    //     return config;
    //   },
    newFeatures: {
        useModal: true,
      },

};
// export default nextConfig;
// module default nextConfig;
module.exports = nextConfig
