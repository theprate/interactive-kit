const path = require('path');

exports.getConfig = function getConfig() {
  console.log('getting config', path.resolve(process.cwd(), './package.json'))
  const package = require(path.resolve(process.cwd(), './package.json'));

  const packageDefined = Object.hasOwnProperty.call(package, 'interactive-kit') ? package['interactive-kit'] : {};

  return Object.assign({
    jsx: 'React.createElement',
  }, packageDefined);
};
