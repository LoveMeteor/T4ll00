Workspaces = new Mongo.Collection('workspaces');
Workspaces.permit(['insert']).apply();
Workspaces.permit(['update']).ifCurrentUserIsOwner().apply();





// WORKSPACE SCHEMA
WorkspaceSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name of your group",
    optional: false
    // RESTRICTS TO TWO FOR OLD PREMIUM FEATURE
    // custom: function () {
    //   var userIsPremium = Meteor.user().settings ? Meteor.user().settings.premium || false : false;
    //   var numUserWorkspaces = Workspaces.find({ownerId: Meteor.userId()}).count();
    //   if (userIsPremium) {
    //     return true;
    //   } else if (numUserWorkspaces > 1) {
    //     return 'tooManyWorkspaces';
    //   }
    // }
  },
  ownerId: {
    type: String,
    label: "The user ID of the group's owner",
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.userId()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  members: {
    type: [String],
    label: "The group members",
    // minCount: 1,
    optional: true,
    autoform: {
      type: "universe-select",
      afFieldInput: {
        options: function () {
          var connections = Meteor.users.find({_id: {$in: Meteor.user().connections.connected}}).fetch();
          // console.log(connections);
          return connections.map(function (e, i, a) {
            return {label: e.profile.fullName, value: e._id};
          });
        },
        multiple: true,
        create: false
      }
    }
  },
  posts: {
    type: [String],
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return [];
      }
    }
  },
  // Force value to be current date (on server) upon insert
  // and prevent updates thereafter.
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    autoform: {
      omit: true
    }
  },
  // Force value to be current date (on server) upon update
  // and don't allow it to be set upon insert.
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      } else {
        this.unset();
      }
    },
    denyInsert: true,
    optional: true,
    autoform: {
      omit: true
    }
  },
  archived: {
    type: Boolean,
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return false;
      }
    }
  }
});


Workspaces.attachSchema(WorkspaceSchema);