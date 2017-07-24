Template.user.onRendered(function () {
    console.log("========== For Speed Test ========== GetUserProfileData started", new Date());
    Meteor.call('getUserProfileData', FlowRouter.getParam('id'), function (err, data) {
        console.log("========== For Speed Test ========== GetUserProfileData ended", new Date());
        if (err) {
            console.log(err);
        } else {
            Session.set('activeUser', data);
        }
    });
});

Template.user.onDestroyed(function () {
    Session.set('activeUser', null);
    Session.set('userHistoryVisible', null);
});

Template.user.helpers({
    formatPhone: function (phoneNumber) {
        var numbers = phoneNumber.replace(/\D/g, ''),
            char = {0: '(', 3: ') ', 6: '-'};
        phoneNumber = '';
        for (var i = 0; i < numbers.length; i++) {
            phoneNumber += (char[i] || '') + numbers[i];
        }

        return phoneNumber;
    },
    user: function () {
        return Session.get('activeUser');
    },
    defaultPhoto: function () {
        return 'https://talloo.imgix.net/profilePhotos/defaultUser.png'
    },
    'favorite': function () {
        if(_.contains(Meteor.user().connections.favorites, FlowRouter.getParam('id')))
            return true;
        else
            return false;
    },
    'following': function () {
        if (Meteor.users.findOne({'_id': FlowRouter.getParam('id'), 'connections.followers': Meteor.userId()})) {
            return true;
        } else {
            return false;
        }
    },
    'connected': function () {
        if (Meteor.users.findOne({'_id': FlowRouter.getParam('id'), 'connections.connected': Meteor.userId()})) {
            return true;
        } else {
            return false;
        }
    },
    'blocked': function () {
        if (Meteor.users.findOne({'_id': FlowRouter.getParam('id'), 'connections.blocked': Meteor.userId()})) {
            return true;
        } else {
            return false;
        }
    },
    follows: function () {
        if (Meteor.users.findOne({'_id': FlowRouter.getParam('id'), 'connections.following': Meteor.userId()})) {
            return true;
        } else {
            return false;
        }
    },
    historyVisible: function () {
        return Session.get('userHistoryVisible');
    }
});

Template.user.events({
    'click #favorite': function (e, t) {
        e.preventDefault();
        var userId = FlowRouter.getParam('id');
        Meteor.call('favoriteUser', userId);
    },
    'click #unfavorite': function (e, t) {
        e.preventDefault();
        var userId = FlowRouter.getParam('id');
        Meteor.call('unfavoriteUser', userId);
    },
    'click #connect': function (e, t) {
        e.preventDefault();
        var userId = FlowRouter.getParam('id');
        Meteor.call('connectUser', userId);
    },
    'click #disconnect': function (e, t) {
        e.preventDefault();
        var userId = FlowRouter.getParam('id');
        Meteor.call('disconnectUser', userId);
    },
    'click #block': function (e, t) {
        e.preventDefault();
        var userId = FlowRouter.getParam('id');
        Meteor.call('blockUser', userId);
    },
    'click #unblock': function (e, t) {
        e.preventDefault();
        var userId = FlowRouter.getParam('id');
        Meteor.call('unblockUser', userId);
    },
    'click #historyToggle': function (e, t) {
        e.preventDefault();

        var historyVisible = Session.get('userHistoryVisible');
        Session.set('userHistoryVisible', !historyVisible);
    }
});

Template.userHistory.onRendered(function(){
    Meteor.call('getUserPosts', FlowRouter.getParam('id'), function (err, data) {
        if (err) {
            console.log(err);
        } else {
            return Session.set('activeUserPosts', data);
        }
    });
});

Template.userHistory.onDestroyed(function(){
   Session.set('activeUserPosts', null);
   Session.set('noUserHistory', null);
});
Template.userHistory.helpers({
    recentPosts: function () {
        var posts = Session.get('activeUserPosts');
        if (posts.length == 0)
            Session.set('noUserHistory', true);
        else
            Session.set('noUserHistory', false);

        return posts;
    },

    noHistory: function () {
        return Session.get('noUserHistory');
    },
    userMeta: function () {
        return Session.get('activeUser').profile
    }
});