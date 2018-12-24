const loaderUtils = require('loader-utils');
const schemaValidate = require('schema-utils');
const Minimize = require('minimize');
const schema = require('./schema.json');

module.exports = function (source) {
  // validate
  const options = loaderUtils.getOptions(this) || {};
  schemaValidate(schema, options, 'html-minify-loader');

  // do minify
  const minimizer = new Minimize(options);
  const minSource = minimizer.parse(source);

  // return
  if (this.data.isLast) {
    return 'module.exports = ' + JSON.stringify(minSource);
  }

  return minSource;
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  data.isLast = this.loaderIndex === 0 || this.loaderIndex === 1;
};