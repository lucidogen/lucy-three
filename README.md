# Lucy Three [![Build Status](https://travis-ci.org/lucidogen/lucy-three.svg)](https://travis-ci.org/lucidogen/lucy-three)

Part of [lucidity](http://lucidity.io) project.

## THREE.js scene composition tool

Compose complexe scenes by writing simple composition functions with support for
live (shader) coding.

Asynchronous scene loading and setup uses promises and ensures that scenes down
the graph hierarchy are entirely loaded before they are inserted in parent
objects through the call to `setup`.

First declare sources by specifying a folder.

  ```js
  const compose = require ( 'lucy-compose' )

  const fx = compose.load ( 'fx' )

  // expects fx/cube/index.js or fx/cube.js to exist
  fx ( 'cube' )

  // same scene but with some additional options (these are passed right through
  // to the scene's "setup" function).
  fx
  ( 'cube'
  , { distance: 5.0, extent: 1.0 }
  )
  ```

Compose with postprocessing effect.

  ```js
  fx
  ( 'blur'
  , { radius: 0.3 }
  , fx ( 'cube' )
  )
  ```

Transition between 'cube' and 'sphere' scenes using a 'fade' effect.
  ```js
  const trans = compose.load ( '../common/trans' )

  fx
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

Look at the examples in 'examples' to get an idea of Scene definition.

## Installation

  ```shell
  npm install lucy-three --save
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
