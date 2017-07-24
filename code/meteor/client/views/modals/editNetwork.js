Template.editNetwork.helpers({
  networkDoc: function () {
    if (Session.get('editNetworkId')) {
      var doc = Groups.findOne(Session.get('editNetworkId'));

      return doc;
    } else {
      $('#edit-network-modal').modal('hide');
    }
  }
});

Template.editNetwork.events({
  'keydown .edit-network-field': function (e) {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault();
      $($(e.currentTarget).parents('form.form-inline')[0]).submit();
    }
  },
  'click #cancel-edit-network-btn': function () {
    // $('.file-upload-clear').click();
  }
});

Template.editNetwork.onRendered(function () {
  autosize($('textarea.form-control.users-field'));
});
