/*
  # Agnostic scene composition for Lucidity

*/
'use strict'
const ShaderEffect    = require('./lib/ShaderEffect')
const RecursiveShader = require('./lib/RecursiveShader')
const MixShader       = require('./lib/MixShader')
const Anaglyph        = require('./lib/Anaglyph')
const WebGLRenderer   = require('./lib/WebGLRenderer')

module.exports =
{ ShaderEffect
, RecursiveShader
, MixShader
, Anaglyph
, WebGLRenderer
}
