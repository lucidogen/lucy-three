/* 
 * # Mix filter
 *
 */
'use strict'
const ShaderEffect  = require('./ShaderEffect')
const WebGLRenderer = require('./WebGLRenderer')
const THREE = require('three')

const MixShader = function(options) {
  ShaderEffect.call(this, options)
  this.mix = 0.
}

module.exports = MixShader
// Inherit from ShaderEffect
for(let k in ShaderEffect.prototype) {
  MixShader.prototype[k] = ShaderEffect.prototype[k]
}
MixShader.prototype.type = 'lucy-compose.MixShader'

const sha_setup = ShaderEffect.prototype.setup

MixShader.prototype.setup = function(options, sub1, sub2) {
  let self = this

  self.uniforms.tDiffuse2 = { type: 't', value: null }

  if ( !sub || !sub2)
  { throw new Error ( 'MixShader takes two sub-scenes.' )
  }

  self.makeTarget ( 'target'  )
  self.makeTarget ( 'target2' )

  sub2.ready.then
  ( function ( s )
    { self.sub2 = s
      sha_setup.call ( self, options, sub1 )
    }
  )
}

MixShader.prototype.render = function(context, target) {
  let self = this

  // first target
  if (!self.disable_source1 || !self.disable_source1 ( context ) )
  { // Render sub-scene into our target
    self.sub.render(context, self.target)
    self.uniforms.tDiffuse.value = self.target
  }

  // second target
  if ( !self.disable_source2 || !self.disable_source2 ( context ) )
  { self.sub2.render(context, self.target2)
    self.uniforms.tDiffuse2.value = self.target2
  }

  context.setDefaultUniforms ( self.uniforms, self.renderer.camera )

  self.renderer.render ( self.scene, self.camera, target )
}

