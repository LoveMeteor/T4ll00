Template.newReminderModal.onRendered(function () {
  Session.set('chosenTime', false);
});


Template.newReminderModal.helpers({

});


Template.newReminderModal.events({
  'click ul.dropdown-menu li a': function (e) {
    e.preventDefault();
    var reminderTime = parseInt(e.currentTarget.id);
    console.log(reminderTime);
    Meteor.call('newNotification', 'newsFeedReminder', [Meteor.user()._id], Session.get('postId'), reminderTime);
    $('#new-reminder-modal').modal('hide');
  }
});


Template.sendToWorkspace.onCreated(function (){
  Meteor.subscribe('activeWorkspaces', 64);
});

Template.sendToWorkspace.helpers({
  workspaces: function () {
    return Workspaces.find({});
  }
});

Template.sendToWorkspace.events({
  'click ul.dropdown-menu li a': function (e) {
    e.preventDefault();
    // Pass selected Post, and Workspace ID.
    Meteor.call('sendToWorkspace', Session.get('selectedPost'), e.currentTarget.id);
    $('#send-workspace-modal').modal('hide');
  }
});


Template.deactivateConfirm.events({
  'click #confirm': function () {
    Meteor.call('deactivateAccount');
    Meteor.logout();
    location.href = '/login';
  },
  'click #cancel': function () {
    $('#deactivate-modal').modal('hide');
  }
});