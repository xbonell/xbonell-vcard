require('./modernizr-custom');
require('svgxuse');

var gsap = require('gsap/dist/gsap').gsap;

document.addEventListener('DOMContentLoaded', function () {
  var tl = gsap.timeline();
  var logo = document.querySelector('[role="banner"]');
  var copyright = document.querySelector('[role="contentinfo"]');
  var sections = document.querySelectorAll('main > section, .hcard, .description, main > section[class] > *');

  tl.from(logo, { duration: 1, x: 100, opacity: 0, ease: "back" })
    .from(copyright, { duration: 1, y: 20, opacity: 0, ease: "easeOut" })
    .from(sections, {
      duration: 1,
      scale: 0,
      x: -150,
      opacity: 0,
      height: 0,
      stagger: .2,
      delay: 1,
      ease: "easeIn",
      transformOrigin: "center top"
    });
});

