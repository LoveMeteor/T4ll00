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

Template.archivedWorkspaces.events({
  'click #active-workspaces-btn': function (e) {
    e.preventDefault();
    FlowRouter.go('/workspaces');
  }
});