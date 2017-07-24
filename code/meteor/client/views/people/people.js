Template.people.onCreated(function () {
    Session.set('cardView', true);
    peopleSearch.search('');
});

Template.people.onRendered(function () {
    // $( document ).ready(function() {
    //   var heights = $(".card").map(function() {
    //     return $(this).height();
    //   }).get(),
    //   maxHeight = Math.max.apply(null, heights);
    //   $(".card").height(maxHeight);
    // });
});

Template.people.helpers({
    'cardView': function () {
        if (Session.get('cardView') === true) {
            return true;
        } else {
            return false;
        }
    },
    isLoading: function () {
        if (peopleSearch.getStatus().loading) {
            return "Searching...."
        }
    }
});


Template.people.events({
    'click #cardView': function () {
        Session.set('cardView', true);
    },
    'click #togglePeopleView': function () {
        if (Session.get('cardView') === true) {
            Session.set('cardView', false);
        } else {
            Session.set('cardView', true);
        }
    },
    'click .user-link': function (e, t) {
        location.href = '/user/' + this._id;
    },
    'click #connect': function (e, t) {
        e.preventDefault();

        var userId = $(e.target).attr('user-id');

        Meteor.call('connectUser', userId);
    },
    'click #disconnect': function (e, t) {
        e.preventDefault();

        var userId = $(e.target).attr('user-id');

        Meteor.call('disconnectUser', userId);
    },
    'click #block': function (e, t) {
        e.preventDefault();

        var userId = $(e.target).attr('user-id');

        Meteor.call('blockUser', userId);
    },
    'click #unblock': function (e, t) {
        e.preventDefault();
        var userId = $(e.target).attr('user-id');
        Meteor.call('unblockUser', userId);
    },
    'click #favorite': function (e, t) {
        e.preventDefault();
        var userId = $(e.target).attr('user-id');
        Meteor.call('favoriteUser', userId);
    },
    'click #unfavorite': function (e, t) {
        e.preventDefault();
        var userId = $(e.target).attr('user-id');
        Meteor.call('unfavoriteUser', userId);
    }

});


Template.peopleCards.helpers({
    hasPhoneNumber: function (profile) {
        if (profile.phoneNumber && profile.phoneNumber.length)
            return true;
        return false;
    },
    hasEmail: function (emails) {
        if (emails && emails[0] && emails[0].address)
            return true;
        return false;
    },
    hasLocation: function (profile) {
        if (profile.city && profile.city.length && profile.state && profile.state.length && profile.zip && profile.zip.length && profile.streetAddress && profile.streetAddress.length)
            return true;
        return false;
    },
    userStatus: function () {
        var status = Meteor.users.findOne({_id: this.toString()}).status;
        if (status.idle === true && status.online === true) {
            return 'greyCircle';
        } else if (status.online === true) {
            return 'greenCircle';
        } else {
            return 'whiteCircle';
        }
    },
    people: function () {
        if (Session.get('results')) {
            return peopleSearch.getData({
                // transform and highlight searched words
                // all regExp matching has done for you
                // you only have to do the word replacement only (to bold searching words)
                transform: function (matchText, regExp) {
                    console.log(matchText);
                    return matchText.replace(regExp, "<b>$&</b>")
                }
            });
        } else {
            //return Meteor.users.find({}, {sort:{'profile.firstName':1}});
            return Meteor.users.find({_id: {$in: Meteor.user().connections.favorites}}, {sort: {'profile.firstName': 1}});
        }
    },
    'following': function (userId) {
        if (Meteor.users.findOne({'_id': userId, 'connections.followers': Meteor.userId()})) {
            return true;
        } else {
            return false;
        }
    },
    'connected': function (userId) {
        if (Meteor.users.findOne({'_id': userId, 'connections.connected': Meteor.userId()})) {
            return true;
        } else {
            return false;
        }
    },
    'blocked': function (userId) {
        if (Meteor.users.findOne({'_id': userId, 'connections.blocked': Meteor.userId()})) {
            return true;
        } else {
            return false;
        }
    },
    follows: function (userId) {
        if (Meteor.users.findOne({'_id': userId, 'connections.following': Meteor.userId()})) {
            return true;
        } else {
            return false;
        }
    },
    'self': function (userId) {
        if (userId === Meteor.userId()) {
            return true;
        } else {
            return false;
        }
    },
    'favorite': function (userId) {
        if(_.contains(Meteor.user().connections.favorites, userId))
            return true;
        else
            return false;
    }

});

Template.peopleCards.events({
    'click .connect': function () {
        Meteor.call('connectUser', this._id);
    }
});


/////////////////////////////////////////////////////
///// Client Side Search Code
/////////////////////////////////////////////////////

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = [];

// creating a source with the name "people" and  ask to search
// 'fullName' and 'email' fields locally.
peopleSearch = new SearchSource('people', fields, options);

Template.peopleSearchBox.events({
    "change #people-filter-dropdown": function (e, t) {
        var val = $(e.target).val();

        Session.set('filter', val);

    },
    /*"keyup #people-search-input": _.throttle(function (e) {
        var text = $(e.target).val().trim();
        if (text === '') {
            Session.set('results', false);
        } else {
            Session.set('results', true);
            console.log("searching...");
            console.log(text);
            peopleSearch.search(text);
        }
    }, 800),*/
    "click #people-search-btn": function (e, t) {
        var text = $("#people-search-input").val().trim();
        if (text === '') {
            Session.set('results', false);
        } else {
            Session.set('results', true);
            console.log("searching...");
            console.log(text);
            peopleSearch.search(text);
        }
    }
});

Template.userLists.onRendered(function () {
    Deps.autorun(function () {
        Meteor.subscribe('userGroups');
    });
});

Template.userLists.helpers({
    userLists: function () {
        return Groups.find({});
    },
    listMembers: function (userIds) {
        return Meteor.users.find({_id: {$in: userIds}});
    }
});

Template.userLists.events({
    'click .delete-list': function (e, t) {
        e.preventDefault();
        Meteor.call('removeNetwork', this._id);
    }
});
