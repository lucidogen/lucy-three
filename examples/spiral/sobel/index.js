/* 
 * # Sobel filter
 *
 * The code here is a very simple ShaderEffect where we simply live code the
 * vertex and fragment shaders.
 *
 */
'use strict'
const ShaderEffect = require ( 'lucy-compose' ).ShaderEffect
const live  = require ( 'lucy-live' ) 

if ( !exports.loaded )
{ // Not executed on code reload
  module.exports = new ShaderEffect
}
const self = module.exports

live.read
( './vert.glsl'
, function ( s )
  { self.material.vertexShader = s
    self.material.needsUpdate  = true
  }
) 

live.read
( './frag.glsl'
, function ( s )
  { self.material.fragmentShader = s
    self.material.needsUpdate    = true
  }
) 
