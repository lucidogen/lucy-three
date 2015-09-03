'use strict'
const Scene = require('../../../lib/Scene')

// This is kept between code reload (executed only once)
if (!exports.loaded) {
  module.exports = new Scene(
      // Default 'image' used when running blur without sub-scene.
    { target: { result: 'DEFAULT' }
      // Default blur operation.
    , blur: '~IMAGE~'
    }
  )
}
const self = module.exports

self.setup = function(options, sub) {
  self.blur = options.blur || self.blur

  sub.ready.then(function(scene) {
    self.sub = scene
    self.ready()
  })
}

self.render = function(context, target) {
  // Ask sub-scene to write result in our target
  if (self.sub) {
    self.sub.render(context, self.target)
  } else {
    // default image (use previous target result)
  }

  // Write our operation in `target`. Blur simply add « » quotes.
  target.result = self.blur.replace('IMAGE', self.target.result)
}
