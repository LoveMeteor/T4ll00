Meteor.methods({
    checkLoginStatus: function () {

        console.log("CheckLoginStatus", this.userId, Meteor.userId(), Meteor.user());
        return Meteor.userId();
    }
})
