// STARTUP CODE
Meteor.startup(function () {
  // SET THE INTERVAL JOB ID FIRST, THIS UPDATES STUFF LIKE TIME SINCE. MAY BE USED ANYWERE REACTIVITY IS NEEDED ON THE CLIENT
  var intervalJobId = Meteor.setInterval(function () { Session.set('updater', new Date()); }, 8192);
  // Session.set('intervalJobId', intervalJobId);

  // GOOGLE ANALYTICS
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-75114884-1', 'auto');
  ga('send', 'pageview');
});


// Template.afSlingshot2.replaces("afSlingshot");

Session.setDefault('taggedUsers', []);