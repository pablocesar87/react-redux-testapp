require('dotenv').config();
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');

// commonsChunkConfig workaround
// https://github.com/zeit/next-plugins/issues/157#issuecomment-385885772
const commonsChunkConfig = (config, test = /\.css$/) => {
  config.plugins = config.plugins.map((plugin) => {
    if (
      plugin.constructor.name === 'CommonsChunkPlugin' &&
      plugin.minChunks != null
    ) {
      const defaultMinChunks = plugin.minChunks;

      plugin.minChunks = (module, count) => {
        if (module.resource && module.resource.match(test)) {
          return true;
        }

        return defaultMinChunks(module, count);
      };
    }

    return plugin;
  });

  return config;
};

module.exports = withCss(withSass({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config = commonsChunkConfig(config, /\.(sass|scss|css)$/);
    }

    const originalEntry = config.entry;

    config.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !entries['main.js'].includes('./client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js');
      }

      return entries;
    };

    return config;
  },
  publicRuntimeConfig: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
}));
