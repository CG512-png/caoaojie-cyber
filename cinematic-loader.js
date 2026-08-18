/* Loads the cinematic visual layer without touching the original page content. */
(function(){
  var head=document.head;
  var css=document.createElement('link');
  css.rel='stylesheet';
  css.href='cinematic.css?v=1';
  head.appendChild(css);
  var core=document.createElement('script');
  core.src='effects-core.js?v=1';
  core.defer=false;
  document.body.appendChild(core);
})();
