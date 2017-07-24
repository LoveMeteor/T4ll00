Template.singlePost.helpers({
  post: function () {
    var post = NewsFeedPosts.findOne({removed: false, permissions: 'public', _id: FlowRouter.getParam('id')});
    if (post) {
      Meteor.subscribe('newsFeedPostComments', [post._id]);
      Meteor.subscribe('publicUserData', [post.author]);
      return post;
    }
  }
});

Template.singlePost.events({
  'click .share-post-btn': function (e) {
    e.preventDefault();
    Session.set('sharePostId', e.currentTarget.id);
    $('#share-post-modal').modal('show');
  },
  'focusin .comment-field': function (e) {
    autosize($(e.currentTarget));
    Session.set($(e.currentTarget).parents('form.form-inline')[0].id, true);
  },
  'autocompleteselect textarea': function(event, template, doc) {
    console.log('tagged ', doc);
    Session.set('taggedUsers', (Session.get('taggedUsers') || []).concat(doc));
  },
  'keydown .comment-field': function (e) {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault();
      $($(e.currentTarget).parents('form.form-inline')[0]).submit();
    }
  },
  'click .heart-btn': function (e, t) {
    e.preventDefault();
    if (NewsFeedPosts.findOne(e.currentTarget.id) && NewsFeedPosts.findOne(e.currentTarget.id).likedBy.indexOf(Meteor.userId()) < 0) {
      Meteor.call('addLikeToPost', e.currentTarget.id);
    } else {
        Meteor.call('removeLikeFromPost', e.currentTarget.id);
    }
  },
})