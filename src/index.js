const argv = require('minimist')(process.argv.slice(2));
const scripts = require('./scripts');

const initializeScript = ({ url, mode = 'screencapture' }) => {
  if (!url) {
    throw new Error('url parameter is required');
  }

  scripts[mode](url);
};

initializeScript(argv);
