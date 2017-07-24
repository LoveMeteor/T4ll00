
Template.networks.onRendered(function (){
  Deps.autorun(function (){
    Meteor.subscribe('userGroups');
  });
});

Template.networks.helpers({
  networks: function () {
    return Groups.find({});
  },
  listMembers: function (userIds) {
    return Meteor.users.find({_id: {$in: userIds}});
  }
});

Template.networks.events({
  'click .remove-network-btn': function (e, t) {
    e.preventDefault();
    var networkId = this._id;
    swal({
      title: 'Are you sure to delete \''+this.name+'\' network?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    },function() {
      Meteor.call('removeNetwork', networkId);
    });

  },
  'click #new-network-btn': function (e, t) {
    e.preventDefault();

    $('#new-network-modal').modal();

  }
});
