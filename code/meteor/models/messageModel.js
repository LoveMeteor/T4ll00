Messages = new Mongo.Collection('messages');
Messages.permit(['insert']).apply();

// MESSAGE SCHEMA
MessageSchema = new SimpleSchema({
  author: {
    type: String,
    label: "The author (ID) of a message",
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
  recipients: {
    type: [String],
    label: "To",
    optional: false,
    // minCount: 1,
    autoform: {
      type: "universe-select",
      afFieldInput: {
        options: function () {
          var connections = Meteor.users.find().fetch();
          return connections.map(function (e, i, a) {
            return {label: e.profile.fullName, value: e._id};
          });
        },
        multiple: true,
        create: false
      }
    }
  },
  content: {
    type: String,
    label: "Message",

    optional: false,
    autoform: {
      afFieldInput: {
        type: 'autocomplete-textarea',
        rows: 1,
        settings: {
          position: "bottom",
          limit: 8,
          rules: [
            {
              token: Settings.tallooMentionToken,
              collection: Meteor.users,
              field: "profile.fullName",
              template: Meteor.isClient ? Template.userPill : ''
            }
          ]
        }
      }
    }
  },
  // Force value to be current date (on server) upon insert
  // and prevent updates thereafter.
  createdAt: {
    type: Date,
    autoValue: function() {
      return new Date();
    },
    autoform: {
      omit: true
    }
  },
  // Force value to be current date (on server) upon update
  // and don't allow it to be set upon insert.
  // updatedAt: {
  //   type: Date,
  //   autoValue: function() {
  //     if (this.isUpdate) {
  //       return new Date();
  //     }
  //   },
  //   denyInsert: true,
  //   optional: true,
  //   autoform: {
  //     omit: true
  //   }
  // },
  viewedBy: {
    type: [String],
    label: "The user IDs of the users which have viewed this message",
    autoform: {
      omit: true
    },
    optional: true
  },
  // viewableBy: {
  //   type: String,
  //   label: "The user IDs of users who may view this message",
  //   autoform: {
  //     omit: true
  //   },
  //   optional: true
  // },


  


  // likedBy: {
  //   type: [String],
  //   label: "The user IDs of users who liked this message",
  //   autoform: {
  //     omit: true
  //   },
  //   autoValue: function () {
  //     if (this.isInsert) {
  //       return [];
  //     }
  //   }
  // },
});

Messages.attachSchema(MessageSchema);

