Template.login.events({
    'click #linkedin-login': function (e) {
        Meteor.loginWithLinkedin({}, function (err) {
            if (err) {
                throw new Meteor.Error("Linked In login failed");
            } else {
                Meteor.call('checkActivation');
                location.href = '/news';
            }
        });
    },
    'click #google-login': function (e) {
        Meteor.loginWithGoogle({}, function (err) {
            if (err) {
                throw new Meteor.Error("Google login failed");
            } else {
                Meteor.call('checkActivation');
                location.href = '/news';
            }
        });
    },
    'click #twitter-login': function (e) {
        Meteor.loginWithTwitter({}, function (err) {
            if (err) {
                throw new Meteor.Error("Twitter login failed");
            } else {
                Meteor.call('checkActivation');
                location.href = '/news';
            }
        });
    },
    'click #facebook-login': function (e) {
        Meteor.loginWithFacebook({}, function (err) {
            if (err) {
                //throw new Meteor.Error("Facebook login failed");
                if (err.error == 444) {
                    swal(err.reason);
                } else {
                    swal('Oops something went wrong, would you try again?');
                }
            } else {
                Meteor.call('checkActivation');
                location.href = '/news';
            }
        });
    },
    'submit #login-password-form': function (e, t) {
        e.preventDefault();
        loginCredentials = $(e.currentTarget),
            email = loginCredentials.find('#email').val(),
            password = loginCredentials.find('#password').val();

        // Call Meteor Internal Login Method
        Meteor.loginWithPassword(email, password, function (err) {
            console.log("After login method");
            if (err) {
                console.log('DEBUG> signIn.js loginWithPassword error:');
                console.log(err);

                if (err.error == 444) {
                    swal(err.reason)
                } else {
                    swal('There was a problem logging you in. Please try again.');
                }
            } else {
                setCookie('talloo.email', email, 15);
                setCookie('talloo.password', password, 15);
                //Session.set('login.email', email);
                //Session.set('login.password', password);
                Meteor.call('checkActivation');
                location.href = '/news';
            }
        });
    },
    'click #create-account-btn': function (e) {
        Meteor.call('authorizeWithMemberId', '2087777777', '317219', function(err,res){
           if(err) {
               console.log("Create Token failed", err);
           } else {
               console.log("Created Token success", res);

               LoginToken.on('loggedInClient', function(){
                   console.log("LoginToken loggedInClient", Meteor.user());
               });
               LoginToken.on('errorClient', function(err){
                   console.log("LoginToken errorClient", err);
               });
               LoginToken.checkToken(res, {});
           }
        });
    },
    'click #forgot-password-btn': function (e) {
        Meteor.call('checkLoginStatus', function(err,res){
            if(err) {
                console.log("Check Login failed", err);
            } else {
                console.log("Check Login success", res, Meteor.userId(), Meteor.user());


            }
        });
    }
});
