Template.resetPassword.onRendered(function (){
 Meteor.call('authorizedTokenCheck', FlowRouter.getParam('token'), function (err, data) {
  if (err) {
    console.log(err);
  } else {
    Session.set('authorized', data);
  }
});
});


Template.resetPassword.helpers({
  authorized: function () {
    return Session.get('authorized');
  }
});


Template.resetPassword.events({
  'submit #reset-password-form' : function(e, t) {
    e.preventDefault();
    passwordForm = $(e.currentTarget),
    password = passwordForm.find('#password').val(),
    passwordConfirm = passwordForm.find('#passwordConfirm').val();
    if (password === passwordConfirm) {
      Meteor.call('setPassword', password, FlowRouter.getParam('token'));
      swal('Your password has been reset.');
      location.href = '/login';
    } else {
      swal('Your passwords do not match.');
    }
  }
})