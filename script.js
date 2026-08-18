/* Loader: keep the original effects, add the cinematic visual layer. */
(function(){
  var css=document.createElement('link');css.rel='stylesheet';css.href='cinematic.css?v=2';document.head.appendChild(css);
  var core=document.createElement('script');core.src='effects-core.js?v=2';document.body.appendChild(core);
})();
