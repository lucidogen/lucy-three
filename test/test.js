'use strict'

require ( 'chai' )
.should ()
const lthree  = require ( '../index' )

const MixShader       = require ( '../lib/MixShader'       )
const RecursiveShader = require ( '../lib/RecursiveShader' )
const ShaderEffect    = require ( '../lib/ShaderEffect'    )
const Anaglyph        = require ( '../lib/Anaglyph'        )
const Multipass       = require ( '../lib/Multipass'       )
const WebGLRenderer   = require ( '../lib/WebGLRenderer'   )

describe
( 'lucy-three'
, function ()
  { it
    ( 'should load modules'
    , function ()
      { lthree
        .should.deep.equal
        ( { MixShader
          , RecursiveShader
          , ShaderEffect
          , Anaglyph
          , Multipass
          , WebGLRenderer
          }
        )
      }
    )
  }
)


