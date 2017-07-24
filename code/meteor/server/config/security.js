BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

var trusted = [
  '*.googleapis.com'
  , '*.gstatic.com'
  , 'www.google-analytics.com'
  , '*.bootstrapcdn.com'
  , 'placehold.it'
  , '*.imgix.net'
  , 'code.ionicframework.com'
  , '*.amazon.com'
  , 'talloo.imgix.net'
  , '*.amazonaws.com'
];

trusted.forEach(function (origin, index, array) {
  origin = 'https://' + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});

trusted.forEach(function (origin, index, array) {
  origin = 'http://' + origin;
  BrowserPolicy.content.allowOriginForAll(origin);
});

// BrowserPolicy.content.allowOriginForAll('http://*.googleapis.com');
// BrowserPolicy.content.allowOriginForAll('http://*.gstatic.com');