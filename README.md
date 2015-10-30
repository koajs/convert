
# koa-convert [![build status](https://travis-ci.org/gyson/koa-convert.svg)](https://travis-ci.org/gyson/koa-convert)

Convert koa legacy ( v0.x & v1.x ) generator middleware to promise middleware ( v2.x ).

## Installation

```
$ npm install koa-convert
```

## Usage

```js
const Koa = require('koa') // koa v2.x
const convert = require('koa-convert')

let app = new Koa()

app.use(convert(function* legacyMiddleware(next) {
  // before
  yield next
  // after
}))
```

## License

MIT
