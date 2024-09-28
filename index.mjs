// Copyright (c) 2024 The Stdlib Authors. License is Apache-2.0: http://www.apache.org/licenses/LICENSE-2.0
/// <reference types="./index.d.ts" />
import t from"https://cdn.jsdelivr.net/gh/stdlib-js/object-assign@v0.2.2-esm/index.mjs";import e from"https://cdn.jsdelivr.net/gh/stdlib-js/ndarray-base-bytes-per-element@v0.2.2-esm/index.mjs";import{ndarray as s}from"https://cdn.jsdelivr.net/gh/stdlib-js/strided-base-write-dataview@esm/index.mjs";function r(r,d){var i,n,a,o,p,E;for(n=[],p=0,E=0;E<d.length;E++)o=d[E],(a=t({},o)).BYTES_PER_ELEMENT=e(o.wdtype),a.nbytes=o.length*a.BYTES_PER_ELEMENT,r.isView(o.data)?(a.ptr=o.data.byteOffset,a.copy=!1):(a.ptr=-1,a.copy=!0,p+=a.nbytes),n.push(a);for(p>0&&r.realloc(p),i=0,E=0;E<n.length;E++)(o=n[E]).copy&&(s(o.length,o.data,o.stride,o.offset,r.view,o.BYTES_PER_ELEMENT,i,!0),o.ptr=i,o.stride=1,o.offset=0,i+=o.nbytes);return n}export{r as default};
//# sourceMappingURL=index.mjs.map
