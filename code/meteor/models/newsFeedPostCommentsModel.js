NewsFeedPostComments = new Mongo.Collection('newsFeedPostComments');

NewsFeedPostComments.permit(['insert']).apply();
NewsFeedPostComments.permit(['update']).ifCurrentUserIsAuthor().apply();

// WORKSPACE POST SCHEMA
NewsFeedPostCommentSchema = new SimpleSchema({
  author: {
    type: String,
    label: "The author ID of this comment",
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
  newsFeedPost: {
    type: String,
    label: "The post ID for this comment",
    autoform: {
      omit: true
    },
    autoValue: function () {
      if (Meteor.isClient) {
        var formId = AutoForm.getFormId();
        var prefix = 'addCommentForm-';
        if (formId.indexOf(prefix) > -1) {
          var postId = formId.substr(prefix.length);
          if (this.isInsert) {
            return postId;
          } else if (this.isUpsert) {
            return {$setOnInsert: postId};
          } else {
            this.unset();  // Prevent user from supplying their own value
          }
        } else {
          this.unset();
        }
      }

    }
  },
  content: {
    type: String,
    label: "The text content of this comment",

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
              collection: Meteor.users,
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
    custom: function () {
      if (this.isInsert) {
        return this.isSet ? this.value.indexOf('https://') > -1 ? true : 'uploadingError' : true;
      } else {
        return true;
      }
    },
    optional: true,
    autoform: {
      type: 'slingshotFileUpload',
      afFieldInput:{
        slingshotdirective: 'newsFeedImages'
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
  // viewedBy: {
  //   type: [String],
  //   label: "The user IDs of the users which have viewed this news feed post comment",
  //   autoform: {
  //     omit: true
  //   },
  //   optional: true
  // },
  viewableBy: {
    type: [String],
    label: "The user IDs of users who may see this comment",
    autoform: {
      omit: true
    },
    optional: true
  }//,
  // likedBy: {
  //   type: [String],
  //   label: "The user IDs of users who liked this news feed post comment",
  //   autoform: {
  //     omit: true
  //   },
  //   autoValue: function () {
  //     if (this.isInsert) {
  //       return [];
  //     }
  //   }
  // },
  // comments: {
  //   type: [String],
  //   label: "The IDs for this news feed post comment's comments",
  //   autoform: {
  //     omit: true
  //   },
  //   optional: true
  // }
});

NewsFeedPostComments.attachSchema(NewsFeedPostCommentSchema);

NewsFeedPostComments.after.insert(function(userId, doc) {  
  var post = NewsFeedPosts.findOne(doc.newsFeedPost);
  Meteor.call('newNotification', 'newsFeedComment', [post.author], post._id);
});
