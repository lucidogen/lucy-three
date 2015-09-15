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

// ready_clbk is used by sub-classes of ShaderEffect so they can do their
// setup once this is done.
ShaderEffect.prototype.setup = function ( options, sub, ready_clbk )
{ let self = this

  if ( options.configureDefaultUniforms ) {
    options.configureDefaultUniforms ( self.uniforms )
  }

  // lazy loading
  self.renderer = WebGLRenderer()


  if ( sub )
  { if ( ! self.makeTarget )
    { self.makeTarget = function ( w, h )
      { if ( self.target ) self.target.dispose ()

        self.target = new THREE.WebGLRenderTarget
          ( w
          , h
          , { minFilter: THREE.LinearFilter
            , magFilter: THREE.LinearFilter
            , format: THREE.RGBFormat
            , stencilBuffer: false
            }
          )
      }

      // FIXME: we should find a way to remove this callback on destroy.
      self.renderer.onResize ( self.makeTarget )
    }

    self.makeTarget ( window.innerWidth, window.innerHeight )

    sub.ready.then
    ( function ( s )
      { self.sub = s
        if ( ready_clbk )
        { ready_clbk ()
        }
        else
        { self.ready()
        }
      }
    )
  }
  else
  { self.sub = null
    if ( ready_clbk )
    { ready_clbk ()
    }
    else
    { self.ready()
    }
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
