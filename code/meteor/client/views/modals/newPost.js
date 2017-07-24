Template.newNewsFeedPostModal.onCreated(function () {
  var self = this;
  self.subscribe('connectedUsers');

});

Template.newNewsFeedPostModal.onRendered(function () {
  // $('textarea.form-control.new-post-field').shiftenter({hint: ''});
  Deps.autorun(function (){
    Meteor.subscribe('userGroups');
  });
  autosize($('textarea.form-control.new-post-field'));
});

Template.newNewsFeedPostModal.helpers({
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
  },
  defaultValues: function() { 
    return {permissions:'public'};
  }
});

Template.newNewsFeedPostModal.events({
  'autocompleteselect textarea': function(event, template, doc) {
    console.log('tagged ', doc);
    Session.set('taggedUsers', (Session.get('taggedUsers') || []).concat(doc));
  },
  'keydown .new-post-field': function (e) {
    // if (e.which == 13 && e.shiftKey == false) {
    //   e.preventDefault();
    //   $($(e.currentTarget).parents('form.form-inline')[0]).submit();
    // }
  },
  'click #cancel-new-post-btn': function (e) {
     $('.file-upload-clear').click();
  }
});
