AutoForm.addHooks(null, {
  before: {
    insert: function (doc) {
      console.log(doc);

      // HANDLE IMAGES
      if (doc.imageUrl && doc.imageUrl.indexOf('https://talloo.s3.amazonaws.com/images') > -1) {
        console.log('image url detected');
        doc.imageUrl = doc.imageUrl.replace('https://talloo.s3.amazonaws.com/images', 'https://talloo.imgix.net');
      } else {
        console.log('no image url detected');
      }

      // HANDLE THE TEXT
      if (doc.content) {
        console.log('text content detected');
        doc.content = linkify(doc.content);
        doc.content = sanitizeHtml(doc.content, {allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat(['tel'])});
      } else {
        console.log('no text content detected');
      }

      // ENSURE PERMISSIONS ARE CORRECT FOR TAGGED USERS
      if (doc.permissions === 'custom' && Session.get('taggedUsers').length > -1) {
        console.log('We may need to add some user(s) to viewable by for this post');
        Session.get('taggedUsers').forEach(function (e, i, a) {
          if (doc.viewableBy.indexOf(e._id) < 0) {
            doc.viewableBy = doc.viewableBy.concat(e._id);
          }
        });
      }

      return doc;
    },
    update: function (doc) {
      console.log(doc);
      console.log(this);

      // HANDLE IMAGES
      if (this.currentDoc.imageUrl && !doc.$set.imageUrl) {
        if (!doc.$unset) { doc.$unset = {}; }
        doc.$unset.imageUrl = '';
      } else if (doc.$set.imageUrl && doc.$set.imageUrl.indexOf('https://talloo.s3.amazonaws.com/images') > -1) {
        console.log('image url update detected');
        doc.$set.imageUrl = doc.$set.imageUrl.replace('https://talloo.s3.amazonaws.com/images', 'https://talloo.imgix.net');
      }

      // OLD HANDLE IMAGES
      // if (doc.$set.imageUrl && doc.$set.imageUrl.indexOf('https://talloo.s3.amazonaws.com/images') > -1) {
      //   doc.$set.imageUrl = doc.$set.imageUrl.replace('https://talloo.s3.amazonaws.com/images', 'https://talloo.imgix.net');
      // } else if (!doc.$set.imageUrl) {
      //   if (!doc.$unset) { doc.$unset = {}; }
      //   doc.$unset.imageUrl = '';
      // }

      // HANDLE THE TEXT
      if (doc.$set.content) {
        console.log('text content detected');
        doc.$set.content = linkify(doc.$set.content);
        doc.$set.content = sanitizeHtml(doc.$set.content);
      } else {
        console.log('no text content detected');
      }

      return doc;
    }
  },
  after: {
    insert: function (err, res) {
      if (res) {
        $('.modal').modal('hide');
        // $('.file-upload-clear').click();
        console.log('Inserted ' + res);
        if (Session.get('taggedUsers').length > 0) {
          console.log('tagged users: ', Session.get('taggedUsers'));
          if (NewsFeedPosts.findOne(res)) {
            console.log('news mention notification sent');
            Meteor.call('newNotification', 'newsMention', _.pluck(Session.get('taggedUsers'), '_id'), res);
          } else if (NewsFeedPostComments.findOne(res)) {
            console.log('news mention notification sent');
            var comment = NewsFeedPostComments.findOne(res);
            Meteor.call('newNotification', 'newsMention', _.pluck(Session.get('taggedUsers'), '_id'), comment.newsFeedPost);
          } else if (WorkspacePosts.findOne(res)) {
            console.log('workspace mention notification sent');
            post = WorkspacePosts.findOne(res);
            Meteor.call('newNotification', 'workspaceMention', _.pluck(Session.get('taggedUsers'), '_id'), post.workspaceId);
          } else {
            console.log('Unhandled tagging case, autform.js');
          }
          Session.set('taggedUsers', []);
        }
        // setupTextareas();
      } else {
        console.log('Insert failed: ' + err);
      }
    },
    update: function (err, res) {
      if (res) {
        // $('.file-upload-clear').click();
        $('.modal').modal('hide');
      }
    }
  }
});

SimpleSchema.messages({
  noContentError: 'The status update appears to be blank. Please share something.',
  uploadingError: 'Please wait, the file is still uploading.',
  tooManyWorkspaces: Settings.tooManyWorkspacesMessage
});


// AutoForm.addHooks('newWorkspaceForm', {
//   after: {
//     insert: function (err, res) {
//       if (err) {
//         console.log('insert failed: ', err);
//       } else if (res) {
//         $('#new-workspace-modal').modal('hide');
//       }
//     }
//   }
// });



AutoForm.hooks({
  newWorkspaceMessageForm: {
    before: {
      insert: function (doc) {
        doc.workspaceId = FlowRouter.getParam('id');
        doc.viewableBy = _.compact([Workspaces.findOne({_id: FlowRouter.getParam('id')}).ownerId].concat(Workspaces.findOne({_id: FlowRouter.getParam('id')}).members));
        // console.log(doc.viewableBy);
        // if (doc.imageUrl) {
        //   doc.imageUrl = doc.imageUrl.replace('https://talloo.s3.amazonaws.com/images', 'https://talloo.imgix.net');
        // }
        Meteor.call('newNotification', 'workspacePost', _.compact([doc.ownerId].concat(doc.viewableBy)), FlowRouter.getParam('id'));
        return doc;
      }
    // }
    },
    after: {
      insert: function (err, res) {
        if (err) {
          console.log(err);
        } else {
          // Meteor.setTimeout(function () {
          //   $('textarea.form-control.workspace-post-field').shiftenter({hint: ''});
          //   autosize($('textarea.form-control.workspace-post-field'));
          // }, 1024);
        }
      }
    }
  },
  updateWorkspaceForm: {
    before: {
      update: function (doc) {
        if (Workspaces.findOne({_id: this.docId}).ownerId === Meteor.userId()) {
          return doc;
        } else {
          return false;
        }
      }
    },
    onSuccess: function(formType, result) {
      Meteor.call('addWorkspaceToUsers', this.docId, this.updateDoc.$set.members);
    }
  }
});

AutoForm.hooks({
  newNFPostForm: {
    after: {
      insert: function (err, res) {
        if (err) {
          console.log(err);
          // swal('An error occurred. Please try again.');
        } else {
          // AutoForm._forceResetFormValues('newNFPostForm');
          // $('textarea').autosize();
          $('.permissions-field').val("public");
          // $('#new-post-modal').modal('hide');
        }
      }
    }//,
    // before: {
    //   insert: function (doc) {
    //     if (doc.imageUrl && doc.imageUrl.indexOf('https://talloo.s3.amazonaws.com/images') > -1) {
    //       doc.imageUrl = doc.imageUrl.replace('https://talloo.s3.amazonaws.com/images', 'https://talloo.imgix.net');
    //     }
    //     return doc;
    //   }
    // }
  }
});
AutoForm.hooks({
  newNFPostModalForm: {
    after: {
      insert: function (err, res) {
        if (err) {
          console.log(err);
          // swal('An error occurred. Please try again.');
        } else {
          // AutoForm._forceResetFormValues('newNFPostForm');
          // $('textarea').autosize();
          $('.permissions-field').val("public");
          // $('#new-post-modal').modal('hide');
        }
      }
    }//,
    // before: {
    //   insert: function (doc) {
    //     if (doc.imageUrl && doc.imageUrl.indexOf('https://talloo.s3.amazonaws.com/images') > -1) {
    //       doc.imageUrl = doc.imageUrl.replace('https://talloo.s3.amazonaws.com/images', 'https://talloo.imgix.net');
    //     }
    //     return doc;
    //   }
    // }
  }
});

AutoForm.hooks({
  newWorkspaceForm: {
    onSuccess: function(formType, result) {
      Meteor.call('addWorkspaceToUsers', this.docId, [Meteor.userId()].concat(this.insertDoc.members));
    }
  }
});

AutoForm.hooks({
  editNetworkForm: {
    after: {
      update: function (err, res) {
        if(err) {
          console.log("Update network error"); console.log(err);
        } else {
          console.log("Update network result"); console.log(res);
        }

        var network = Groups.findOne({_id: FlowRouter.getParam('id')});
        Session.set('activeNetwork', network);
        Session.set('networkUsers', network.users);
      }
    }
  }
});
