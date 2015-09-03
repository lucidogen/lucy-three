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

  self.target2 = new THREE.WebGLRenderTarget
    ( options.w || window.innerWidth
    , options.h || window.innerHeight
    , { minFilter: THREE.LinearFilter
      , magFilter: THREE.LinearFilter
      , format: THREE.RGBFormat
      , stencilBuffer: false
      }
    )
  
  sha_setup.call(self, options, sub1, function() {
    if (sub2) {
      sub2.ready.then(function(s) {
        self.sub2 = s
        self.ready()
      })
    } else {
      self.sub2 = null
      self.ready()
    }
  })
}

MixShader.prototype.render = function(context, target) {
  let self = this

  // first target
  if (self.sub) {
    if (!self.disable_source1 || !self.disable_source1(context)) {
      // Render sub-scene into our target
      self.sub.render(context, self.target)

      // Current frame is in tDiffuse
      self.uniforms.tDiffuse.value = self.target
    }
  }

  // second target
  if (self.sub2) {
    if (!self.disable_source2 || !self.disable_source2(context)) {
      // Render sub-scene into our target
      self.sub2.render(context, self.target2)

      // Current frame is in tDiffuse
      self.uniforms.tDiffuse2.value = self.target2
    }
  }

  context.setDefaultUniforms(self.uniforms, self.renderer.camera)

  self.renderer.render(self.scene, self.camera, target)
}

