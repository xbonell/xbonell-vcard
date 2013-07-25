Modernizr.load([
  {
    test : Modernizr.fontface,
    yep : '//use.typekit.net/jrc2ary.js',
    complete : function() {
      try { Typekit.load(); } catch(e) {};
    }
  },
  {
    load : (document.location.protocol === 'https:' ? '//ssl' : 'http://www') + '.google-analytics.com/ga.js',
    complete : function() {
      _gaq.push(['_setAccount', 'UA-26762647-1'], ['_setDomainName', 'xbonell.com'], ['_trackPageview']);
    }    
  }
]);