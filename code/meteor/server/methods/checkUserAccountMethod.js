Meteor.methods({
	checkUserAccount: function (email) {
		check(email, String);
		var user = Accounts.findUserByEmail(email);
		if (user) {
			if (user.services.facebook && user.services.facebook.link) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
})
