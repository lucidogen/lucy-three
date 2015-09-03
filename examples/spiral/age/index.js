/* 
 * # Aging filter
 *
 */
'use strict'
const RecursiveShader = require('lucy-compose').RecursiveShader
const THREE = require('three')
const live  = require('lucy-live')

if (!exports.loaded) {
  // Not executed on code reload
  module.exports = new RecursiveShader
}
const self = module.exports

live.read('./vert.glsl', function(s) {
  self.material.vertexShader = s
  self.material.needsUpdate  = true
})

live.read('./frag.glsl', function(s) {
  self.material.fragmentShader = s
  self.material.needsUpdate    = true
})
