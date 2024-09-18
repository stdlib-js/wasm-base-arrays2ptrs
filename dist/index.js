"use strict";var p=function(s,a){return function(){return a||s((a={exports:{}}).exports,a),a.exports}};var f=p(function(c,o){
var u=require('@stdlib/object-assign/dist'),v=require('@stdlib/ndarray-base-bytes-per-element/dist'),y=require('@stdlib/strided-base-write-dataview/dist').ndarray;function l(s,a){var E,i,r,e,n,t;for(i=[],n=0,t=0;t<a.length;t++)e=a[t],r=u({},e),r.BYTES_PER_ELEMENT=v(e.wdtype),r.nbytes=e.length*r.BYTES_PER_ELEMENT,s.isView(e.data)?(r.ptr=e.data.byteOffset,r.copy=!1):(r.ptr=-1,r.copy=!0,n+=r.nbytes),i.push(r);for(n>0&&s.realloc(n),E=0,t=0;t<i.length;t++)e=i[t],e.copy&&(y(e.length,e.data,e.stride,e.offset,s.view,e.BYTES_PER_ELEMENT,E,!0),e.ptr=E,e.stride=1,e.offset=0,E+=e.nbytes);return i}o.exports=l
});var d=f();module.exports=d;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
