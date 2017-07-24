Meteor.publish('messages', function () {
  // check(workspaceId, String);
  // check(limit, Number);
  // Meteor._sleepForMs(000);
  return Messages.find({$or: [{author: this.userId}, {recipient: this.userId}]});
});