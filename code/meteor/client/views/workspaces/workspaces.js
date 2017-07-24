Template.workspaces.helpers({
  userWorkspaces: function () {
    var theWorkspaces = Workspaces.find({archived: false});
    var theUsers = _.compact(_.uniq(_.flatten(_.pluck(theWorkspaces.fetch(), 'ownerId').concat(_.pluck(theWorkspaces.fetch(), 'members')))));
    Meteor.subscribe('publicUserData', theUsers);
    return theWorkspaces;
  },
  memberImageUrl: function () {
    return Meteor.users.findOne({_id: this.toString()}).profile.profileImage + '?fit=crop&crop=faces&w=30&h=30';
  },
  memberId: function () {
    return Meteor.users.findOne({_id: this.toString()})._id;
  },
  userArchivedWorkspaces: function () {
    // return Template.instance().workspaces();
    return Workspaces.find({ownerId: Meteor.userId(), archived: true}, {sort: {createdAt: -1}});
    // return Workspaces.find();
  },
  currentUserIsOwner: function () {
    return this.ownerId === Meteor.userId();
  }
});

Template.workspaces.events({
  'click #new-workspace-btn': function (e) {
    e.preventDefault();
    $('#new-workspace-modal').modal('show');
  },
  'click #archived-workspaces-btn': function (e) {
    e.preventDefault();
    FlowRouter.go('/archivedWorkspaces');
  },
  'click .create-workspace-btn': function (e) {
    // e.preventDefault();
    $('#new-workspace-modal').modal('hide');
  },
  'click .archive-workspace-btn': function (e) {
    e.preventDefault();
    var workspaceId = e.currentTarget.id;
    Workspaces.update({_id: workspaceId}, {$set: {archived: true}});
  }
});


Template.archivedWorkspaces.helpers({
  userWorkspaces: function () {
    // return Template.instance().workspaces();
    return Workspaces.find({ownerId: Meteor.userId(), archived: true}, {sort: {createdAt: -1}});
    // return Workspaces.find();
  },
  currentUserIsOwner: function () {
    return this.ownerId === Meteor.userId();
  }
});

// Template.workspaces.onRendered(function () {
//   Meteor.subscribe('workspaces');
// });



// Template.workspaces.onCreated(function () {

//   // 1. Initialization

//   var instance = this;

//   // initialize the reactive variables
//   instance.loaded = new ReactiveVar(0);
//   instance.limit = new ReactiveVar(5);

//   // 2. Autorun

//   // will re-run when the "limit" reactive variables changes
//   instance.autorun(function () {

//     // get the limit
//     var limit = instance.limit.get();

//     // console.log("Asking for "+limit+" posts…")

//     // subscribe to the posts publication
//     var subscription = instance.subscribe('workspaces', limit);

//     // if subscription is ready, set limit to newLimit
//     if (subscription.ready()) {
//       console.log("> Received "+limit+" posts. \n\n")
//       instance.loaded.set(limit);
//     } else {
//       console.log("> Subscription is not ready yet. \n\n");
//     }
//   });

//   // 3. Cursor

//   instance.workspaces = function() { 
//     return Workspaces.find({members: {$elemMatch: {userId: Meteor.userId()}}}, {limit: instance.loaded.get()});
//   }

// });