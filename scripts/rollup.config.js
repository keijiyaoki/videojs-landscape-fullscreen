const generate = require('videojs-generate-rollup-config');

// see https://github.com/videojs/videojs-generate-rollup-config
// for options
const options = {
  globals(defaults) {
    return {
      browser: Object.assign(defaults.browser, {
        '!video.js': 'videojs'
      }),
      module: Object.assign(defaults.module, {
        '!video.js': 'videojs'
      }),
      test: Object.assign(defaults.test, {
        '!video.js': 'videojs'
      })
    };
  }
};
const config = generate(options);

// Add additonal builds/customization here!

// export the builds to rollup
export default Object.values(config.builds);
