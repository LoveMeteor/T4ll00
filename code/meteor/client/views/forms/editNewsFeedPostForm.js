// Template.editNewsFeedPostForm.onCreated(function () {
//   var self = this;
//   self.subscribe('connectedUsers');

//   //Image URL String Replacement
//   AutoForm.hooks({
//     editNewsFeedPostForm: {
//       before: {
//         update: function (doc) {
//           if (doc.imageUrl && doc.imageUrl.indexOf('https://talloo.s3.amazonaws.com/images') > -1) {
//             doc.imageUrl = doc.imageUrl.replace('https://talloo.s3.amazonaws.com/images', 'https://talloo.imgix.net');
//           }
//           return doc;
//         }
//       }
//     }
//   });
// });

// Template.editNewsFeedPostForm.helpers({
//   newsFeedPostDoc: function () {
//     if (Session.get('editPostId')) {
//       return NewsFeedPosts.findOne(Session.get('editPostId'));
//     } else {
//       $('#edit-post-modal').modal('hide');
//     }
//   }
// });