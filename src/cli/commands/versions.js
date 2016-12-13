'use strict'

const fs = require('fs')
const path = require('path')

var Command = require('ronin').Command

module.exports = Command.extend({
  desc: 'Check each version published',

  run: function (name) {
    var configPath
    try {
      configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      publish()
    } catch (err) {
      console.warn(err)
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function publish () {
      var config = JSON.parse(fs.readFileSync(configPath))
      config.versions = config.versions || []
      config.versions.forEach(function (version) {
        console.log(version.timestamp, version.hash)
      })
    }
  }
})
