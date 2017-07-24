Push.debug = true;

Push.allow({
  send: function (userId, notification) {
    return true; // Allow all users to send
  }
  // send: function () {
  //   return true; // Allow all users to send
  // }
});

Meteor.methods({
  serverNotification: function (text, title) {
    check(text, String);
    check(title, String);
    var badge = 1
    Push.send({
      from: 'push',
      title: title,
      text: text,
      badge: badge,
      sound: 'airhorn.caf',
      payload: {
        title: title,
        text: text
      },
      query: {
        // send to all users
      }
    });
  },
  userNotification: function (text, title, userId) {
    check(text, String);
    check(title, String);
    check(userId, String);
    var badge = 1
    Push.send({
      from: 'push',
      title: title,
      text: text,
      badge: badge,
      sound: 'airhorn.caf',
      payload: {
        title: title
      },
      query: {
        userId: userId //this will send to a specific Meteor.user()._id
      }
    });
  }
});
