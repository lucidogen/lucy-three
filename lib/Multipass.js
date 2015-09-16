/*
 * For the port to lucy-three / lucy-compose, we need:
 
 */
'use strict'
const ShaderEffect  = require ( './ShaderEffect'  )
const WebGLRenderer = require ( './WebGLRenderer' )
const THREE         = require ( 'three'           )

const Multipass = function ( options )
{ ShaderEffect.call ( this, options )
}
module.exports = Multipass

const DEFAULT = {}

// Inherit from ShaderEffect
for ( let k in ShaderEffect.prototype )
{ Multipass.prototype [ k ] = ShaderEffect.prototype [ k ]
}
Multipass.prototype.type = 'lucy-compose.Multipass'

const sha_setup = ShaderEffect.prototype.setup

Multipass.prototype.setup = function ( options, sub )
{ let self = this
  self.passCount = options.passCount || 2

  self.renderer = WebGLRenderer ()

  if ( !sub )
  { throw new Error ( 'Multipass needs a sub-scene.' )
  }

  self.material.fragmentShader = DEFAULT.FRAG
  self.material.needsUpdate    = true

  self.makeTarget ( 'target'  )
  self.makeTarget ( 'target2' )
  self.makeTarget ( 'target3' )

  self.uniforms.tBase = { type: 't', value: self.target }
  self.uniforms.uPass = { type: 'i', value: 0    }

  sha_setup.call ( self, options, sub )
}

Multipass.prototype.render = function(context, target)
{ let self = this

  context.setDefaultUniforms ( self.uniforms, self.renderer.camera )

  // render sub scene in tDiffuse
  self.sub.render ( context, self.target )
   
  let renderer = self.renderer
  let scene    = self.scene

  self.uniforms.tBase.value    = self.target
  self.uniforms.tDiffuse.value = self.target

  for ( let pass = 0, len = self.passCount; pass < len; pass++ )
  { self.uniforms.uPass.value = pass
    if ( pass == len - 1 )
    { // final pass
      renderer.render ( scene, null, target )
    }
    else
    { renderer.render ( scene, null, self.target2 )
      // prepare for next pass
      self.uniforms.tDiffuse.value = self.target2
      // swap
      let tmp = self.target2
      self.target2 = self.target3
      self.target3 = tmp
    }
  }
}

DEFAULT.FRAG = `
uniform sampler2D tDiffuse;
uniform sampler2D tBase;
uniform int uPass;

const int KERNEL_SIZE = 10;
const highp float KERNEL_SIZE_FLOAT = float ( KERNEL_SIZE );
const highp float KERNEL_EXTENT = 0.01;
const vec2 incX = vec2 ( 2.0 * KERNEL_EXTENT / KERNEL_SIZE_FLOAT, 0.0 );
const vec2 incY = vec2 ( 0.0, 2.0 * KERNEL_EXTENT / KERNEL_SIZE_FLOAT );

varying vec2 vUv;

void main ()
{ 
  highp vec2 inc = incX;

  if ( uPass == 1 )
  { // blur Y
    inc = incY;
  }
  highp vec4 color;
  highp vec2 pos = vUv - inc * KERNEL_SIZE_FLOAT / 2.0;
  for ( int i = 0; i < KERNEL_SIZE / 2; i++ )
  { pos += inc;
    color += texture2D
    ( tDiffuse
    , pos
    );
    pos += inc;
    color += texture2D
    ( tDiffuse
    , pos
    );
  }
  color = color / KERNEL_SIZE_FLOAT;
  color = sin ( color );
  gl_FragColor = max(color, texture2D ( tBase, vUv ));
}
`

/*
	buildKernel: function ( sigma ) {

		// We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.

		function gauss( x, sigma ) {

			return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );

		}

		var i, values, sum, halfWidth, kMaxKernelSize = 25, kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;

		if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;
		halfWidth = ( kernelSize - 1 ) * 0.5;

		values = new Array( kernelSize );
		sum = 0.0;
		for ( i = 0; i < kernelSize; ++ i ) {

			values[ i ] = gauss( i - halfWidth, sigma );
			sum += values[ i ];

		}

		// normalize the kernel

		for ( i = 0; i < kernelSize; ++ i ) values[ i ] /= sum;

		return values;

	}
*/
