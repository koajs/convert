
# koa-convert

[![npm version](https://img.shields.io/npm/v/koa-convert.svg)](https://npmjs.org/package/koa-convert)
[![build status](https://travis-ci.org/gyson/koa-convert.svg)](https://travis-ci.org/gyson/koa-convert)

Convert koa legacy ( 0.x & 1.x ) generator middleware to modern promise middleware ( 2.x ).

## Installation

```
$ npm install koa-convert
```

## Usage

```js
const Koa = require('koa') // koa v2.x
const convert = require('koa-convert')
const app = new Koa()

app.use(modernMiddleware)

app.use(convert(legacyMiddleware))

app.use(convert.compose(legacyMiddleware, modernMiddleware))

function * legacyMiddleware (next) {
  // before
  yield next
  // after
}

function modernMiddleware (ctx, next) {
  // before
  return next().then(() => {
    // after
  })
}
```

## Distinguish legacy and modern middleware

In koa 0.x and 1.x ( without experimental flag ), `app.use` has an assertion that all ( legacy ) middleware must be generator function and it's tested with `fn.constructor.name == 'GeneratorFunction'` at [here](https://github.com/koajs/koa/blob/7fe29d92f1e826d9ce36029e1b9263b94cba8a7c/lib/application.js#L105).

Therefore, we can distinguish legacy and modern middleware with `fn.constructor.name == 'GeneratorFunction'`.

## Migration

`app.use(legacyMiddleware)` is everywhere in 0.x and 1.x and it would be painful to manually change all of them to `app.use(convert(legacyMiddleware))`.

You can use following snippet to make migration easier.

```js
const _use = app.use
app.use = x => _use.call(app, convert(x))
```

The above snippet will override `app.use` method and implicitly convert all legacy generator middleware to modern promise middleware.

Therefore, you can have both `app.use(modernMiddleware)` and `app.use(legacyMiddleware)` and your 0.x or 1.x should work without modification.

Complete example:

```js
const Koa = require('koa') // v2.x
const convert = require('koa-convert')
const app = new Koa()

// ---------- override app.use method ----------

const _use = app.use
app.use = x => _use.call(app, convert(x))

// ---------- end ----------

app.use(modernMiddleware)

// this will be converted to modern promise middleware implicitly
app.use(legacyMiddleware)

function * legacyMiddleware (next) {
  // before
  yield next
  // after
}

function modernMiddleware (ctx, next) {
  // before
  return next().then(() => {
    // after
  })
}
```

## API

#### `convert()`

Convert legacy generator middleware to modern promise middleware

```js
app.use(convert(legacyMiddleware))
```

#### `convert.compose()`

Convert and compose multiple middleware (could mix legacy and modern ones) and return modern promise middleware

```js
app.use(convert.compose(legacyMiddleware, modernMiddleware))
// or
app.use(convert.compose([legacyMiddleware, modernMiddleware]))
```

## License

MIT
