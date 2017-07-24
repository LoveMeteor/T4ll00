Template.notifications.onCreated(function (){
Meteor.subscribe('profileData');
Meteor.subscribe('allUsers');
});

Template.notifications.helpers({
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

Template.notifications.events({
  'click .dismiss-notice': function (e, t) {
    Meteor.call('dismissNotification', this.actionItemId);
  }
});