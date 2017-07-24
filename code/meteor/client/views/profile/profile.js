// Template.profile.onCreated(function (){
//   uploader = new Slingshot.Upload("profilePhotos");
// });



Template.profile.helpers({
  formatPhone : function(phoneNumber) {
      var numbers = phoneNumber.replace(/\D/g, ''),
          char = {0:'(',3:') ',6:'-'};
      phoneNumber = '';
      for (var i = 0; i < numbers.length; i++) {
          phoneNumber += (char[i]||'') + numbers[i];
      }

      return phoneNumber;
  },
  title : function () {
    if (Meteor.user().profile.title) {
      return true;
    } else {
      return false;
    }
  },
  company: function () {
    if (Meteor.user().profile.company) {
      return true;
    } else {
      return false;
    }
  },
  phoneNumber: function () {
    if (Meteor.user().profile.phoneNumber) {
      return true;
    } else {
      return false;
    }
  },
  pendingVerification: function () {
    if (Meteor.user().metadata.smsVerified === 'pending') {
      return true;
    } else {
      return false;
    }
  },
  email : function () {
    if (Meteor.user().emails[0].address) {
      return true;
    } else {
      return false;
    }
  },
  address: function () {
    if (Meteor.user().profile.streetAddress && Meteor.user().profile.city && Meteor.user().profile.state && Meteor.user().profile.zip) {
      return true;
    } else {
      return false;
    }
  },
  webAddress: function () {
    if (Meteor.user().profile.webAddress) {
      return true;
    } else {
      return false;
    }
  },
  editName: function () {
    return Session.get('editName');
  },
  editTitle: function () {
    return Session.get('editTitle');
  },
  editCompany: function () {
    return Session.get('editCompany');
  },
  editPhone: function () {
    return Session.get('editPhone');
  },
  editEmail: function () {
    return Session.get('editEmail');
  },
  editAddress: function () {
    return Session.get('editAddress');
  },
  editWebAddress: function () {
    return Session.get('editWebAddress');
  },
  editLinkedIn: function () {
    return Session.get('editLinkedin');
  },
  editFacebook: function () {
    return Session.get('editFacebook');
  },
  editTwitter: function () {
    return Session.get('editTwitter');
  },
  profileImageCheck: function () {
    if (!Meteor.user().profile.profileImage || Meteor.user().profile.profileImage === 'https://talloo.imgix.net/profilePhotos/defaultUser.png') {
      return false;
    } else {
      return true;
    }
  },
  profileImage: function () {
    return Meteor.user().profile.profileImage?Meteor.user().profile.profileImage:'https://talloo.imgix.net/profilePhotos/defaultUser.png';
  },
  postImage: function () {
    return Meteor.user().profile.profileImage;
  },
  settingsEdit: function () {
    return Session.get('settingsEdit');
  },
  historyVisible: function () {
    return Session.get('historyVisible');
  }
});

Template.profile.events({
  'click #editName': function (e, t) {
    e.preventDefault();
    Session.set('editName', true);
  },
  'click #saveName': function (e, t) {
    e.preventDefault();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    Meteor.call('updateName', firstName, lastName);
    Session.set('editName', false);
  },
  'click #addTitle': function (e, t) {
    e.preventDefault();
    Session.set('editTitle', true);
  },
  'click #editTitle': function (e, t) {
    e.preventDefault();
    Session.set('editTitle', true);
  },
  'click #saveTitle': function (e, t) {
    e.preventDefault();
    var title = $('#newTitle').val();
    Meteor.call('updateTitle', title);
    Session.set('editTitle', false);
  },
  'click #addCompany': function (e, t) {
    e.preventDefault();
    Session.set('editCompany', true);
  },
  'click #editCompany': function (e, t) {
    e.preventDefault();
    Session.set('editCompany', true);
  },
  'click #saveCompany': function (e, t) {
    e.preventDefault();
    var company = $('#newCompany').val();
    Meteor.call('updateCompany', company);
    Session.set('editCompany', false);
  },
  'click #editPhoneNumber' : function (e, t) {
    e.preventDefault();
    Session.set('editPhone', true);
  },
  'click #addPhone': function (e, t) {
    e.preventDefault();
    Session.set('editPhone', true);
  },
  'click #saveConfirm': function (e, t) {
    e.preventDefault();
    var confirmCode = $('#smsConfirmCode').val();
    Meteor.call('verifyPhoneNumber', confirmCode, function (err, result) {
      if (err) {
        swal('Something went wrong. Please try verifiying your number again.');
      } else {
        if (result === true) {
          swal('Thanks for verifying your phone number with Talloo');
        } else {
          swal('The verification code your provided does not match the code we sent you, please try again.');
        }
      }
    });
  },
  'click #editEmail': function (e, t) {
    e.preventDefault();
    Meteor.call('checkService', function (error, result){
      if (result === true) {
        swal('Changing your email will also change your login email.');
        Session.set('editEmail', true);
      } else {
        Session.set('editEmail', true);
      }
    });
  },
  'click #editLinkedIn': function (e, t) {
    e.preventDefault();
    Session.set('editLinkedin', true);
  },
  'click #editFacebook': function (e, t) {
    e.preventDefault();
    Session.set('editFacebook', true);
  },
  'click #editTwitter': function (e, t) {
    e.preventDefault();
    Session.set('editTwitter', true);
  },
  'click #editAddress': function (e, t) {
    e.preventDefault();
    Session.set('editAddress', true);
  },
  'click #editWebAddress': function (e, t) {
    e.preventDefault();
    Session.set('editWebAddress', true);
  },
  'click #saveNumber': function (e, t) {
    e.preventDefault();
    var phoneNumber = $('#newPhoneNumber').val();
    Meteor.call('updatePhoneNumber', phoneNumber);
    Session.set('editPhone', false);
  },
  'click #saveEmail': function (e, t) {
    e.preventDefault();
    var email = $('#newEmail').val();
    Meteor.call('updateEmail', email);
    Session.set('editEmail', false);
  },
  'click #saveAddress': function (e, t) {
    e.preventDefault();
    var street = $('#street').val();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#zip').val();
    Meteor.call('updateAddress', street, city, state, zip);
    Session.set('editAddress', false);
  },
  'click #saveWebAddress': function (e, t) {
    e.preventDefault();
    var webAddress = $('#webAddress').val();
    Meteor.call('updateWebAddress', webAddress);
    Session.set('editWebAddress', false);
  },
  'click #saveLinkedInAddress': function (e, t) {
    e.preventDefault();
    var linkedInAddress = '' + $('#linkedinAdress').val();
    Meteor.call('updatedLinkedIn', linkedInAddress);
    Session.set('editLinkedin', false);
  },
  'click #saveFacebookAddress': function (e, t) {
    e.preventDefault();
    var facebookAddress = '' + $('#facebookAddress').val();
    Meteor.call('updateFacebook', facebookAddress);
    Session.set('editFacebook', false);
  },
  'click #saveTwitterAddress': function (e, t) {
    e.preventDefault();
    var twitterAddress = '' + $('#twitterAddress').val();
    Meteor.call('updateTwitter', twitterAddress);
    Session.set('editTwitter', false);
  },

  'click #uploadPhoto': function (e, t) {
    e.preventDefault();
    $('#profileUpload').click();
  },
  'change #profileUpload': function(e, t) {
    e.preventDefault();
    uploader = new Slingshot.Upload("profilePhotos");
    var file = $('#profileUpload')[0].files[0];
    uploader.send(file, function (error, downloadUrl){
      if (error) {
        console.log(error);
      } else {
        Meteor.call('setProfilePhotoUrl', downloadUrl.replace('https://talloo.s3.amazonaws.com/images', 'https://talloo.imgix.net'));
      }
    });
  },
  'click #accountSettingsToggle': function (e, t) {
    e.preventDefault();

    var settingsEdit = Session.get('settingsEdit');
    Session.set('settingsEdit', !settingsEdit);
  },
  'click #historyToggle': function (e, t) {
    e.preventDefault();

    var historyVisible = Session.get('historyVisible');
    Session.set('historyVisible', !historyVisible);
  },
  'click #resetConfirm': function () {
    Meteor.call('resetVerification');
    Session.set('editPhone', true);
  }
});


Template.accountSettings.onRendered(function () {
  $("#phone-switch").bootstrapSwitch();
  $("#address-switch").bootstrapSwitch();
  $("#email-switch").bootstrapSwitch();
  $("#smsnotify-switch").bootstrapSwitch();
  $("#emailnotify-switch").bootstrapSwitch();
  $("#browsernotify-switch").bootstrapSwitch();
});


Template.accountSettings.helpers({
  phoneCheck: function () {
    return Meteor.user().settings.phonePublic;
  },
  addressCheck: function () {
    return Meteor.user().settings.addressPublic;
  },
  emailCheck: function () {
    return Meteor.user().settings.emailPublic;
  }
});

Template.accountSettings.events({
  'click #saveSettings': function (e, t) {
    var phone = $('#phone-switch').prop('checked');
    var address = $('#address-switch').prop('checked');
    var email = $('#email-switch').prop('checked');
    Meteor.call('updateUserSettings', phone, address, email);
    Session.set('settingsEdit', false);
  },
  'click #deactivateAccount': function (e, t) {
    $('#deactivate-modal').modal('show');
  }
});

Template.history.helpers({

  recentPosts: function () {
    var posts = NewsFeedPosts.find({author: Meteor.user()._id});
    if(posts.count() == 0)
      Session.set('noHistory', true);
    else
      Session.set('noHistory', false);

    return posts;
  },
  noHistory: function() {
    return Session.get('noHistory');
  }
});
// Albert need code for notification switches on/off
