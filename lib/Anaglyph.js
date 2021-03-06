/**
 * @author mrdoob / http://mrdoob.com/
 * @author marklundin / http://mark-lundin.com/
 * @author alteredq / http://alteredqualia.com/
 * @author gaspard / http://lucidogen.io (adaptation for lucy-three)
 */
'use strict'
const THREE         = require ( 'three'           )
const WebGLRenderer = require ( './WebGLRenderer' )

module.exports = function ( opts ) {
  opts = opts || {}
  let renderer = WebGLRenderer ()
  let width    = window.innerWidth
  let height   = window.innerHeight

	let eyeRight = new THREE.Matrix4 ()
	let eyeLeft  = new THREE.Matrix4 ()
	let focalLength = opts.focalLength || 15
	let _aspect, _near, _far, _fov

	let _cameraL = new THREE.PerspectiveCamera ()
	_cameraL.matrixAutoUpdate = false

	let _cameraR = new THREE.PerspectiveCamera ()
	_cameraR.matrixAutoUpdate = false

	var _scene = new THREE.Scene();

	var _params = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };

	var _renderTargetL = new THREE.WebGLRenderTarget( width, height, _params );
	var _renderTargetR = new THREE.WebGLRenderTarget( width, height, _params );

	var _material = new THREE.ShaderMaterial( {

		uniforms: {

			"mapLeft": { type: "t", value: _renderTargetL },
			"mapRight": { type: "t", value: _renderTargetR }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

			"	vUv = vec2( uv.x, uv.y );",
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D mapLeft;",
			"uniform sampler2D mapRight;",
			"varying vec2 vUv;",

			"void main() {",

			"	vec4 colorL, colorR;",
			"	vec2 uv = vUv;",

			"	colorL = texture2D( mapLeft, uv );",
			"	colorR = texture2D( mapRight, uv );",

				// http://3dtv.at/Knowhow/AnaglyphComparison_en.aspx

			"	gl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;",

			"}"

		].join("\n")

	} );

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), _material );
	_scene.add( mesh );

	this.setSize = function ( w, h) {

		if ( _renderTargetL ) _renderTargetL.dispose();
		if ( _renderTargetR ) _renderTargetR.dispose();
		_renderTargetL = new THREE.WebGLRenderTarget( w, h, _params );
		_renderTargetR = new THREE.WebGLRenderTarget( w, h, _params );

		_material.uniforms[ "mapLeft" ].value = _renderTargetL;
		_material.uniforms[ "mapRight" ].value = _renderTargetR;
	};

  renderer.onResize ( this.setSize )
  this.setSize ( window.innerWidth, window.innerHeight )

  let setupCamera = function ( camera )
  { if ( camera.parent === undefined ) camera.updateMatrixWorld();

		var hasCameraChanged = ( _aspect !== camera.aspect ) || ( _near !== camera.near ) || ( _far !== camera.far ) || ( _fov !== camera.fov );

		if ( hasCameraChanged ) {

			_aspect = camera.aspect;
			_near = camera.near;
			_far = camera.far;
			_fov = camera.fov;

			var projectionMatrix = camera.projectionMatrix.clone();
			var eyeSep = focalLength / 30 * 0.5;
			var eyeSepOnProjection = eyeSep * _near / focalLength;
			var ymax = _near * Math.tan( THREE.Math.degToRad( _fov * 0.5 ) );
			var xmin, xmax;

			// translate xOffset

			eyeRight.elements[12] = eyeSep;
			eyeLeft.elements[12] = -eyeSep;

			// for left eye

			xmin = -ymax * _aspect + eyeSepOnProjection;
			xmax = ymax * _aspect + eyeSepOnProjection;

			projectionMatrix.elements[0] = 2 * _near / ( xmax - xmin );
			projectionMatrix.elements[8] = ( xmax + xmin ) / ( xmax - xmin );

			_cameraL.projectionMatrix.copy( projectionMatrix );

			// for right eye

			xmin = -ymax * _aspect - eyeSepOnProjection;
			xmax = ymax * _aspect - eyeSepOnProjection;

			projectionMatrix.elements[0] = 2 * _near / ( xmax - xmin );
			projectionMatrix.elements[8] = ( xmax + xmin ) / ( xmax - xmin );

			_cameraR.projectionMatrix.copy( projectionMatrix );

		}

		_cameraL.matrixWorld.copy( camera.matrixWorld ).multiply( eyeLeft );
		_cameraL.position.copy( camera.position );
		_cameraL.near = camera.near;
		_cameraL.far = camera.far;

		_cameraR.matrixWorld.copy( camera.matrixWorld ).multiply( eyeRight );
		_cameraR.position.copy( camera.position );
		_cameraR.near = camera.near;
		_cameraR.far = camera.far;
	}

	/*
	 * Renderer now uses an asymmetric perspective projection
	 * (http://paulbourke.net/stereographics/stereorender/).
	 *
	 * Each camera is offset by the eye seperation and its projection matrix is
	 * also skewed asymetrically back to converge on the same projection plane.
	 * Added a focal length parameter to, this is where the parallax is equal to 0.
	 */
	this.render = function ( scene, camera, target )
  { setupCamera ( camera )

    scene.updateMatrixWorld()

		renderer.render( scene, _cameraL, _renderTargetL, true )

		renderer.render( scene, _cameraR, _renderTargetR, true )

		renderer.render( _scene, null, target )
  }
  this.renderStereo = this.render

	let renderLeft = function ( scene, camera, target )
  { setupCamera ( camera )
    scene.updateMatrixWorld()
		renderer.render( scene, _cameraL, target, true )
  }

	let renderRight = function ( scene, camera, target )
  { setupCamera ( camera )
    scene.updateMatrixWorld()
		renderer.render( scene, _cameraR, target, true )
  }

  let self = this

  this.renderComposition = function ( context, target )
  { context.renderer = self
    let sub = self.sub

    // LEFT
    self.render = renderLeft
    sub.render ( context, _renderTargetL )

    // RIGHT
    self.render = renderRight
    sub.render ( context, _renderTargetR )

    // MERGE
		renderer.render ( _scene, null, target )

    // cleanup
    context.renderer = null
  }

	this.dispose = function() {
		if ( _renderTargetL ) _renderTargetL.dispose();
		if ( _renderTargetR ) _renderTargetR.dispose();
	}

};
