Template.editNewsFeedPost.helpers({
  newsFeedPostDoc: function () {
    if (Session.get('editPostId')) {
      var doc = NewsFeedPosts.findOne(Session.get('editPostId'));
      if (doc && doc.content) {
        doc.content = deLinkify(doc.content);
      }
      return doc;
    } else {
      $('#edit-post-modal').modal('hide');
    }
  },
  customPermissions: function () {
    if (AutoForm.getFieldValue('permissions')) {
      return AutoForm.getFieldValue('permissions') === 'custom';
    }
    return false;
  },
  networkPermissions: function () {
    if (AutoForm.getFieldValue('permissions')) {
      return AutoForm.getFieldValue('permissions') === 'networks';
    }
    return false;
  }
});

Template.editNewsFeedPost.events({
  'keydown .edit-post-field': function (e) {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault();
      $($(e.currentTarget).parents('form.form-inline')[0]).submit();
    }
  },
  'click #cancel-edit-post-btn': function () {
    // $('.file-upload-clear').click();
  }
});

Template.editNewsFeedPost.onRendered(function () {
  Deps.autorun(function (){
    Meteor.subscribe('userGroups');
  });
  autosize($('textarea.form-control.edit-post-field'));
});