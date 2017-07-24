Template.pinned.helpers({
  pinnedPosts: function () {
    var posts = NewsFeedPosts.find({_id: {$in: Meteor.user().pinned}, removed: false}, {sort: {createdAt: -1}});
    var noposts = NewsFeedPosts.find({_id: {$in: Meteor.user().pinned}, removed: true}, {sort: {createdAt: -1}});
    if (posts) {
      Meteor.subscribe('newsFeedPostComments', _.pluck(posts.fetch(), '_id'));
      Meteor.subscribe('publicUserData', _.pluck(posts.fetch(), 'author'));
      return posts;
    };
    } 
});



Template.pinned.events({
  'click .un-pin': function (e) {
    e.preventDefault();
    console.log('unpin');
    Meteor.call('removePin', e.currentTarget.id);
    // TODO: call back with user feedback
  },
  'click .send-workspace-post-btn': function (e) {
    e.preventDefault();
    Session.set('selectedPost', e.currentTarget.id);
    $('#send-workspace-modal').modal('show');
    // NewsFeedPosts.update(e.currentTarget.id, {$set: {removed: true}});
  },
  'keydown .comment-field': function (e) {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault();
      $($(e.currentTarget).parents('form.form-inline')[0]).submit();
    }
  }
})

Template.pinned.events({
  'click .heart-btn': function (e, t) {
    e.preventDefault();
    if (NewsFeedPosts.findOne(e.currentTarget.id) && NewsFeedPosts.findOne(e.currentTarget.id).likedBy.indexOf(Meteor.userId()) < 0) {
      Meteor.call('addLikeToPost', e.currentTarget.id);
    } else {
      swal({
        title: "Are you sure?",
        text: "Are you sure you want to un-like this post?",
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: true
      }, function () {
        Meteor.call('removeLikeFromPost', e.currentTarget.id);
      });
    }
  },
  'click .remove-post-btn': function (e) {
    e.preventDefault();
    NewsFeedPosts.update(e.currentTarget.id, {$set: {removed: true}});
  },
  'click .edit-post-btn': function (e) {
    e.preventDefault();
    Session.set('editPostId', e.currentTarget.id);
    $('#edit-post-modal').modal('show');
    Meteor.setTimeout(function () { autosize.update($('textarea')); }, 256);
  },
  'click .edit-post-comment-btn': function (e) {
    e.preventDefault();
    Session.set('editPostCommentId', e.currentTarget.id);
    console.log('new edit commment id', e.currentTarget.id);
    $('#edit-post-comment-modal').modal('show');
    Meteor.setTimeout(function () { autosize.update($('textarea')); }, 256);
  },
  'click .send-workspace-post-btn': function (e) {
    e.preventDefault();
    Session.set('selectedPost', e.currentTarget.id);
    $('#send-workspace-modal').modal('show');
    // NewsFeedPosts.update(e.currentTarget.id, {$set: {removed: true}});
  },
  'click .remind-post-btn': function (e) {
    e.preventDefault();
    Session.set('postId', e.currentTarget.id);
    $('#new-reminder-modal').modal('show');
  },
  'click .pin-post-btn': function (e) {
    e.preventDefault();
    Meteor.call('addPin', e.currentTarget.id);
    // TODO: call back with user feedback
  },
  'click .unpin-post-btn': function (e,t) {
    e.preventDefault();
    console.log('unpin');
    Meteor.call('removePin', e.currentTarget.id);
  },
  'click .share-post-btn': function (e) {
    e.preventDefault();
    Session.set('sharePostId', e.currentTarget.id);
    $('#share-post-modal').modal('show');
  },
  'click #people-post-btn': function (e) {
    e.preventDefault();
  },
  // 'blur input[type="text"][name="content"]': function (e) {
  //   if (!$(e.currentTarget).val()) {
  //     Session.set($(e.currentTarget).parents('form.form-inline')[0].id, false);
  //   }
  // },
  'focusin .comment-field': function (e) {
    // $(e.currentTarget).shiftenter({hint: ''});
    autosize($(e.currentTarget));
    // $('.file-upload-clear').click();
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
  'click .report-post-btn': function (e) {
    e.preventDefault();
    swal({
      title: "Are you sure you want to report this?",
      text: '<p>Please confirm this is not compliant with <a target="_blank" href="https://talloo.zendesk.com/hc/en-us/articles/205888256-Abuse-Desk">our policy</a></p>',
      type: "",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "#FF0000",
      confirmButtonText: "Report",
      closeOnConfirm: false 
    }, function() {
      ReportedPosts.insert({reporter: Meteor.userId(), post: e.currentTarget.id});
      swal("Success", "This post has been reported", "success"); 
    });
  }
});