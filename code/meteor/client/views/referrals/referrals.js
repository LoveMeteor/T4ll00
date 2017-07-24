Template.referrals.helpers({
  referrals: function () {
    var referrals = Referrals.find({removedBy: {$ne: Meteor.userId()}},  {sort: {createdAt: -1}});
    var users = _.uniq(_.compact(_.flatten(_.pluck(referrals.fetch(), 'from').concat(_.pluck(referrals.fetch(), 'to')))));
    Meteor.subscribe('publicUserData', users);
    return referrals;
  }
});

Template.referrals.events({
  	'click #new-referral-btn': function (e) {
		$('#new-referral-modal').modal('show');
    Meteor.setTimeout(function () {
      document.getElementsByClassName('new-referral-field')[0].focus();
    }, 512);
	},
  'click .remove-referral-btn': function (e) {
    // console.log('remove', e.currentTarget.id);
    var currentRemovedBy = Referrals.findOne({_id: e.currentTarget.id}).removedBy || [];
    Referrals.update({_id: e.currentTarget.id}, {$set: {removedBy: currentRemovedBy.concat(Meteor.userId())}})
  },
  'click .send-workspace-btn': function (e) {
    console.log('send to workspace', e.currentTarget.id);
    e.preventDefault();
    Session.set('selectedPost', e.currentTarget.id);
    $('#send-workspace-modal').modal('show');
  }
})

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