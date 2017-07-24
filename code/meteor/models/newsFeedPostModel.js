  NewsFeedPosts = new Mongo.Collection('newsFeedPosts');

NewsFeedPosts.permit(['insert']).apply();
NewsFeedPosts.permit(['update']).ifCurrentUserIsAuthor().apply();

// NEWS FEED POST SCHEMA
NewsFeedPostSchema = new SimpleSchema({
  author: {
    type: String,
    label: "The author ID of this news feed post",
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
  permissions: {
    type: String,
    label: "Who should see this post?",
    allowedValues: [
      "public",
      "connections",
      "networks",
      "custom"
    ],
    autoform: {
      options: [
        {label: "Public", value: "public"},
        {label: "Entire Network", value: "connections"},
        {label: "Networks", value: "networks"},
        {label: "Custom", value: "custom"}
      ],
      defaultValue: "public"
    },
    optional: true
  },
  viewableBy: {
    type: [String],
    label: "The users who may view this post (if permissions type is custom)",
    autoform: {
      omit: false,
      type: "universe-select",
      afFieldInput: {
        options: function () {
          var connections = Meteor.users.find().fetch();//Meteor.user() && Meteor.user().connections ? Meteor.users.find(Meteor.user().connections.connected).fetch() : [];
          return connections.map(function (e, i, a) {
            return {label: e.profile.fullName, value: e._id};
          });
        },
        multiple: true,
        create: false
      }
    },
    optional: true
  },
  viewableNetworks: {
    type: [String],
    label: "The networks who may view this post (if permissions type is networks)",
    autoform: {
      omit: false,
      type: "universe-select",
      afFieldInput: {
        options: function () {
          var networks = Groups.find().fetch(); console.log("ViewableNetworks"); console.log(networks.length);
          return networks.map(function (e, i, a) {
            return {label: e.name, value: e._id};
          });
        },
        multiple: true,
        create: false
      }
    },
    optional: true
  },
  content: {
    type: String,
    label: "The content of this post",

    optional: true,
    custom: function () {
      return !!this.field('imageUrl').value || this.isSet ? true : 'noContentError';
    },
    autoform: {
      afFieldInput: {
        type: 'autocomplete-textarea',
        //rows: 1,
        settings: {
          position: "bottom",
          limit: 8,
          rules: [
            {
              token: Settings.tallooMentionToken,
              collection: Meteor.users,
              field: "profile.fullName",
              template: Meteor.isClient ? Template.userPill : ''
            }//,
            // {
            //   token: Settings.tallooMentionToken,
            //   collection: Dataset,
            //   field: "_id",
            //   options: '',
            //   matchAll: true,
            //   filter: { type: "autocomplete" },
            //   template: Template.dataPiece
            // }
          ]
        }
      }
    }
  },
  imageUrl: {
    type: String,
    label: "Upload an image",
    optional: true,
    custom: function () {
      if (this.isInsert) {
        return this.isSet ? this.value.indexOf('https://') > -1 ? true : 'uploadingError' : true;
      } else {
        return true;
      }
    },
    autoform: {
      type: 'slingshotFileUpload',
      afFieldInput:{
        slingshotdirective: 'newsFeedImages'
      }
    }
  },
  // image: {
  //   type: String,
  //   label: "Upload an image",
  //   optional: true,
  //   autoform: {
  //     type: 'slingshot',
  //     slingshot: {
  //       directives: [
  //         {name: 'newsFeedImages'}
  //       ]
  //     }
  //   }
  // },
  // postFileUrl: {
  //   type: String,
  //   label: "Upload a file",
  //   optional: true,
  //   autoform: {
  //     type: 'slingshot',
  //     slingshot: {
  //       directives: [
  //         {name: 'newsFeedFiles'}
  //       ]
  //     }
  //   }
  // },
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
  viewedBy: {
    type: [String],
    label: "The user IDs of the users which have viewed this post",
    autoform: {
      omit: true
    },
    optional: true
  },
  likedBy: {
    type: [String],
    label: "The user IDs of users who liked this news feed post",
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return [];
      }
    }
  },
  comments: {
    type: [String],
    label: "The IDs for this post's comments",
    autoform: {
      omit: true
    },
    optional: true
  },
  removed: {
    type: Boolean,
    label: "Has this post been removed",
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

NewsFeedPosts.attachSchema(NewsFeedPostSchema);

if(Meteor.isServer) {
  NewsFeedPosts.before.insert(function (userId, doc) {
    console.log("NewsFeedPosts Before Insert", userId, doc);

    user = Meteor.users.findOne(userId);

    var filter = {};

    if (user.profile) {
      var profile = user.profile;
      console.log("userNewsFeed profile", profile);
      if (profile.streetAddress && profile.streetAddress.length && profile.city && profile.city.length && profile.state && profile.state.length && profile.zip && profile.zip.length) {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + profile.streetAddress + "&components=locality:" + profile.city + "|administrative_area:" + profile.state + "|postal_code:" + profile.zip;
        console.log("userNewsFeed Google URL", url);
        var result = Meteor.http.call("GET", url);

        var jsonResult = JSON.parse(result.content);
        console.log("userNewsFeed google result", jsonResult);

        if (jsonResult.results && jsonResult.results.length) {
          var item = jsonResult.results[0];

          if (item.geometry && item.geometry.location) {
            var location = item.geometry.location;

            doc.location = { type: "Point", coordinates: [location.lng, location.lat] };
          }
        }
      }
    }

  });

  NewsFeedPosts.rawCollection().ensureIndex({location:'2dsphere'}, function(err){

  });
}

