/* Cinematic motion pass layered onto the existing site script. */
(function(){
  'use strict';
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)return;
  var items=document.querySelectorAll('.reveal');
  if(!items.length)return;
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  items.forEach(function(el){observer.observe(el)});
})();
