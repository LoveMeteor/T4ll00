Template.newNetworkModal.onCreated(function () {
  var self = this;

});

Template.newNetworkModal.onRendered(function () {
  // $('textarea.form-control.new-post-field').shiftenter({hint: ''});
  Deps.autorun(function (){
    Meteor.subscribe('userGroups');
  });

});

Template.newNetworkModal.helpers({
});

Template.newNetworkModal.events({
  
});
