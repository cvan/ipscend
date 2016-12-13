'use strict'

const fs = require('fs')
const path = require('path')

const Command = require('ronin').Command
const ipfsAPI = require('ipfs-api')

module.exports = Command.extend({
  desc: 'Publish your project',

  run: function (name) {
    let configPath
    try {
      configPath = path.resolve(process.cwd() + '/ipscend.json')
      fs.statSync(configPath)
      publish()
    } catch (err) {
      console.warn(err)
      console.log('Project must be initiated first, run `ipscend init`')
    }

    function publish () {
      const config = require(configPath)
      const ipfs = ipfsAPI('localhost', '5001')

      ipfs.util.addFromFs(config.path, {
        recursive: true,
        'stream-channels': false
      }, (err, res) => {
        if (err || !res) {
          return console.error('err', err)
        }

        console.log(res)

        const hash = res[res.length - 2].hash

        const duplicate = config.versions.filter(function (v) {
          return v.hash === hash
        })[0]

        if (duplicate) {
          console.log('This version "%s" has already been published on "%s"',
            duplicate.hash,
            duplicate.timestamp)
          return
        }

        const version = {
          hash: hash,
          timestamp: new Date()
        }

        console.log('Published %s with the following hash:', config.path, version.hash)
        console.log('You can access it through your local node or through a public IPFS gateway:')
        console.log('http://localhost:8080/ipfs/' + version.hash)
        console.log('http://ipfs.io/ipfs/' + version.hash)

        config.versions.push(version)

        const fd = fs.openSync(configPath, 'w')
        fs.writeSync(fd, JSON.stringify(config, null, '  '), 0, 'utf-8')
      })
    }
  }
})
