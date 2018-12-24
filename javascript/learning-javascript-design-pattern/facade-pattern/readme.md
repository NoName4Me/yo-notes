# Facade Pattern

将很多接口（或功能）简化/封装后暴露出来，类似 jQuery 的 $.ready 以及一些 pollyfill 封装。

**注意** 封装后的接口可能会存在性能问题，需要权衡便利性和性能开销。

```js
// jQuery $.ready
bindReady: function() {
    ...
    if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
 
      // A fallback to window.onload, that will always work
      window.addEventListener( "load", jQuery.ready, false );
 
    // If IE event model is used
    } else if ( document.attachEvent ) {
 
      document.attachEvent( "onreadystatechange", DOMContentLoaded );
 
      // A fallback to window.onload, that will always work
      window.attachEvent( "onload", jQuery.ready );
               ...
```


```js
// polyfill addEventListener
var addMyEvent = function( el,ev,fn ) {
  if( el.addEventListener ) {
    el.addEventListener( ev,fn, false );
  } else if(el.attachEvent) {
    el.attachEvent( "on" + ev, fn );
  } else {
    el["on" + ev] = fn;
  }
};
```