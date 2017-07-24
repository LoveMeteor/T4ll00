/// People Search Source and Logic
SearchSource.defineSource('people', function(searchText, options) {
  // Search People for Names or Emails matching searchText.

  var regExp = buildRegExp(searchText);
  // Search People for Names or Emails matching searchText.

  var selector = {$or: [
      {'emails.address': regExp},
      {'profile.company': regExp},
      {'profile.fullName': regExp}
    ]};

  var unfilteredPeople = Meteor.users.find(selector).fetch();
  //var unfilteredPeople = Meteor.users.find({$text: {$search: searchText}}).fetch();

  // Get list of blocked users
  var blockedUsers = Meteor.user().connections.blocked;
  // Remove any blocked users from search results.
  var allowedResults = _.filter(unfilteredPeople, function(obj){
    return blockedUsers.indexOf(obj._id) === -1;
 });
  // Return allowed People reults.
  return allowedResults;
});

SearchSource.defineSource('news', function(searchText, options) {
  var connectionPostUserIds = Meteor.user().connections.connected;
  /////// Need search logic on news feed to be finished in order to ensure only content a user can see is returned in search.
  var news = NewsFeedPosts.find({$text: {$search: searchText}, $or: [
          {permissions: 'public', removed: false}
          , {removed: false, permissions: 'connections', author: {$in: connectionPostUserIds}}
          , {removed: false, permissions: 'custom', viewableBy: this.userId}
          , {removed: false, author: this.userId}
        ]}).fetch();
  return news;
});

// SearchSource.defineSource('workspaces', function(searchText, options) {
//   console.log(searchText);
//   var workspaces = Meteor.users.find({$text: {$search: searchText}}).fetch();
//   console.log(workspaces);
//   return workspaces;
// });

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
