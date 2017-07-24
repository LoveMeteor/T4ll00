Meteor.methods({
  sendToWorkspace: function (selectedPost, workspaceId) {
    check(selectedPost, String);
    check(workspaceId, String);
    console.log(selectedPost);
    var post = NewsFeedPosts.findOne({'_id': selectedPost}) || Referrals.findOne({_id: selectedPost});
    console.log(post);
    var workspace = Workspaces.findOne({'_id': workspaceId});

    if (post.imageUrl) {
      console.log(WorkspacePosts.insert({'permissions': 'workspace', 'content': post.content, 'imageUrl': post.imageUrl, 'workspaceId': workspaceId, 'author': Meteor.userId(), viewableBy: workspace.members}));
    } else {
      console.log(WorkspacePosts.insert({'permissions': 'workspace', 'content': post.content, 'workspaceId': workspaceId, 'author': Meteor.userId(), viewableBy: workspace.members}));
    }
    
  }
})