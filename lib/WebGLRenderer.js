/*
  # Global THREE.WebGLRenderer

  The Scene TODO

*/
'use strict'
const THREE = require('three')

const WebGLRenderer = function ()
{ let self = this

  let renderer = self.renderer = new THREE.WebGLRenderer
  ( // This is needed to be able to grab the image and export it.
    { preserveDrawingBuffer: true
    }
  )

  renderer.setSize ( window.innerWidth, window.innerHeight )

  renderer.setPixelRatio ( window.devicePixelRatio )

  document.body.appendChild ( renderer.domElement )

  self.domElement = renderer.domElement

  self.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 )

  let resizeCallbacks = self.resizeCallbacks = []
  window.addEventListener
  ( 'resize'
  , function ()
    { let w = window.innerWidth,
          h = window.innerHeight
      for ( let i = 0, len = resizeCallbacks.length; i < len; i++ )
      { resizeCallbacks [ i ] ( w, h )
      }
    }
  , false
  )

  let resizeCam = function ( w, h )
  { self.camera.aspect = w / h
    self.camera.updateProjectionMatrix ()
    self.renderer.setSize ( w, h )
  }
  self.onResize ( resizeCam )
  resizeCam ( window.innerWidth, window.innerHeight )
  
  // Uncomment if we want to throw errors, not just display them
  // THREE.error = function ( msg )
  // { console.log.apply ( console, arguments )
  //   throw new Error ( msg ) 
  // }

  self.render = function ( scene, camera, renderTarget, forceClear )
  { renderer.render
    ( scene, camera || self.camera, renderTarget, forceClear )
  }
}
WebGLRenderer.prototype.type = 'lucy-compose.WebGLRenderer'

WebGLRenderer.prototype.onResize = function ( clbk )
{ this.resizeCallbacks.push ( clbk )
}


let singleton

module.exports = function() {
  if ( ! singleton )
  { singleton = new WebGLRenderer ()
  }
  return singleton
}

