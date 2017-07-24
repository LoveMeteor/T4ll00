Template.editNewsFeedPostComment.helpers({
  newsFeedPostCommentDoc: function () {
    if (Session.get('editPostCommentId')) {
      var doc = NewsFeedPostComments.findOne(Session.get('editPostCommentId'));
      if (doc && doc.content) {
        doc.content = deLinkify(doc.content);
      }
      return doc;
    } else {
      $('#edit-post-comment-modal').modal('hide');
    }
  }
});

Template.editNewsFeedPostComment.events({
  'keydown .edit-post-comment-field': function (e) {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault();
      $($(e.currentTarget).parents('form.form-inline')[0]).submit();
    }
  }
});

Template.editNewsFeedPostComment.onRendered(function () {
  autosize($('textarea.form-control.edit-post-comment-field'));
});