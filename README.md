# Lucy Compose [![Build Status](https://travis-ci.org/lucidogen/lucy-compose.svg)](https://travis-ci.org/lucidogen/lucy-compose)

Part of [lucidity](http://lucidity.io) project.

## Agnostic scene composition tool

Compose complexe scenes by writing simple composition functions. The
framework has some Scene sub-classes to work with THREE.js but it can be used
to compose about anything (see tests for examples). This whole library is just a
convenient way to load 'effects', call `setup` on them and `render` with support
for live coding and async loading.

Asynchronous scene loading and setup uses promises and ensures that scenes down
the graph hierarchy are entirely loaded before they are inserted in parent
objects through the call to `setup`.

First declare sources by specifying a folder.

  ```js
  const compose = require ( 'lucy-compose' )

  const fx    = compose.load ( 'fx'         )
  const scene = compose.load ( 'scene'      )
  const trans = compose.load ( '../somelib/transition' )
  ```

Compose a view from a single scene.

  ```js
  // expects scene/cube.js or scene/cube/index.js to exist
  scene ( 'cube' )

  // same scene but with some additional options (these are passed right through
  // to the scene's "setup" function).
  scene
  ( 'cube'
  , { distance: 5.0, extent: 1.0 }
  )
  ```

Compose with postprocessing effect.

  ```js
  fx
  ( 'blur'
  , { radius: 0.3 }
  , scene ( 'cube' )
  )
  ```

Transition between 'cube' and 'sphere' scenes using a 'fade' effect.
  ```js
  trans
  ( 'fade'
  , { position: 0.3 }
  , fx
    ( 'blur'
    , { radius: 0.8 }
    , scene ( 'cube' )
    )
  , scene ( 'sphere' )
  )
  ```

## Scene API

In order to be composed, scenes should implement the following methods:

   * **setup ( options [, sub scenes ] )**
       Should return a scene. Called once on scene composition.
       It is up to what makes most sense in the project to create a new
       scene on each setup or to use a singleton, keeping state stable on
       composition changes.

   * **scene.render ( context [, target ] )**
       Render the scene, optionally targetting the provided
       target object. Called on each frame. The context is passed down the scene
       hierarchy and can be anything. Usually, this is an object containing
       globa state information (time, uniforms, etc).

Look at the helpers for THREE.js 'lib/MixShader', 'lib/ShaderEffect' or at the
fixtures in 'test/fixtures/scenes/bing' to get an idea of Scene definition.

## Installation

  ```shell
  npm install lucy-compose --save
  ```

## Tests

  ```shell
   npm test
  ```

## Contributing

Please use ['jessy style'](http://github.com/lucidogen/jessy).

Add unit tests for any new or changed functionality.

## Release History

* 0.1.0 (2015-09-03) Initial release
