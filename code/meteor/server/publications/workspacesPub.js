Meteor.publish('activeWorkspaces', function (limit) {
  check(limit, Number);
  check(this.userId, String);
  return Workspaces.find({$or: [{members: this.userId}, {ownerId: this.userId}], archived: false}, {sort: {createdAt: -1}});
  // return Workspaces.find();
});

Meteor.publish('archivedWorkspaces', function (limit) {
  check(limit, Number);
  check(this.userId, String);
  return Workspaces.find({ownerId: this.userId, archived: true});
});

Meteor.publish('workspaces', function (limit) {
  check(limit, Number);
  check(this.userId, String);
  return Workspaces.find({$or: [{members: this.userId}, {ownerId: this.userId}]});
});

Meteor.publish('singleWorkspace', function (workspaceId) {
  check(workspaceId, String);
  check(this.userId, String);
  return Workspaces.find({_id: workspaceId});
});