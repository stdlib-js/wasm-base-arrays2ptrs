<!--

@license Apache-2.0

Copyright (c) 2024 The Stdlib Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

-->


<details>
  <summary>
    About stdlib...
  </summary>
  <p>We believe in a future in which the web is a preferred environment for numerical computation. To help realize this future, we've built stdlib. stdlib is a standard library, with an emphasis on numerical and scientific computation, written in JavaScript (and C) for execution in browsers and in Node.js.</p>
  <p>The library is fully decomposable, being architected in such a way that you can swap out and mix and match APIs and functionality to cater to your exact preferences and use cases.</p>
  <p>When you use stdlib, you can be absolutely certain that you are using the most thorough, rigorous, well-written, studied, documented, tested, measured, and high-quality code out there.</p>
  <p>To join us in bringing numerical computing to the web, get started by checking us out on <a href="https://github.com/stdlib-js/stdlib">GitHub</a>, and please consider <a href="https://opencollective.com/stdlib">financially supporting stdlib</a>. We greatly appreciate your continued support!</p>
</details>

# arrays2ptrs

[![NPM version][npm-image]][npm-url] [![Build Status][test-image]][test-url] [![Coverage Status][coverage-image]][coverage-url] <!-- [![dependencies][dependencies-image]][dependencies-url] -->

> Convert a list of arrays to "pointers" (i.e., byte offsets) in WebAssembly [module memory][@stdlib/wasm/memory].

<!-- Section to include introductory text. Make sure to keep an empty line after the intro `section` element and another before the `/section` close. -->

<section class="intro">

</section>

<!-- /.intro -->

<!-- Package usage documentation. -->



<section class="usage">

## Usage

```javascript
import arrays2ptrs from 'https://cdn.jsdelivr.net/gh/stdlib-js/wasm-base-arrays2ptrs@deno/mod.js';
```

#### arrays2ptrs( ctx, arrays )

Converts a list of arrays to "pointers" (i.e., byte offsets) in WebAssembly [module memory][@stdlib/wasm/memory].

```javascript
import defineProperty from 'https://cdn.jsdelivr.net/gh/stdlib-js/utils-define-property@deno/mod.js';
import ArrayBuffer from 'https://cdn.jsdelivr.net/gh/stdlib-js/array-buffer@deno/mod.js';
import DataView from 'https://cdn.jsdelivr.net/gh/stdlib-js/array-dataview@deno/mod.js';

var buf = new ArrayBuffer( 64*1024 ); // 64KiB

function isView( arr ) {
    return ( arr.buffer === buf );
}

function realloc( nbytes ) {
    buf = new ArrayBuffer( nbytes );
}

function view() {
    return new DataView( buf );
}

var ctx = {
    'isView': isView,
    'realloc': realloc
};

defineProperty( ctx, 'view', {
    'configurable': false,
    'enumerable': true,
    'get': view
});

// ...

var xobj = {
    'dtype': 'generic',
    'wdtype': 'float64',
    'length': 2,
    'data': [ 1.0, 2.0 ],
    'stride': 1,
    'offset': 0
};
var yobj = {
    'dtype': 'generic',
    'wdtype': 'float64',
    'length': 2,
    'data': [ 3.0, 4.0 ],
    'stride': 1,
    'offset': 0
};

// ...

var ptrs = arrays2ptrs( ctx, [ xobj, yobj ] );
// returns [...]
```

Each element in the list of input arrays should have the following properties:

-   **dtype**: array [data type][@stdlib/array/dtypes].
-   **wdtype**: WebAssembly [array data type][@stdlib/wasm/base/array2dtype].
-   **length**: number of indexed elements.
-   **data**: original array-like object.
-   **stride**: index increment.
-   **offset**: index offset.

In addition to each element's existing properties, each element of the returned array has the following additional properties:

-   **BYTES_PER_ELEMENT**: number of bytes per element.
-   **ptr**: byte offset.
-   **nbytes**: number of bytes consumed by **indexed** array elements as stored in module memory.
-   **copy**: boolean indicating whether an array had to be copied to module memory.

</section>

<!-- /.usage -->

<!-- Package usage notes. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="notes">

## Notes

-   Beware that this function may reallocate module memory, resulting in [`ArrayBuffer`][@stdlib/array/buffer] detachment and the invalidation of any typed array views which were views of the previously allocated memory. Additionally, this function may write to module memory and does so without regard for any existing memory content. Users are thus encouraged to take suitable precautions (e.g., copying results out of module memory prior to subsequent invocation) in order to avoid unexpected results.
-   If an array's data is copied to module memory, the data is copied to a contiguous segment of module memory, and the respective array object in the returned array will have unit stride and an offset of zero.

</section>

<!-- /.notes -->

<!-- Package usage examples. -->

<section class="examples">

## Examples

<!-- eslint-disable no-restricted-syntax, no-invalid-this -->

<!-- eslint no-undef: "error" -->

```javascript
import setReadOnlyAccessor from 'https://cdn.jsdelivr.net/gh/stdlib-js/utils-define-nonenumerable-read-only-accessor@deno/mod.js';
import setReadOnly from 'https://cdn.jsdelivr.net/gh/stdlib-js/utils-define-nonenumerable-read-only-property@deno/mod.js';
import ArrayBuffer from 'https://cdn.jsdelivr.net/gh/stdlib-js/array-buffer@deno/mod.js';
import DataView from 'https://cdn.jsdelivr.net/gh/stdlib-js/array-dataview@deno/mod.js';
import Float64Array from 'https://cdn.jsdelivr.net/gh/stdlib-js/array-float64@deno/mod.js';
import dtype2wasm from 'https://cdn.jsdelivr.net/gh/stdlib-js/wasm-base-dtype2wasm@deno/mod.js';
import arrays2ptrs from 'https://cdn.jsdelivr.net/gh/stdlib-js/wasm-base-arrays2ptrs@deno/mod.js';

function Context() {
    this._buffer = new ArrayBuffer( 100 );
    return this;
}

setReadOnly( Context.prototype, 'isView', function isView( arr ) {
    return ( arr.buffer ) ? ( arr.buffer === this._buffer ) : false;
});

setReadOnly( Context.prototype, 'realloc', function realloc( nbytes ) {
    this._buffer = new ArrayBuffer( nbytes );
});

setReadOnlyAccessor( Context.prototype, 'view', function getter() {
    return new DataView( this._buffer );
});

// ...

var ctx = new Context();

// ...

var x = new Float64Array( 4 );
var y = new Float64Array( 4 );

// ...

var xobj = {
    'dtype': 'float64',
    'wdtype': dtype2wasm( 'float64' ),
    'length': x.length,
    'data': x,
    'stride': 1,
    'offset': 0
};

var yobj = {
    'dtype': 'float64',
    'wdtype': dtype2wasm( 'float64' ),
    'length': y.length,
    'data': y,
    'stride': 1,
    'offset': 0
};

var out = arrays2ptrs( ctx, [ xobj, yobj ] );
// returns [...]

console.log( out );
```

</section>

<!-- /.examples -->

<!-- Section to include cited references. If references are included, add a horizontal rule *before* the section. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="references">

</section>

<!-- /.references -->

<!-- Section for related `stdlib` packages. Do not manually edit this section, as it is automatically populated. -->

<section class="related">

</section>

<!-- /.related -->

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->


<section class="main-repo" >

* * *

## Notice

This package is part of [stdlib][stdlib], a standard library with an emphasis on numerical and scientific computing. The library provides a collection of robust, high performance libraries for mathematics, statistics, streams, utilities, and more.

For more information on the project, filing bug reports and feature requests, and guidance on how to develop [stdlib][stdlib], see the main project [repository][stdlib].

#### Community

[![Chat][chat-image]][chat-url]

---

## License

See [LICENSE][stdlib-license].


## Copyright

Copyright &copy; 2016-2024. The Stdlib [Authors][stdlib-authors].

</section>

<!-- /.stdlib -->

<!-- Section for all links. Make sure to keep an empty line after the `section` element and another before the `/section` close. -->

<section class="links">

[npm-image]: http://img.shields.io/npm/v/@stdlib/wasm-base-arrays2ptrs.svg
[npm-url]: https://npmjs.org/package/@stdlib/wasm-base-arrays2ptrs

[test-image]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/actions/workflows/test.yml/badge.svg?branch=main
[test-url]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/actions/workflows/test.yml?query=branch:main

[coverage-image]: https://img.shields.io/codecov/c/github/stdlib-js/wasm-base-arrays2ptrs/main.svg
[coverage-url]: https://codecov.io/github/stdlib-js/wasm-base-arrays2ptrs?branch=main

<!--

[dependencies-image]: https://img.shields.io/david/stdlib-js/wasm-base-arrays2ptrs.svg
[dependencies-url]: https://david-dm.org/stdlib-js/wasm-base-arrays2ptrs/main

-->

[chat-image]: https://img.shields.io/gitter/room/stdlib-js/stdlib.svg
[chat-url]: https://app.gitter.im/#/room/#stdlib-js_stdlib:gitter.im

[stdlib]: https://github.com/stdlib-js/stdlib

[stdlib-authors]: https://github.com/stdlib-js/stdlib/graphs/contributors

[umd]: https://github.com/umdjs/umd
[es-module]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules

[deno-url]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/tree/deno
[deno-readme]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/blob/deno/README.md
[umd-url]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/tree/umd
[umd-readme]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/blob/umd/README.md
[esm-url]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/tree/esm
[esm-readme]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/blob/esm/README.md
[branches-url]: https://github.com/stdlib-js/wasm-base-arrays2ptrs/blob/main/branches.md

[stdlib-license]: https://raw.githubusercontent.com/stdlib-js/wasm-base-arrays2ptrs/main/LICENSE

[@stdlib/wasm/memory]: https://github.com/stdlib-js/wasm-memory/tree/deno

[@stdlib/wasm/base/array2dtype]: https://github.com/stdlib-js/wasm-base-array2dtype/tree/deno

[@stdlib/array/dtypes]: https://github.com/stdlib-js/array-dtypes/tree/deno

[@stdlib/array/buffer]: https://github.com/stdlib-js/array-buffer/tree/deno

</section>

<!-- /.links -->
