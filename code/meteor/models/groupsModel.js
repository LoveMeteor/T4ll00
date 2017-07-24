Groups = new Mongo.Collection('groups');

Groups.permit(['insert']).apply();
Groups.permit(['update']).ifCurrentUserIsOwner().apply();

// WORKSPACE POST SCHEMA
GroupSchema = new SimpleSchema({
  ownerId: {
    type: String,
    label: "The owner ID of this group",
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.userId()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
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
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
    autoform: {
      omit: true
    }
  },
  users: {
    type: [String],
    label: 'IDs of users in this group',
    autoform: {
      omit: false,
      type: "universe-select",
      afFieldInput: {
        options: function () {
          //var connections = Meteor.users.find().fetch();//Meteor.user() && Meteor.user().connections ? Meteor.users.find(Meteor.user().connections.connected).fetch() : [];
          var me = Meteor.user();
          var connections = Meteor.users.find({_id:{$in:me.connections.connected.concat(me.connections.followers)}}).fetch();
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
  name: {
    type: String,
    label: 'Name of this group'
  }
});

Groups.attachSchema(GroupSchema);
