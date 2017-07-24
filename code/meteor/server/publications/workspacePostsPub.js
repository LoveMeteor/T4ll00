Meteor.publish('workspacePosts', function (workspaceId, limit) {
  check(workspaceId, String);
  check(limit, Number);
  // return WorkspacePosts.find({members: {$elemMatch: {userId: this.userId}}, archived: {$ne: true}});
  // var workspace = Workspaces.findOne({_id: workspaceId, members: {$elemMatch: {userId: this.userId}}});
  if (Workspaces.findOne(workspaceId).ownerId === this.userId || Workspaces.findOne(workspaceId).members.indexOf(this.userId) > -1) {
    return WorkspacePosts.find({workspaceId: workspaceId, $or: [{viewableBy: this.userId}, {permissions: 'workspace'}]}, {sort: {createdAt: -1}, limit: limit});
  }
  // return workspacePosts.find();
});