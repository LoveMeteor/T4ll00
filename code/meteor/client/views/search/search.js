Template.search.onDestroyed(function () {
  Session.set('results', false);
});

Template.search.onRendered(function () {
  // Trigger search if search is from tag link
  Meteor.setTimeout(function () {
    var tag = window.location.search.substring(1).split('=')
    if (tag[1]) {
      Session.set('results', true);
      peopleSearch.search(tag[1]);
      newsSearch.search(tag[1]);
      $('#search-input').val(tag[1]);
    }
  }, 500);
});

Template.search.helpers({
  peopleData: function () {
    if (Session.get('results')) {
      return peopleSearch.getData({
        transform: function (matchText, regExp) {
          console.log(matchText);
          return matchText.replace(regExp, "<b>$&</b>");
        }
      });
    } else {
      return null;
    }
  },
  newsData: function () {
    if (Session.get('results')) {
      return newsSearch.getData({
        transform: function (matchText, regExp) {
          console.log(matchText);
          return matchText.replace(regExp, "<b>$&</b>");
        }
      });
    } else {
      return null;
    }
  },
  following: function () {
    if (Meteor.users.findOne({'_id': FlowRouter.getParam('id'), 'connections.followers': Meteor.userId()})) {
      return true;
    } else {
      return false;
    }
  },
  connected: function () {
    if (Meteor.users.findOne({'_id': FlowRouter.getParam('id'), 'connections.connected':  Meteor.userId()})) {
      return true;
    } else {
      return false;
    }
  },
  blocked: function () {
    if (Meteor.users.findOne({'_id': FlowRouter.getParam('id'), 'connections.blocked': Meteor.userId()})) {
      return true;
    } else {
      return false;
    }
  }
});

Template.search.events({
  'click .user-link': function (e, t) {
    location.href = '/user/' + this._id;
  },
  'click .news-link': function (e, t) {
    location.href = '/post/' + this._id;
  }
})

/////////////////////////////////////////////////////
///// Client Side Search Code
/////////////////////////////////////////////////////

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = [];

// creating a source with the name "people" and  ask to search
// 'fullName' and 'email' fields locally.
peopleSearch = new SearchSource('people', fields, options);
newsSearch = new SearchSource('news', fields, options);
// workspaceSearch = new SearchSource('workspaces', fields, options);




Template.search.events({
  "keyup #search-input": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    console.log(text);
    if (text === '') {
      Session.set('results', false);
    } else {
     Session.set('results', true);
     peopleSearch.search(text);
     newsSearch.search(text);
   }
 }, 800)
});
