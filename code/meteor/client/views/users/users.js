Template.users.onCreated(function () {

});

Template.users.onRendered(function () {
    Meteor.subscribe('managedUsers');
});

Template.users.helpers({
    users: function() {
        var users = Meteor.users.find({}).fetch();
        return users;
    },
    no: function(index) {
        return index+1;
    }
});


Template.users.events({
    'change input': function(event) {
        var id = $(event.target).attr('data-id'),
            checked = event.target.checked;

        console.log("checked=", checked, id);

        Meteor.call('setCertified', id, checked);


    }
});
