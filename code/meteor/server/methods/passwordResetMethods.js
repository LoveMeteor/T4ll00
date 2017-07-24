Meteor.methods({
  sendPasswordReset: function (email) {
    check(email, String);
    var mailGunOptions = {
      apiKey: 'key-02b1a58e9b640cbed4b944e9bee25f4b',
      domain: 'app.talloo.com'
    };

    var user = Accounts.findUserByEmail(email);
    if (user.emails[0].address === email) {
      var userId = user._id;
      var resetId = Random.hexString(40);
      Meteor.users.update({_id: userId}, {$set: {'secure.passwordResetToken': resetId}});
      var link = '<a href="https://app.talloo.com/password-reset/' + resetId + '"> Click here to reset your password.</a>';
      var passwordResetHTML = "<html><head></head><body><br>" + link + "</body></html>";
      var tallooMail = new Mailgun(mailGunOptions);
      tallooMail.send({
       'to': user.emails[0].address,
       'from': 'hello@talloo.com',
       'html': '<html><head></head><body><h4>Hello,</h4><p>This email was sent to you because someone requested a password reset on your account.</p><p>Visit the following URL to set a new password:</p>' + link + '<p>You can do a regular login at: <a href="https://app.talloo.com">https://app.talloo.com</a></p></body></html>',
       'text': '',
       'subject': 'Talloo password reset.'
     });
    }
  },
  authorizedTokenCheck: function (token) {
    check(token, String);
    var validToken = Meteor.users.findOne({'secure.passwordResetToken': token});
    if (validToken) {
      return true; 
    } else {
      return false;
    }
  },
  setPassword: function (password, token) {
    check(password, String);
    check(token, String);
    var user = Meteor.users.findOne({'secure.passwordResetToken': token});
    Meteor.users.update({'secure.passwordResetToken': token}, {$set: {'secure.passwordResetToken': ''}});
    Accounts.setPassword(user._id, password)
  }
});