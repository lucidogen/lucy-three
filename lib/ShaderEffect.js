/*
  # ShaderEffect extends Scene

  A lucy-compose Scene for glsl shader effect transformation of texture content.

*/
'use strict'
const Scene = require ( 'lucy-compose' ).Scene
const THREE = require ( 'three' )
const WebGLRenderer = require ( './WebGLRenderer' )

const DEFAULT = {}

const ShaderEffect = function ( options )
{ options = options || {}
  let self = this
  Scene.call ( self, options )

  self.uniforms = options.uniforms || {}
  self.uniforms.tDiffuse = { type: 't', value: null }

  self.material =
  new THREE.ShaderMaterial
  ( { uniforms:       self.uniforms
    , vertexShader:   options.vertexShader   || DEFAULT.VERT
    , fragmentShader: options.fragmentShader || DEFAULT.FRAG
    }
  )

  self.quad = new THREE.Mesh
  ( new THREE.PlaneBufferGeometry ( 2, 2 ), null )

  self.quad.material = self.material

  self.scene = new THREE.Scene
  self.scene.add ( self.quad )
}

module.exports = ShaderEffect

// Inherit from Scene
for(let k in Scene.prototype) {
  ShaderEffect.prototype [ k ] = Scene.prototype [ k ]
}

ShaderEffect.prototype.type = 'lucy-compose.ShaderEffect'

ShaderEffect.prototype.makeTarget = function ( name, opts )
{ let self = this
  opts = opts || {}
  let tdef =
  { minFilter: opts.minFilter || THREE.LinearFilter
  , magFilter: opts.magFilter || THREE.LinearFilter
  , format:    opts.format    || THREE.RGBFormat
  , stencilBuffer:
    opts.stencilBuffer == undefined ? false : opts.stencilBuffer
  }

  let fname = 'makeTarget' + name
  if ( ! self [ fname ] )
  { self.renderer.onResize
    ( function ( w, h ) { self [ fname ] ( w, h ) } )
  }

  self [ fname ] = function ( w, h )
  { let t = self [ name ]
    if ( t ) t.dispose ()

    self [ name ] = new THREE.WebGLRenderTarget
    ( w
    , h
    , { minFilter: THREE.LinearFilter
      , magFilter: THREE.LinearFilter
      , format: THREE.RGBFormat
      , stencilBuffer: false
      }
    )
  }

  self [ fname ] ( window.innerWidth, window.innerHeight )
  return self [ name ]
}

ShaderEffect.prototype.setup = function ( options, sub )
{ let self = this

  if ( options.configureDefaultUniforms ) {
    options.configureDefaultUniforms ( self.uniforms )
  }

  // lazy loading
  self.renderer = WebGLRenderer()


  if ( sub )
  { self.makeTarget ( 'target' )

    sub.ready.then
    ( function ( s )
      { self.sub = s
        self.ready()
      }
    )
  }
  else
  { self.sub = null
    self.ready()
  }
}

ShaderEffect.prototype.render = function ( context, target )
{ let self = this

  if ( self.sub )
  { // Render sub-scene into our target
    self.sub.render ( context, self.target )

    // Copy target into our tDiffuse texture
    self.uniforms.tDiffuse.value = self.target
  }

  context.setDefaultUniforms
  ( self.uniforms, self.camera || self.renderer.camera )

  // Render our effect
  if ( self.animate )
  { self.animate ( context )
  }

  self.renderer.render
  ( self.scene, self.camera, target )
}

ShaderEffect.prototype.stop = function ( context )
{
  // noop
}

DEFAULT.VERT = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

DEFAULT.FRAG = `
uniform sampler2D tDiffuse;
varying vec2 vUv;

void main() {
  vec4 color = texture2D( tDiffuse, vUv );
  gl_FragColor = color;
}


`
