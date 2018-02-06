'use strict'
var jsonfile = require('jsonfile')
const path = require('path')
 
var clientInfo = jsonfile.readFileSync(path.join(__dirname, '../package.json'))

module.exports = {
  CURRENT_VERSION: '"' + clientInfo.version + '-' + clientInfo.revision + '"',
  SERVER_URL: {
    // dev: '"http://127.0.0.1:5000"',
    dev: '"https://sharelist-server.herokuapp.com"',
    prod: '"https://sharelist-server.herokuapp.com"'
  }
}
