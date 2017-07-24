Template.topNav.onCreated(function (){
Meteor.subscribe('profileData');
Meteor.subscribe('allUsers');
});

Template.topNav.helpers({
  notifications: function () {
    var notices = Meteor.user().notifications;
    var filteredNotices = _.filter(notices, function(obj) {
      return obj.createdAt < Date.now();
    });
    return _.sortBy(filteredNotices, 'createdAt').reverse();
    // return [{link: '', user: '', text: 'George Seybold requested to connect.', read: false}];
  },
  userImage: function (userId) {
    return Meteor.users.findOne({_id: userId}).profile.profileImage;
  },
  direct: function () {
    if (this.direct === true) {
      return true;
    } else {
      return false;
    }
  }
});

Template.topNav.events({
  'click .dismiss-notice': function (e, t) {
    Meteor.call('dismissNotification', this.actionItemId);
  }
});


Template.leftSidebar.helpers({
  'notifications': function () {
    var notices = Meteor.user().notifications;
    var filteredNotices = _.filter(notices, function(obj) {
      return obj.createdAt < Date.now();
    });
    var results = _.sortBy(filteredNotices, 'createdAt').reverse();
    if (results) {
      return results.length;
    } else {
      return false;
    }
  }
})









Template.topNav.events({
  'click .navbar-toggle': function (e) {
    e.preventDefault();
    $('#wrapper').toggleClass('toggled');
    $('.navbar-toggle').toggleClass('toggled');
  },
  'click #notifications': function (e) {
    location.href = '/notifications';
  }
});

Template.topNav.onRendered(function () {
  Session.set('currentWidth', $(window).width());
  Session.set('previousWidth', Session.get('currentWidth'));
  if (window.innerWidth < 768) {
    $('#wrapper').toggleClass('toggled');
  }
  $(window).resize(function(evt) {
    Session.set('previousWidth', Session.get('currentWidth'));
    Session.set('currentWidth', $(window).width());
  });
});

Template.topNav.helpers({
  resized: function () {
    var prev = Session.get('previousWidth');
    var cur = Session.get('currentWidth');
    if (prev === cur) {
      return;
    } else if (cur < prev) {
      if (cur < 768 && prev < 768) {
        return;
      } else if (cur >= 768) {
        return;
      } else if (cur < 768 && prev >= 768) {
        $('#wrapper').toggleClass('toggled');
      } else {
        // swal('warning: unhandled resize case. currentWidth is less than previousWidth. previousWidth: ' + prev + ' currentWidth: ' + cur);
      }
    } else if (cur > prev) {
      if (cur < 768) {
        return;
      } else if (cur >= 768 && prev >= 768) {
        return;
      } else if (cur >= 768 && prev < 768) {
        $('#wrapper').toggleClass('toggled');
      } else {
        // swal('warning: unhandled resize case. currentWidth is greater than previousWidth. previousWidth: ' + prev + ' currentWidth: ' + cur);
      }
    } else {
      // swal('warning: something weird in resizing happened. previousWidth: ' + prev + ' currentWidth: ' + cur);
    }
  },
  notificationCount: function () {
    if (Meteor.user()) {
      var notices = Meteor.user().notifications;
      var filteredNotices = _.filter(notices, function(obj) {
        return obj.createdAt < Date.now();
      });
      return filteredNotices.length
    } else {
      return 0;
    }
    
  }
});