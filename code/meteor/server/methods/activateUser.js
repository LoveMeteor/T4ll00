Meteor.methods({
	activateUser: function (userId, token) {
		check(userId, String);
		check(token, String);

		var user = Meteor.users.findOne(userId);
		if (user) {
			if(user.secure.activationToken == token) {
				if(Meteor.users.update({_id: userId}, {$set: {'metadata.isActivated': true}})) {
					return {success:true,user:user};
				}
			}
		}

		return {success:false};
	}
})
