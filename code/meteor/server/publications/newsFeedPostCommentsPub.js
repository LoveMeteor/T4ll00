Meteor.publish('newsFeedPostComments', function (postIds) {
  // check(limit, Number);
  check(postIds, Array);
  return NewsFeedPostComments.find({newsFeedPost: {$in: postIds}}, {sort: {createdAt: -1}});
});