// Require all test files by webpack
const contextRequire = require.context(`${__dirname}/../test`, true, /-test\.js$/);
contextRequire.keys().map(contextRequire);
