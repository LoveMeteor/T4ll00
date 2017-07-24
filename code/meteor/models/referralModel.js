Referrals = new Mongo.Collection('Referrals');

Referrals.permit(['insert']).apply();
Referrals.permit(['update']).ifCurrentUserIsTo().apply();

// WORKSPACE POST SCHEMA
ReferralSchema = new SimpleSchema({
  from: {
    type: String,
    label: "The user sending this referral",
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
  to: {
    type: [String],
    label: "The users receiving this referral",
    autoform: {
      omit: false,
      type: "universe-select",
      afFieldInput: {
        options: function () {
          var connections = Meteor.users.find().fetch();//Meteor.user() && Meteor.user().connections ? Meteor.users.find(Meteor.user().connections.connected).fetch() : [];
          // console.log(connections);
          return connections.map(function (e, i, a) {
            return {label: e.profile.fullName, value: e._id};
          });
        },
        multiple: true,
        create: false
      }
    },
    optional: false
  },
  content: {
    type: String,
    label: "The content of this lead",
    optional: false,
    autoform: {
      afFieldInput: {
        type: 'textarea',
        rows: 2
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
        this.unset();  // Prevent user from supplying their own value
      }
    },
    autoform: {
      omit: true
    }
  },
  removedBy: {
    type: [String],
    label: "User IDs of those who removed this lead",
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return [];
      } else if (this.isUpsert) {
        return {$setOnInsert: []};
      }
    },
  }
});

Referrals.attachSchema(ReferralSchema);

Referrals.after.insert(function(userId, doc) {
  Meteor.call('newNotification', 'sentReferral', doc.to, this._id);
});
