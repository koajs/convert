'use strict';

const co = require('co')
const assert = require('assert')
const convert = require('./index')

describe('Koa Convert', function () {
    it('should works', function (done) {
        let call = []
        let ctx = {}
        let mw = convert(function* (next) {
            assert.ok(ctx === this)
            call.push(1)
        })

        mw(ctx, function () {
            done(new Error('this should not be called'))
        }).then(function () {
            assert.deepEqual(call, [1])
            done()
        })
    })

    it('should works with `yield next`', function (done) {
        let call = []
        let ctx = {}
        let mw = convert(function* (next) {
            assert.ok(ctx === this)
            call.push(1)
            yield next
            call.push(3)
        })

        mw(ctx, function () {
            call.push(2)
            return Promise.resolve()
        }).then(function () {
            assert.deepEqual(call, [1, 2, 3])
            done()
        })
    })

    it('should works with `yield* next`', function (done) {
        let call = []
        let ctx = {}
        let mw = convert(function* (next) {
            assert.ok(ctx === this)
            call.push(1)
            yield* next
            call.push(3)
        })

        mw(ctx, function () {
            call.push(2)
            return Promise.resolve()
        }).then(function () {
            assert.deepEqual(call, [1, 2, 3])
            done()
        })
    })
})
