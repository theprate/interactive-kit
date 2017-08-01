exports.getConfig = function getConfig() {
  const package = require(`${process.cwd()}/package.json`);

  const packageDefined = Object.hasOwnProperty.call(package, 'interactive-kit') ? package['interactive-kit'] : {};

  return Object.assign({
    jsx: 'React.createElement',
  }, packageDefined);
};
