Template.workspace.onCreated(function () {
  var self = this;
  // self.subscribe('connectedUsers');
  Session.setDefault('wsPostLimit', Settings.feedIncrement);
  Deps.autorun(function () {
    Meteor.subscribe('workspacePosts', FlowRouter.getParam('id'), Session.get('wsPostLimit'));
  });
  $(window).scroll(showMoreVisible);

  // Meteor.setTimeout(function () {
    // $('textarea.form-control.workspace-post-field').shiftenter({hint: ''});
    // autosize($('textarea.form-control.workspace-post-field'));
  // }, 1024);

});

Template.workspace.onRendered(function () {
  autosize($('textarea.form-control.workspace-post-field'));
  $('#file-fileUrl').parent().find('i').removeClass('ion-ios-cloud-upload-outline');
  $('#file-fileUrl').parent().find('i').addClass('ion-paperclip');
});

Template.workspace.onDestroyed(function () {

});

Template.workspace.helpers({
  posts: function () { console.log("Refresh posts");
    var theWorkspace = Workspaces.findOne({_id: FlowRouter.getParam('id')});
    if (theWorkspace) {
      var theUsers = _.compact(_.uniq([theWorkspace.ownerId].concat(theWorkspace.members)));
      if (theUsers) {
        Meteor.subscribe('publicUserData', theUsers);
      }
      var thePosts = WorkspacePosts.find({workspaceId: theWorkspace._id}, {sort: {createdAt: 1}});
      var fetchedPosts = thePosts.fetch();
      var firstOldPost = _.find(fetchedPosts, function (e) {
        return e.viewedBy.indexOf(Meteor.userId()) > -1;
      });
      var lastNewPostIndex = fetchedPosts.indexOf(firstOldPost) - 1;
      Session.set('lastNewPostId', fetchedPosts[lastNewPostIndex] ? fetchedPosts[lastNewPostIndex]._id: '');
      Meteor.setTimeout(function () {
        // console.log('running reader check');
        if (theWorkspace._id === FlowRouter.getParam('id')) {
          // console.log('enough time has passed on same page');
          for (var i = 0; i <= lastNewPostIndex; i++) {
            // console.log('marking ' + fetchedPosts[i]._id + ' read.');
            Meteor.call('markRead', fetchedPosts[i]._id);
          }
        }
      }, 8192);

      setTimeout(function(){        
        $('#chat-content-div').scrollTop($('#chat-content-div')[0].scrollHeight);
      }, 100);
      return thePosts;
    }
  },
  currentWorkspace: function () {
    return Workspaces.findOne({_id: FlowRouter.getParam('id')});
  },

  clientHeight: function() {
    var h=window.innerHeight || document.documentElement.clientHeight ||document.body.clientHeight;
    return (h-100)+'px';
  },
  /* attempt to scroll div to top */
  scroll: function updateScroll(){
    var element = document.getElementById("scroll-to-top");
    element.scrollTop = element.scrollHeight;
	},
  memberName: function () {
    var member = Meteor.users.findOne({_id: this.toString()});
    if (member && member.profile) {
      return member.profile.fullName;
    }
  },
  memberCompany: function () {
    var member = Meteor.users.findOne({_id: this.toString()});
    if (member && member.profile) {
      return member.profile.company;
    }
  },
  memberImageUrl: function () {
    var member = Meteor.users.findOne({_id: this.toString()});
    if (member && member.profile) {
      return member.profile.profileImage;
    }
  },
  userStatus: function () {
    var status = Meteor.users.findOne({_id: this.toString()}).status;
    if (status.idle === true && status.online === true) {
      return 'greyCircle';
    } else if (status.online === true) {
      return 'greenCircle';
    } else {
      return 'whiteCircle';
    }
  },
  customPermissions: function () {
    if (AutoForm.getFieldValue('permissions')) {
      return AutoForm.getFieldValue('permissions') === 'custom';
    }
    return false;
  },
  workspaceConnections: function () {
    return Meteor.users.find({_id: {$in: Workspaces.findOne({_id: FlowRouter.getParam('id')}).members}}).fetch().map(function (e, i, a) {
      return {label: e.profile.fullName, value: e._id};
    });
  },
  moreResults: function () {
    return !(WorkspacePosts.find().count() < Session.get('wsPostLimit'));
  },
  lastNewPost: function () {
    // console.log(this);
    return this._id === Session.get('lastNewPostId');
  },
  editWorkspacePostDoc: function () {
    if (Session.get('editWorkspacePostDoc')) {
      var doc = WorkspacePosts.findOne(Session.get('editWorkspacePostDoc'));
      if (doc && doc.content) {
        doc.content = deLinkify(doc.content);
      }
      return doc;
    } else {
      $('#edit-post-modal').modal('hide');
    }
  }
});

Template.workspace.events({
  'click .archive-workspace-btn': function (e) {
    e.preventDefault();
    var workspaceId = e.currentTarget.id;
    Workspaces.update({_id: workspaceId}, {$set: {archived: true}});
    FlowRouter.go('/workspaces');
  },
  'click .rename-workspace-btn': function (e) {
    e.preventDefault();
    var workspaceId = e.currentTarget.id;
    swal({
      title: "Rename your Message Board",
      text: "New name",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: true,
      animation: "slide-from-top",
      inputPlaceholder: "Type a name."
    },
    function (inputValue) {
      if (inputValue === false) return false;
      if (inputValue === "") {
        swal.showInputError("Type a name.");
        return false
      }
      Workspaces.update({_id: workspaceId}, {$set: {name: inputValue}});
    });
  },
  'click .duplicate-workspace-btn': function (e) {
    e.preventDefault();
    var workspaceId = e.currentTarget.id;
    var aWorkspace = Workspaces.findOne({_id: FlowRouter.getParam('id')});
    aWorkspace.name = 'Copy of ' + aWorkspace.name;
    Workspaces.insert(_.omit(aWorkspace, ['_id', 'updatedAt', 'createdAt']));
    FlowRouter.go('/workspaces');
  },
  'click .leave-workspace-btn': function (e) {
    e.preventDefault();
    Meteor.call('leaveWorkspace', e.currentTarget.id);
    FlowRouter.go('/workspaces');
  },
  'keydown div.note-editable.panel-body': function (e) {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault();
      $('#newWorkspaceMessageForm').submit();
    }
  },
  'click .add-member-btn': function (e) {
    // swal('add some members, son!');
    $('#add-ws-user-modal').modal('show');
  },
  'autocompleteselect textarea': function(event, template, doc) {
    console.log('tagged ', doc);
    Session.set('taggedUsers', (Session.get('taggedUsers') || []).concat(doc));
  },
  'click .restore-workspace-btn': function (e) {
    var userIsPremium = Meteor.user().settings ? Meteor.user().settings.premium || false : false;
    var numUserWorkspaces = Workspaces.find({ownerId: Meteor.userId()}).count();
    var workspaceId = e.currentTarget.id;
    if (workspaceId) {
      // if (userIsPremium) {
        Workspaces.update(workspaceId, {$set: {archived: false}});
      // } else if (numUserWorkspaces > 1) {
      //   swal({title: Settings.tooManyWorkspacesMessage, type: 'warning'});
      // }
    }
  },
  'keydown .workspace-post-field': function (e) {
    if (e.which == 13 && e.shiftKey == false) {
      e.preventDefault();
      $('#newWorkspaceMessageForm').submit();
      Meteor.setTimeout(function () {
        autosize($('textarea.form-control.workspace-post-field'));
      }, 512);
    }
  },
  'click .edit-post-btn': function (e) {
    Session.set('editWorkspacePostDoc', e.currentTarget.id);
    $('#edit-ws-post-modal').modal('show')
  }
});


// SOURCE: http://www.meteorpedia.com/read/Infinite_Scrolling
function showMoreVisible() {
  var threshold, target = $('#showMoreResults');
  if (!target.length) return;

  threshold = $(window).scrollTop() + $(window).height() - target.height();

  if (target.offset().top < threshold) {
    Session.set('wsPostLimit', Session.get('wsPostLimit') + Settings.feedIncrement);
  }
}
