WorkspacePosts = new Mongo.Collection('workspacePosts');
WorkspacePosts.permit(['insert']).apply();
WorkspacePosts.permit(['update']).ifCurrentUserIsAuthor().apply();

// WORKSPACE POST SCHEMA
WorkspacePostSchema = new SimpleSchema({
  author: {
    type: String,
    label: "The author (ID) of a post",
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
      "workspace",
      "custom"
    ],
    autoform: {
      options: [
        {label: "Entire Group", value: "workspace"},
        {label: "Custom", value: "custom"}
      ],
      defaultValue: "workspace"
    }
  },
  // viewableBy: {
  //   type: [String],
  //   label: "The user IDs of users who may view this post",
  //   autoform: {
  //     omit: true
  //   },
  //   optional: true
  // },
  viewableBy: {
    type: [String],
    label: "The user IDs of users who may view this post (if permissions type is custom)",
    autoform: {
      omit: false,
      type: "universe-select",
      afFieldInput: {
        options: function () {  // need to update to get just the workspace users
          if (Meteor.isClient) {
            var workspaceUsers = Workspaces.findOne(FlowRouter.getParam('id')).members; //Meteor.users.find().fetch(); //
            // console.log('DEBUG> users: ' + workspaceUsers);
            return workspaceUsers.map(function (e, i, a) {
              return {label: e.profile.fullName, value: e._id};
            });
          }
        },
        multiple: true,
        create: false
      }
    },
    optional: true
  },
  content: {
    type: String,
    label: "Enter a message...",

    optional: true,
    custom: function () {
      return !!this.field('imageUrl').value || this.isSet ? true : 'noContentError';
    },
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
              collection: function () {if (Meteor.isClient) return Fake;},
              field: "profile.fullName",
              template: Meteor.isClient ? Template.userPill : ''
            }
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
        slingshotdirective: 'workspaceImages'
      }
    }
  },
  // fileUrl: {
  //   type: String,
  //   label: "Upload a file",
  //   optional: true,
  //   autoform: {
  //     type: 'slingshot',
  //     slingshot: {
  //       directives: [
  //         {name: 'workspaceFiles'}
  //       ]
  //     }
  //   }
  // },
  fileUrl: {
    type: String,
    label: "Upload a file",
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
        slingshotdirective: 'workspaceFiles'
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
  viewedBy: {
    type: [String],
    label: "The user IDs of the users which have viewed this post",
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return [Meteor.userId()];
      }
    }
  },

  likedBy: {
    type: [String],
    label: "The user IDs of users who liked this post",
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (this.isInsert) {
        return [];
      }
    }
  },
  workspaceId: {
    type: String,
    label: "The group ID for this post",
    autoform: {
      omit: true
    },
    optional: false,
    denyUpdate: true
    // autoValue: function() {
    //   if (this.isInsert) {
    //     return FlowRouter.getParam('id');
    //   } else {
    //     this.unset();  // Prevent user from supplying their own value
    //   }
    // }
  }
});

WorkspacePosts.attachSchema(WorkspacePostSchema);

