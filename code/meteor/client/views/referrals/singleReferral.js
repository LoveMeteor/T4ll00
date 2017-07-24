Template.singleReferral.helpers({
  referral: function () {
    var referral = Referrals.findOne(FlowRouter.getParam('id'));
    return referral;
  }
});

Template.singleReferral.events({

});
