Template.activateResult.onRendered(function (){
  var userId = FlowRouter.getParam('id'),
      token = FlowRouter.getQueryParam('token');
  console.log("Activate Result"); console.log("UserId="+userId); console.log("Token="+token);
  Meteor.call('activateUser', userId, token, function (err, data) { console.log("After activate user");
    if (err || !data.success) {
      $('#div-result').html('User activation was failed');
    } else {
      $('#div-result').html(data.user.profile.fullName + ' was activated successfully');
    }
  });
});