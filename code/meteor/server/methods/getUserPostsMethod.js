Meteor.methods({
  'getUserPosts': function (userId) {
    check(userId, String);
    if (this.userId) {
      var posts = NewsFeedPosts.find({author: userId, permissions: 'public'}, {limit: 5, sort:{createdAt:-1}}).fetch();
      console.log(posts);
      return posts;
    } else {
      return [];
    }
  }
})
