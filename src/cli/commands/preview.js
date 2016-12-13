'use strict'

const fs = require('fs')
const path = require('path')

const browserSync = require('browser-sync')
var Command = require('ronin').Command
const open = require('open')

module.exports = Command.extend({
  desc: 'Preview your application before you publish it',

  options: {
    port: {
      type: 'string',
      alias: 'p'
    }
  },

  run: function (port, name) {
    var configPath
    try {
      configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      preview()
    } catch (err) {
      console.warn(err)
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function preview () {
      let config = JSON.parse(fs.readFileSync(configPath))

      let bsConfig = Object.assign({}, {
        server: './',
        files: '**/*',
        notify: false,
        open: true,
        tunnel: true,
        host: '0.0.0.0',
        port: parseInt(port, 10) || 8000
      }, config.browsersync)

      browserSync(bsConfig)
    }
  }
})
