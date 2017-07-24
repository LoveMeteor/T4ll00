// USER STUFF
Template.registerHelper('userName', function (authorId) {
  check(authorId, String);
  return Meteor.users.findOne({_id: authorId}) ? Meteor.users.findOne({_id: authorId}).profile.fullName : '';
});

Template.registerHelper('userCompany', function (authorId) {
  check(authorId, String);
  return Meteor.users.findOne({_id: authorId}) ? Meteor.users.findOne({_id: authorId}).profile.company : '';
});

Template.registerHelper('userTitle', function (authorId) {
  check(authorId, String);
  return Meteor.users.findOne({_id: authorId}) ? Meteor.users.findOne({_id: authorId}).profile.title : '';
});

Template.registerHelper('userImageUrl', function (authorId) {
  check(authorId, String);
  var user = Meteor.users.findOne({_id: authorId});
  return  user && user.profile.profileImage? user.profile.profileImage :'https://talloo.imgix.net/profilePhotos/defaultUser.png';
});

Template.registerHelper('universeConnections', function () {
  var connections = Meteor.users.find({_id: {$in: Meteor.user().connections.connected}, 'settings.deactivated': false}).fetch();
  return connections.map(function (e, i, a) {
    return {label: e.profile.fullName, value: e._id};
  });
});


// CORDOVA
Template.registerHelper('isCordova', function () {
  return Meteor.isCordova;
});



// IMAGES
// IMGIX API Call options for Avatar Images (High Res Circles)
Template.registerHelper('avatarImageOpts', function () {
  return '?fit=crop&crop=faces&w=100&h=100';
});

// IMGIX API Call options for Avatar Images (High Res Circles)
Template.registerHelper('avatarSmallImageOpts', function () {
  return '?fit=crop&crop=faces&w=40&h=40';
})

// IMGIX API Call options for Avatar Images (High Res Circles)
Template.registerHelper('avatarProfileImageOpts', function () {
  return '?fit=crop&crop=faces&w=70&h=70';
})

// IMGIX API Call options for Avatar Images (Big Squares)
Template.registerHelper('profileImageOpts', function (){
  return '?fit=crop&crop=faces&w=800&h=800'
});




// NEWS POST STUFF
Template.registerHelper('commentsForPost', function (post) {
  var comments = NewsFeedPostComments.find({newsFeedPost: post._id}, {sort: {createdAt: 1}}).fetch();
  if (comments) {
    Meteor.subscribe('publicUserData', _.pluck(comments, 'author'));
    return comments;
  }
});

Template.registerHelper('commentFormId', function (post) {
  return 'addCommentForm-' + post._id;
});

Template.registerHelper('postIsPublic', function (post) {
  return post.permissions === 'public';
});

Template.registerHelper('postIsMyConnections', function (post) {
  return post.permissions === 'connections';
});

Template.registerHelper('shareOptions', function () {
  var postId = Session.get('sharePostId');
  if (postId) {
    return {
      email: true,
      facebook: true,
      // facebookMessage: true,
      // gmail: true,
      googlePlus: true,
      linkedIn: true,
      // pinterest: true,
      // sms: true,
      twitter: true,
      url: true,
      shareData: {
        url: Meteor.absoluteUrl('post/' + postId, {secure: Settings.secureShareUrl}),
        facebookAppId: Settings.facebookAppId,
        subject: Settings.shareSubject,
        body: deLinkify( NewsFeedPosts.findOne(postId).content ) + ' \nShared from Talloo',
        redirectUrl: window.location.href
      }
    };
  }
});

Template.registerHelper('showCommentControls', function () {
  // console.log('checking ' + AutoForm.getFormId());
  return Session.get(AutoForm.getFormId());
});




// LIKES
Template.registerHelper('likeCount', function (likeableObject) {
  check(likeableObject, Object);
  check(likeableObject.likedBy, Array);
  return likeableObject.likedBy.length;
});


Template.registerHelper('userLikedIcon', function (likeableObject) {
  check(likeableObject, Object);
  check(likeableObject.likedBy, Array);
  check(Meteor.userId(), String);
  // console.log(likeableObject.likedBy.indexOf(Meteor.userId()) > -1);
  return likeableObject.likedBy.indexOf(Meteor.userId()) < 0 ? '-outline' : '';
});


Template.registerHelper('userIsAuthor', function (postObject) {
  // check(postObject, Object);
  // check(postObject.author, String);
  if (postObject && postObject.author) {
    return Meteor.userId() === postObject.author;
  } else {
    return false;
  }
});

Template.registerHelper('userIsOwner', function (workspace) {
  // check(workspace, Object);
  // check(workspace.ownerId, String);
  if (workspace && workspace.ownerId) {
    return Meteor.userId() === workspace.ownerId;
  } else {
    return false;
  }
});



// HUMAN READABLE DATES
// OG SOURCE: http://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
// with additional Date check, formatting differences, Settings (lib/settings/appSettings.js) support, crossover threshold lowered
// calculates the time since some date and returns human readable string
Template.registerHelper('timeSinceReactive', function timeSince(date) {
  check(date, Date);
  Session.get('updater');
  var now = new Date();
  var seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 0) {
    return '' + interval + Settings.strings.units.short.years;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 0) {
    return '' + interval + Settings.strings.units.short.months;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 0) {
    return '' + interval + Settings.strings.units.short.days;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 0) {
    return '' + interval + Settings.strings.units.short.hours;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 0) {
    return '' + interval + Settings.strings.units.short.minutes;
  }
  
  return '' + Math.floor(seconds) + Settings.strings.units.short.seconds;
});
