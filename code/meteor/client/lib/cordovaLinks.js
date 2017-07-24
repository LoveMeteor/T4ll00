isUrl = function (path) {
  return path.indexOf('://') >= 0;
};

// SRC: https://forums.meteor.com/t/open-links-outside-the-app/4538/12
Meteor.startup(function() {
  var platform;
  if (!Meteor.isCordova) {
    return;
  }
  platform = device.platform.toLowerCase();
  return $(document).on('deviceready', function() {
    return $(document).on('click', function(e) {
      console.log('clicked in cordova', e, e.currentTarget);
      var $link, url;
      $link = $(e.target).closest('a[href]');
      console.log('link', $link);
      if (!($link.length > 0)) {
        return;
      }
      url = $link.attr('href');
      console.log('url', url);
      if (!isUrl(url)) {
        console.log('not a url tho');
        return;
      }
      switch (platform) {
        case 'ios':
          console.log('ios open');
          window.open(url, '_system');
          break;
        case 'android':
          navigator.app.loadUrl(url, {
            openExternal: true
          });
      }
      return e.preventDefault();
    });
  });
});