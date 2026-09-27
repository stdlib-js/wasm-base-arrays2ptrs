"use strict";var p=function(i,t){return function(){try{return t||i((t={exports:{}}).exports,t),t.exports}catch(s){throw (t=0, s)}};};var f=p(function(c,o){
var u=require('@stdlib/object-assign/dist'),v=require('@stdlib/ndarray-base-bytes-per-element/dist'),y=require('@stdlib/strided-base-write-dataview/dist').ndarray;function l(i,t){var s,E,r,e,n,a;for(E=[],n=0,a=0;a<t.length;a++)e=t[a],r=u({},e),r.BYTES_PER_ELEMENT=v(e.wdtype),r.nbytes=e.length*r.BYTES_PER_ELEMENT,i.isView(e.data)?(r.ptr=e.data.byteOffset,r.copy=!1):(r.ptr=-1,r.copy=!0,n+=r.nbytes),E.push(r);for(n>0&&i.realloc(n),s=0,a=0;a<E.length;a++)e=E[a],e.copy&&(y(e.length,e.data,e.stride,e.offset,i.view,e.BYTES_PER_ELEMENT,s,!0),e.ptr=s,e.stride=1,e.offset=0,s+=e.nbytes);return E}o.exports=l
});var d=f();module.exports=d;
/** @license Apache-2.0 */
//# sourceMappingURL=index.js.map
