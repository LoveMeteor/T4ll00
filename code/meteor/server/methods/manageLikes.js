Meteor.methods({
  addLikeToPost: function (postId) {
    check(postId, String);
    check(this.userId, String);
    var author = NewsFeedPosts.findOne(postId).author;
    Meteor.call('newNotification', 'like', [author], postId);
    NewsFeedPosts.update(postId, {$addToSet: {likedBy: this.userId}});
  },
  removeLikeFromPost: function (postId) {
    check(postId, String);
    check(this.userId, String);
    NewsFeedPosts.update(postId, {$pull: {likedBy: this.userId}});
  }
})