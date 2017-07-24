Template.register.helpers({

});

Template.register.events({
  'submit #register-user-form' : function (e, t) {
    e.preventDefault();
    var userData = $(e.currentTarget),
    firstName = userData.find('#first').val(),
    lastName = userData.find('#last').val(),
    company = userData.find('#company').val(),
    email = userData.find('#email').val(),
    password = userData.find('#password').val(),
    passwordConfirm = userData.find('#password-confirm').val();
    if (password === passwordConfirm) {
      // Register User
      Meteor.call('registerUser', firstName, lastName, company, email, password);
      // Log User In
      /*Meteor.loginWithPassword(email, password, function(err) {
        if (err) {
          console.log('DEBUG> signIn.js loginWithPassword error:');
        } else {          
          setCookie('talloo.email', email, 15);
          setCookie('talloo.password', password, 15);
          location.href = '/news';
        }
      });*/

      swal('You must be activated before you can gain access.');

    } else {
      swal('Your passwords do not match.');
    }
  },
  'click #linked-in-login': function(e) {
    Meteor.loginWithLinkedin({}, function(err){
      if (err) {
        swal('Oops something went wrong, would you try again?');
        // throw new Meteor.Error("Linked In login failed");
      } else {
        location.href = '/news';
      }
    });
  },
  'click #google-login': function(e) {
    Meteor.loginWithGoogle({}, function(err){
      if (err) {
        swal('Oops something went wrong, would you try again?');
        // throw new Meteor.Error("Google login failed");
      } else {
        location.href = '/news';
      }
    });
  },
  'click #twitter-login': function(e) {
    Meteor.loginWithTwitter({}, function(err){
      if (err) {
        swal('Oops something went wrong, would you try again?');
        // throw new Meteor.Error("Twitter login failed");
      } else {
        location.href = '/news';
      }
    });
  },
  'click #facebook-login': function(e) {
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        if(err.error == 444) {
          swal(err.reason);
        } else {
          swal('Oops something went wrong, would you try again?');
        }
        // throw new Meteor.Error("Facebook login failed");
      } else {
        location.href = '/news';
      }
    });
  }
})
