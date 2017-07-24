Meteor.publish('referrals', function () { console.log("Referrals publication");
  if (this.userId) {
    return Referrals.find({to: this.userId});
  }
});
