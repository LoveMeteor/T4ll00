Meteor.methods({
  addPin: function (postId) {
    check(postId, String);
    check(Meteor.userId(), String);
    if (Meteor.users.findOne({'_id': Meteor.userId()}).pinned) {
      Meteor.users.update(Meteor.userId(), {$addToSet: {pinned: postId}});
    } else {
      Meteor.users.update(Meteor.userId(), {$set: {pinned: [postId]}});
    }
  },
  removePin: function (postId) {
    check(postId, String);
    check(Meteor.userId(), String);
    Meteor.users.update(Meteor.userId(), {$pull: {pinned: postId}});
  }
});