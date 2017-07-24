isMobile = function () { console.log("isMobile Function");
  if (document.documentElement.clientWidth < 768) {
    return true;
  }
  return false;
}

Template.leftSidebar.helpers({
  isAdmin: function() {
    return Meteor.user().emails[0].address === 'george@talloo.com';
  }
});
Template.leftSidebar.events({
  'click #logout': function () {
    Meteor.logout(function(err){console.log("=========== logout ============", err);
      setCookie('talloo.mobileNumber', undefined, 0);
      setCookie('talloo.memberId', undefined, 0);

      location.href = "/";
    });
  },
  'click .side-menu-item': function () {
    console.log("Clicked side menu item");
    if(isMobile())
      $("#wrapper").removeClass("toggled");
  }
});
