Meteor.methods({
  updateNetworkMembers: function (networkId, members) {
    check(networkId, String);
    check(members, Array);
    Meteor.Groups.update({'_id': networkId}, {'users': members});
  },

  deleteMemberFromNetwork: function(networkId, memberId) {
    check(networkId, String);
    check(memberId, String);
    Groups.update(networkId, {$pull: {users: memberId}});
  },

  removeNetwork: function (networkId) {
		check(networkId, String);
		var group = Groups.findOne({_id: networkId});
		if (group.ownerId === Meteor.userId()) {
			Groups.remove({_id: networkId});
		}
	}
});
