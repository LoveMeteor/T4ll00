Template.messages.helpers({
	messages: function () {
		return Messages.find();
	},
	conversations: function () { // needs update. new algo: get each distinct list of recipients and list those
		return // insert new collection here!
	},
	// userName: function () {
	// 	return Meteor.users.findOne({_id: this.toString()}).profile.fullName;
	// },
	lastMessage: function () {
		return Messages.findOne({$or: [{author: this.toString()}, {recipient: this.toString()}]}, {sort: {createdAt: -1}})
	}
});

