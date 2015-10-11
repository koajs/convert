
# koa-convert

Convert koa generator-based middleware to promise-based middleware.

## Installation

```
$ npm install koa-convert
```

## Related Issues

* koa [#415](https://github.com/koajs/koa/issues/415)
* koa-compose [#27](https://github.com/koajs/compose/pull/27)

## Usage

```js
//
// convert a generator-based middleware to promise-based middleware
//
let promiseBased = convert(function* generatorBased(next) {
    yield next
    // or
    // yield* next
})

//
// convert array of middleware
//
let mws = [
    // will convert it to promise-based middleware
    function* generatorMW (next) {
        yield next
    },
    // will convert it to promise-based middleware
    function* generatorMW(next) {
        yield* next
    },
    // return itself if it's not generator-based middleware
    function (ctx, next) {
        return next()
    },
    // return itself if it's not generator-based middleware
    async function (ctx, next) {
        await next()
    },
].map(convert)
```

## License

MIT
