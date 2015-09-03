'use strict'
const fx  = require('lucy-compose').load('.')

module.exports = 
fx('sobel'
, fx('age'
  , fx('spiral')
  )
)
