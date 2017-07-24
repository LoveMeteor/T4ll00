Template.network.onRendered(function (){
  var network = Groups.findOne({_id: FlowRouter.getParam('id')});
  Session.set('activeNetwork', network);
  Session.set('networkUsers', network.users);
});

Template.network.onDestroyed(function (){
  Session.set('activeNetwork', null);
});
Template.network.helpers({
  network: function () {
    return Session.get('activeNetwork');
  },
  members: function (userIds) {
    return Meteor.users.find({_id: {$in: userIds}});
  },
  users: function() {
    return Session.get('networkUsers');
  }
});
Template.network.events({
  'click .remove-member-btn': function (e, t) {
    e.preventDefault();

    var memberId = this._id;
    swal({
      title: 'Are you sure you want to remove \''+this.profile.fullName+'\' ?',
      text: "This cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: '#CCC',
      cancelButtonColor: '#CCC',
      confirmButtonText: 'Confirm'
    },function() {
      var network = Session.get('activeNetwork');
      Meteor.call('deleteMemberFromNetwork', network._id, memberId);

      var users = Session.get('networkUsers');
      var index = users.indexOf(memberId);
      users.splice(index,1);
      Session.set('networkUsers', users);
    });
  },
  'click .edit-network-btn': function (e) {
    e.preventDefault();
    var network = Session.get('activeNetwork');

    Session.set('editNetworkId', network._id);
    $('#edit-network-modal').modal('show');
  }
});
