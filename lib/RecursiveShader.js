/* 
 * # Recursive filter
 *
 */
'use strict'
const ShaderEffect  = require('./ShaderEffect')
const WebGLRenderer = require('./WebGLRenderer')
const THREE = require('three')

const copyFx = new ShaderEffect
copyFx.material.fragmentShader = `
  uniform sampler2D tDiffuse;
  varying vec2 vUv;
  void main() {
    gl_FragColor = texture2D(tDiffuse, vUv);
  }
`

const RecursiveShader = function(options) {
  ShaderEffect.call(this, options)
  this.has_image = false
  this.last_time = 0
}
module.exports = RecursiveShader
// Inherit from ShaderEffect
for(let k in ShaderEffect.prototype) {
  RecursiveShader.prototype[k] = ShaderEffect.prototype[k]
}
RecursiveShader.prototype.type = 'lucy-compose.RecursiveShader'

const sha_setup = ShaderEffect.prototype.setup

RecursiveShader.prototype.setup = function(options, sub) {
  let self = this

  self.uniforms.tLast = { type: 't', value: null }

  // FIXME: Use duplicate
  self.target2 = new THREE.WebGLRenderTarget
    ( options.w || window.innerWidth
    , options.h || window.innerHeight
    , { minFilter: THREE.LinearFilter
      , magFilter: THREE.LinearFilter
      , format: THREE.RGBFormat
      , stencilBuffer: false
      }
    )

  self.target2bis = new THREE.WebGLRenderTarget
    ( options.w || window.innerWidth
    , options.h || window.innerHeight
    , { minFilter: THREE.LinearFilter
      , magFilter: THREE.LinearFilter
      , format: THREE.RGBFormat
      , stencilBuffer: false
      }
    )
  
  sha_setup.call(self, options, sub)
}

RecursiveShader.prototype.render = function(context, target) {
  let self = this
  // This is to keep the blur during snapshot
  if (context.fx.lucy_time > self.last_time) {
    let tmp = self.target2
    self.target2 = self.target2bis
    self.target2bis  = tmp

    // first
    if (self.sub) {

      // Render sub-scene into our target
      self.sub.render(context, self.target)

      // Current frame is in tDiffuse
      self.uniforms.tDiffuse.value = self.target
    }

    context.setDefaultUniforms(self.uniforms, self.renderer.camera)

    // Render our effect to target2
    self.renderer.render(self.scene, self.camera, self.target2)
    // Copy our effect to screen or target
    copyFx.uniforms.tDiffuse.value = self.target2
    // Store last frame
    self.uniforms.tLast.value = self.target2
  }
  self.renderer.render(copyFx.scene, copyFx.camera, target)
}

