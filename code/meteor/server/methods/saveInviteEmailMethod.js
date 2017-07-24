Meteor.methods({
  saveInviteEmail: function (email) {
    inviteEmails.insert({emailAddress: email});
  }
});