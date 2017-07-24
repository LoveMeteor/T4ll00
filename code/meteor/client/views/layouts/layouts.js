Template.registerHelper('showBottomNav', function () {
  // return true;
  return Meteor.isCordova && ($(window).width() < $(window).height());
});

Template.mainLayout.onRendered(function () {

});