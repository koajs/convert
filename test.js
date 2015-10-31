/* global describe, it */

'use strict'

const co = require('co')
const assert = require('assert')
const convert = require('./index')

describe('convert()', () => {
  it('should works', () => {
    let call = []
    let ctx = {}
    let mw = convert(function * (next) {
      assert.ok(ctx === this)
      call.push(1)
    })

    return mw(ctx, function () {
      call.push(2)
    }).then(function () {
      assert.deepEqual(call, [1])
    })
  })

  it('should works with `yield next`', () => {
    let call = []
    let ctx = {}
    let mw = convert(function * (next) {
      assert.ok(ctx === this)
      call.push(1)
      yield next
      call.push(3)
    })

    return mw(ctx, function () {
      call.push(2)
      return Promise.resolve()
    }).then(function () {
      assert.deepEqual(call, [1, 2, 3])
    })
  })

  it('should works with `yield* next`', () => {
    let call = []
    let ctx = {}
    let mw = convert(function * (next) {
      assert.ok(ctx === this)
      call.push(1)
      yield* next
      call.push(3)
    })

    return mw(ctx, function () {
      call.push(2)
      return Promise.resolve()
    }).then(function () {
      assert.deepEqual(call, [1, 2, 3])
    })
  })
})

describe('convert.compose()', () => {
  it('should works', () => {
    let call = []
    let context = {}
    let _context
    let mw = convert.compose([
      function * name (next) {
        call.push(1)
        yield next
        call.push(11)
      },
      (ctx, next) => {
        call.push(2)
        return next().then(() => {
          call.push(10)
        })
      },
      function * (next) {
        call.push(3)
        yield* next
        call.push(9)
      },
      co.wrap(function * (ctx, next) {
        call.push(4)
        yield next()
        call.push(8)
      }),
      function * (next) {
        try {
          call.push(5)
          yield next
        } catch (e) {
          call.push(7)
        }
      },
      (ctx, next) => {
        _context = ctx
        call.push(6)
        throw new Error()
      }
    ])

    return mw(context).then(() => {
      assert.equal(context, _context)
      assert.deepEqual(call, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
    })
  })

  it('should works too', () => {
    let call = []
    let context = {}
    let _context
    let mw = convert.compose(
      (ctx, next) => {
        call.push(1)
        return next().catch(() => {
          call.push(4)
        })
      },
      function * (next) {
        call.push(2)
        yield next
        call.push(-1) // should not call this
      },
      function * (next) {
        call.push(3)
        yield* next
        call.push(-1) // should not call this
      },
      (ctx, next) => {
        _context = ctx
        return Promise.reject(new Error())
      }
    )

    return mw(context).then(() => {
      assert.equal(context, _context)
      assert.deepEqual(call, [1, 2, 3, 4])
    })
  })
})
