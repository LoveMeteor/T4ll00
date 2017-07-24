Meteor.methods({
  getUserProfileData: function (userId) {
      console.log("========== For Speed Test ========== getUserProfileData Started", new Date());
    check(userId, String);
    var user = Meteor.users.findOne({'_id': userId});
      console.log("========== For Speed Test ========== getUserProfileData Got User", new Date());
    var connectedUsers = user.connections.connected;
    if (connectedUsers.indexOf(this.userId) > -1) {
      var userData =  Meteor.users.findOne({_id: userId}, {fields: {'profile': 1, 'emails': 1, 'connections': 1, 'status': 1, 'settings': 1}});
        console.log("========== For Speed Test ========== getUserProfileData Got User Data", new Date());
        return userData;
    } else {
       var userData = Meteor.users.findOne({'_id': userId}, {fields: {'profile': 1, 'emails': 1, 'connections': 1, 'status': 1, 'settings': 1}});
        console.log("========== For Speed Test ========== getUserProfileData Got User Data", new Date());
       if (userData.settings.emailPublic === false) {
        userData.emails = [];
       }
       if (userData.settings.phonePublic === false) {
        userData.profile.phoneNumber = '';
       }
       if (userData.settings.addressPublic === false) {
        userData.profile.streetAddress = '';
        userData.profile.city = '';
        userData.profile.state = '';
        userData.profile.zip = '';
       }
       return userData;
    }
  }
});