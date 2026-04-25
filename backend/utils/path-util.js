const path = require('path')

// Use require.main.filename when running directly via `node server.js`,
// fall back to __dirname-based resolution otherwise.
module.exports = require.main?.filename
  ? path.dirname(require.main.filename)
  : path.resolve(__dirname, '..');