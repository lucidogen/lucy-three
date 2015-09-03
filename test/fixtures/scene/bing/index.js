'use strict'
const Scene = require ( '../../../../lib/Scene' )

if ( ! exports.loaded )
{ // Executed only once on initial code loading.
  module.exports = new Scene
  ( { message: 'BING' // Default image message.
    }
  )
}
const self = module.exports

// Custom setup function
self.setup = function ( options )
{ self.message = options.message || self.message
  self.ready ()
}

// Custom render function
self.render = function ( context, target )
{ // Write our operation in `target`.
  target.result = self.message
}

