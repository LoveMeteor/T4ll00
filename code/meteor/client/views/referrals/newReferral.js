Template.newReferral.events({
  'keydown .new-referral-field': function (e) {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault();
      $($(e.currentTarget).parents('form.form-inline')[0]).submit();
    }
  }
});

Template.newReferral.onCreated(function () {
  var self = this;
  self.subscribe('connectedUsers');
  
});

Template.newReferral.onRendered(function () {
  // $('textarea.form-control.new-referral-field').shiftenter({hint: ''});
  autosize($('textarea.form-control.new-referral-field'));
});