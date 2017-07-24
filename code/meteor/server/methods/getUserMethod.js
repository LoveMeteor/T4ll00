Meteor.methods({
  'getUserData': function (userNum) {
    check(userNum, String);
    var numInteger = parseInt(userNum);
    return Meteor.users.findOne({'profile.userNum': numInteger}, {fields: {'profile': 1, 'emails.address': 1}});;
  }
});