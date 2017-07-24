Meteor.methods({
    favoriteUser: function (userId) {
        check(userId, String);

        var me = Meteor.user();

        if(!_.contains(me.connections.favorites, userId)) {
            Meteor.users.update({'_id': this.userId}, {$push: {'connections.favorites': userId}});
            Meteor.call('newNotification', 'favoriteUser', [userId], this.userId);
        }
    },
    unfavoriteUser: function (userId) {
        check(userId, String);

        var me = Meteor.user();

        if(_.contains(me.connections.favorites, userId)) {
            Meteor.users.update({'_id': this.userId}, {$pull: {'connections.favorites': userId}});
            //Meteor.call('newNotification', 'favoriteUser', [userId], this.userId);
        }
    },
    connectUser: function (userId) {
        check(userId, String);
        if (Meteor.users.findOne({'_id': userId, 'connections.following': this.userId})) {
            // Remove From Current Users followers Array
            Meteor.users.update({'_id': this.userId}, {$pull: {'connections.followers': userId}});
            // Remove From Reciepient Users Follwing Array
            Meteor.users.update({'_id': userId}, {$pull: {'connections.following': this.userId}});
            // Insert Into Current Users Connected Array
            Meteor.users.update({'_id': this.userId}, {$push: {'connections.connected': userId}});
            // Insert Into Reciepients Users Connected Array & send notification
            Meteor.users.update({'_id': userId}, {$push: {'connections.connected': this.userId}});
            // Send Notification
            Meteor.call('newNotification', 'connectionConfirm', [userId], this.userId);
        } else {
            // Update Current Users Following Array
            Meteor.users.update({'_id': this.userId}, {$push: {'connections.following': userId}});
            // Update Recipient Users Followers Array & send notification
            Meteor.users.update({'_id': userId}, {$push: {'connections.followers': this.userId}});
            // Send Notification
            Meteor.call('newNotification', 'connectionRequest', [userId], this.userId);
        }
    },
    disconnectUser: function (userId) {
        check(userId, String);
        // Check if users are connected. If so make the receipient user a follower of the current user.
        if (Meteor.users.findOne({'_id': userId, 'connections.connected': this.userId})) {
            // Remove reciepient users connections to current User.
            Meteor.users.update({'_id': userId}, {
                $pull: {
                    'connections.followers': this.userId,
                    'connections.following': this.userId,
                    'connections.connected': this.userId
                }
            });
            // Remove current users connections to receipient users.
            Meteor.users.update({'_id': this.userId}, {
                $pull: {
                    'connections.followers': userId,
                    'connections.following': userId,
                    'connections.connected': userId
                }
            });
            // Update receiptient users following array
            Meteor.users.update({'_id': userId}, {$push: {'connections.following': this.userId}});
            // Update current users followers array
            Meteor.users.update({'_id': this.userId}, {$push: {'connections.followers': userId}});
        } else if (Meteor.users.findOne({'_id': userId, 'connections.followers': this.userId})) {
            // The current user will unfollow the recepient user only if they are currently following
            Meteor.users.update({'_id': userId}, {$pull: {'connections.followers': this.userId}});
            // The Receipeint user will have the current user removed from their followers list.
            Meteor.users.update({'_id': this.userId}, {$pull: {'connections.following': userId}});
        }
    },
    blockUser: function (userId) {
        check(userId, String);
        // Remove reciepient users connections to current User.
        Meteor.users.update({'_id': userId}, {
            $pull: {
                'connections.followers': this.userId,
                'connections.following': this.userId,
                'connections.connected': this.userId
            }
        });
        // Remove current users connections to receipient users.
        Meteor.users.update({'_id': this.userId}, {
            $pull: {
                'connections.followers': userId,
                'connections.following': userId,
                'connections.connected': userId
            }
        });
        // Add to Reciepient users blocked list.
        Meteor.users.update({'_id': userId}, {$push: {'connections.blocked': this.userId}});
        // Add to Current users blocked list.
        Meteor.users.update({'_id': this.userId}, {$push: {'connections.blocked': userId}});
    },
    unblockUser: function (userId) {
        check(userId, String);
        // Remove reciepient users connections to current User.
        Meteor.users.update({'_id': userId}, {$pull: {'connections.blocked': this.userId}});
        // Remove current users connections to receipient users.
        Meteor.users.update({'_id': this.userId}, {$pull: {'connections.blocked': userId}});
    }
});


