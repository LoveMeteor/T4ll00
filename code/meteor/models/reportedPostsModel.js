ReportedPosts = new Mongo.Collection('reportedPosts');
ReportedPosts.permit(['insert']).apply();
// ReportedPosts.permit(['update']).ifCurrentUserIsAuthor().apply();

// REPORTED POST SCHEMA
ReportedPostSchema = new SimpleSchema({
  reporter: {
    type: String,
    label: "The reporter (ID) of a post",
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
  post: {
    type: String,
    label: "The ID for this post",
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

ReportedPosts.attachSchema(ReportedPostSchema);

