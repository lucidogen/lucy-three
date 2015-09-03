'use strict'
const Scene = require('../../../lib/Scene')

// This is kept between code reload (executed only once)
if (!exports.loaded) {
  module.exports = new Scene()
}
const self = module.exports

self.setup = function(options) {
  // Just copy options to see what was passed
  self.options = options
  self.ready()
}

self.render = function(context, target) {
  target.result = self.options.toString()
}

