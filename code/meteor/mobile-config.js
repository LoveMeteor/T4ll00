App.info({
  id: 'com.talloo.Talloo',
  name: 'Talloo',
  version: '1.2',
  description: 'Talloo Sales Network',
  author: 'Talloo LLC',
  email: 'help@talloo.com',
  website: 'http://www.talloo.com'
});


App.icons({
  'iphone_2x': 'resources/icons/icon-60@2x.png',
  'iphone_3x': 'resources/icons/icon-60@3x.png',
  'ipad': 'resources/icons/icon-76.png',
  'ipad_2x': 'resources/icons/icon-76@2x.png',
  //'ipad_pro': 'resources/icons/icon-167.png',
  //'ios_settings': 'resources/icons/icon-29.png',
  //'ios_settings_2x': 'resources/icons/icon-29@2x.png',
  //'ios_settings_3x': 'resources/icons/icon-29@3x.png',
  //'ios_spotlight': 'resources/icons/icon-40.png',
  //'ios_spotlight_2x': 'resources/icons/icon-40@2x.png',
  // 'android_mdpi': 'resources/icons/icon-48.png',
  // 'android_hdpi': 'resources/icons/icon-72.png',
  // 'android_xhdpi': 'resources/icons/icon-96.png',
  // 'android_xxhdpi': 'resources/icons/icon-144.png',
  // 'android_xxxhdpi': 'resources/icons/icon-192.png'
});

App.launchScreens({
  'iphone_2x': 'resources/splash/640x960.png',
  'iphone5': 'resources/splash/640x1136.png',
  'iphone6': 'resources/splash/750x1334.png',
  'iphone6p_portrait': 'resources/splash/1242x2208.png',
  //'iphone6p_landscape': 'resources/splashes/splash-2208x1242.png',
  'ipad_portrait': 'resources/splash/768x1024.png',
  'ipad_portrait_2x': 'resources/splash/1536x2048.png',
  //'ipad_landscape': 'resources/splashes/splash-1024x768.png',
  //'ipad_landscape_2x': 'resources/splashes/splash-2048x1536.png',
  // 'android_ldpi_portrait': 'resources/splashes/splash-640x960.png',
  // 'android_ldpi_landscape': 'resources/splashes/splash-640x960.png',
  // 'android_mdpi_portrait': 'resources/splashes/splash-320x480.png',
  // 'android_mdpi_landscape': 'resources/splashes/splash-480x320.png',
  // 'android_hdpi_portrait': 'resources/splashes/splash-480x640.png',
  // 'android_hdpi_landscape': 'resources/splashes/splash-640x480.png',
  // 'android_xhdpi_portrait': 'resources/splashes/splash-720x960.png',
  // 'android_xhdpi_landscape': 'resources/splashes/splash-960x720.png',
  // 'android_xxhdpi_portrait': 'resources/splashes/splash-1080x1440.png',
  // 'android_xxhdpi_landscape': 'resources/splashes/splash-1440x1080.png'
});

//App.setPreference('Orientation', 'default');
//App.setPreference('Orientation', 'all', 'ios');

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
  , '*.talloo.com'
];

trusted.forEach(function (origin, index, array) {
  origin = 'https://' + origin;
  App.accessRule(origin);
});

trusted.forEach(function (origin, index, array) {
  origin = 'http://' + origin;
  App.accessRule(origin);
});

// App.accessRule('https://app.talloo.com');

// App.accessRule("blob:*"); // android bugfix
