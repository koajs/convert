'use strict';

const co = require('co')

module.exports = convert

function convert(mw) {
    if (typeof mw !== 'function') {
        throw new TypeError(mw + ' is not function')
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

function* createGenerator(next) {
    return yield next()
}
