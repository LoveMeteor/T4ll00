Meteor.methods({
  addWorkspaceToUsers: function (workspaceId, members) {
    check(workspaceId, String);
    check(members, Array);
    Meteor.users.update({'_id': {$in: members}}, {$addToSet: {'workspaces': workspaceId}});
  },
  leaveWorkspace: function (workspaceId) {
    check(workspaceId, String);
    check(Meteor.userId(), String);
    var aWorkspace = Workspaces.findOne(workspaceId);
    if (aWorkspace.ownerId === Meteor.userId()) {
      Workspaces.update(workspaceId, {$set: {archived: true}});
    } else {
      WorkspacePosts.insert({permissions: 'workspace', content: '<p class="inline-notifications-soft">..... left the group .....</p>', workspaceId: workspaceId});
      Workspaces.update(workspaceId, {$pull: {members: Meteor.userId()}});
    }
  },
  markRead: function (workspacePostId) {
    check(workspacePostId, String);
    check(Meteor.userId(), String);
    WorkspacePosts.update({_id: workspacePostId}, {$addToSet: {viewedBy: Meteor.userId()}});
  }
});