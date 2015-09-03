/*
  # Global THREE.WebGLRenderer

  The Scene TODO

*/
'use strict'
const THREE = require('three')

const WebGLRenderer = function() {
  let self = this

  let renderer = self.renderer = new THREE.WebGLRenderer(
    // This is needed to be able to grab the image and export it.
    { preserveDrawingBuffer: true
    }
  )

  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.setPixelRatio( window.devicePixelRatio )
  document.body.appendChild( renderer.domElement )

  self.domElement = renderer.domElement

  self.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 )

  self.resize = function() {
    self.camera.aspect = window.innerWidth / window.innerHeight
    self.camera.updateProjectionMatrix()
    self.renderer.setSize( window.innerWidth, window.innerHeight )
  }

  window.addEventListener( 'resize', self.resize, false )
  self.resize()
  
  self.render = function( scene, camera, renderTarget, forceClear ) {
    renderer.render( scene, camera || self.camera, renderTarget, forceClear )
  }
}

let singleton

module.exports = function() {
  if (!singleton) singleton = new WebGLRenderer()
  return singleton
}
WebGLRenderer.prototype.type = 'lucy-compose.WebGLRenderer'

