Meteor.publish('singleUserData', function (userId) {
  check(userId, String);
  if (userId) {
    return Meteor.users.find({_id: userId}, {fields: {'connections': 1}});
  } else {
    this.ready();
  }
});

Meteor.publish('publicUserData', function (userIds) {
  check(userIds, Array);
  return Meteor.users.find({_id: {$in: userIds}}, {fields: {'profile': 1}});
});

Meteor.publish('managedUsers', function () {
  if (this.userId) {
      var user = Meteor.users.findOne({_id: this.userId});
      if(user.emails[0].address == 'george@talloo.com')
        return Meteor.users.find({}, {fields: {'profile': 1, 'metadata': 1, 'emails': 1, 'connections': 1, 'status': 1}});
  }

    this.ready();
});

Meteor.publish('allUsers', function () {
  if (this.userId) {
    return Meteor.users.find({}, {fields: {'profile': 1, 'metadata': 1, 'emails': 1, 'connections': 1, 'status': 1}});
  } else {
    this.ready();
  }
});

// Meteor.publish('linkedUsers', function () {
//   if (this.userId) {
//     return // Connected, Followers, Following
//   } else {
//     this.ready();
//   }
// });


Meteor.publish('workspaceUsers', function () {
  if (this.userId) {
   var userWorkSpaces = Meteor.users.findOne({_id: this.userId}).workspaces
   var workSpaces = Workspaces.find({_id: {$in: userWorkSpaces}});
   var workspaceUsers = [];
   workSpaces.forEach(function (workspace){
    workspaceUsers.push(workspace.members);
  });
   var returnUsers = _.uniq(_.flatten(workspaceUsers));
   return Meteor.users.find({_id: {$in: returnUsers}}, {'profile': 1, 'emails': 1, 'connections': 1});
 } else {
  this.ready();
 }
});

Meteor.publish('connectedUsers', function () {
  if (this.userId) {
    var userIds = Meteor.users.findOne({_id: this.userId}).connections.connected;
    return Meteor.users.find({_id: {$in: userIds}}, {'profile': 1, 'emails': 1, 'connections': 1});
  } else {
    this.ready();
  }
});

// Meteor.methods({
//   'testMethod': function () {
//    var userWorkSpaces = Meteor.users.findOne({_id: this.userId}).workspaces
//    var workSpaces = Workspaces.find({_id: {$in: userWorkSpaces}});
//    var workspaceUsers = [];
//    workSpaces.forEach(function (workspace){
//     workspaceUsers.push(workspace.members);
//   });
//    var returnUsers = _.uniq(_.flatten(workspaceUsers));
//    var data = Meteor.users.find({_id: {$in: returnUsers}}, {'profile': 1, 'emails': 1, 'connections': 1}).fetch();
//    console.log(data);
   
//  }
// });