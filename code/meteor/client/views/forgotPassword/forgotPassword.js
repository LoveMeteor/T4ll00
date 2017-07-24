Template.forgotPassword.helpers({

});

Template.forgotPassword.events({
	'submit #password-reset-form' : function(e, t) {
		e.preventDefault();
		loginCredentials = $(e.currentTarget),
		email = loginCredentials.find('#email').val();
		Meteor.call('checkUserAccount', email, function (err, data) {
			if (err) {
				swal('That is embarrassing, there was an error. Give it another try?');
			} else {
				if (data) {
					swal({
						title: 'Your account was registered using Facebook.',
						text: 'Your account was registered using Facebook, please login using Facebook.'
					});
				} else {
					Meteor.call('sendPasswordReset', email);
					swal({
						title: '',
						text: 'We went searching for your account. If we found it, you will receive an email shortly to reset your password.'
					});
				}
			}
		});
	}
});
