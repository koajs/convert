'use strict'

const co = require('co')
const compose = require('koa-compose')

module.exports = convert

function convert (mw) {
  if (typeof mw !== 'function') {
    throw new TypeError('middleware must be a function')
  }
  if (mw.constructor.name === 'GeneratorFunction') {
    return function (ctx, next) {
      return co.call(ctx, mw.call(ctx, createGenerator(next)))
    }
  } else {
    // assume it's Promise-based middleware
    return mw
  }
}

// convert.compose(mw, mw, mw)
// convert.compose([mw, mw, mw])
convert.compose = function (arr) {
  if (!Array.isArray(arr)) {
    arr = Array.from(arguments)
  }
  return compose(arr.map(convert))
}

function * createGenerator (next) {
  return yield next()
}
