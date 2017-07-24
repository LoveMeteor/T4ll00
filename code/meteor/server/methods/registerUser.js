String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Meteor.methods({
  'registerUser': function (firstName, lastName, company, email, password) {
    check(firstName, String);
    check(lastName, String);
    check(company, String);
    check(email, String);
    check(password, String);

    firstName = firstName.capitalize();
    lastName = lastName.capitalize();
    
    var userId = Accounts.createUser({
      email: email,
      password: password,
      profile: {
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + ' ' + lastName,
        company: company,
        searchEmail: email.replace('@', 'emailAt'),
        title: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        state: '',
        zip: '',
        webAddress: '',
        profileImage: 'https://talloo.imgix.net/profilePhotos/defaultUser.png',
        linkedInProfileUrl: '',
        facebookProfileUrl: '',
        twitterProfileUrl: '',
      }});
  }
});

Accounts.onCreateUser(function(options, user) {

  var token = Random.hexString(20).toLowerCase(); console.log("Activation Token"); console.log(token);

  // Default fields for all users.
  user.secure = {smsCode: '', numberVerify: '', passwordResetToken: '', activationToken: token};
  user.metadata = {smsVerified: '', isActivated: false};

  if(options.memberId) {
    user.metadata.memberId = options.memberId;
    user.metadata.expiresAt = moment().add(7, 'day').toDate();
  }

  user.connections = {
    'connected': [],
    'blocked': [],
    'following': []
  };
  user.workspaces = [];
  user.notifications = [];
  user.pinned = [];
  user.settings = {
    'phonePublic': true,
    'emailPublic': true,
    'addressPublic': true,
    'deactivated': false
  };
  // Check what oAuth Service is being used.  Assign Data accordingly.
  // Twitter oAuth
  if (user.services.twitter) {
    twitterOptions = {
      firstName: user.services.twitter.screenName,
      lastName: '',
      fullName: user.services.twitter.screenName,
      company: '',
      title: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      zip: '',
      webAddress: '',
      profileImage: 'https://talloo.imgix.net/profilePhotos/defaultUser.png',
      linkedInProfileUrl: '',
      facebookProfileUrl: ''
    };
    // Set user profile to twitterOptions
    user.profile = twitterOptions;
    return user;

    // Google oAuth
  } else if (user.services.google) {
    googleOptions = {
      firstName: user.services.google.given_name,
      lastName: user.services.google.family_name,
      fullName: user.services.google.given_name + ' ' + user.services.google.family_name,
      company: '',
      title: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      zip: '',
      webAddress: '',
      profileImage: 'https://talloo.imgix.net/profilePhotos/defaultUser.png',
      linkedInProfileUrl: '',
      facebookProfileUrl: ''
    };
    user.profile = googleOptions;
    //Get user email from Google
    user.emails = [{'address': user.services.google.email, 'verified': true}];
    return user;

    // Facebook oAuth
  } else if (user.services.facebook) {
    facebookOptions = {
      firstName: user.services.facebook.first_name,
      lastName: user.services.facebook.last_name,
      fullName: user.services.facebook.first_name + ' ' + user.services.facebook.last_name,
      company: '',
      searchEmail: user.services.facebook.email.replace('@', 'emailAt'),
      title: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      zip: '',
      webAddress: '',
      profileImage: 'https://talloo.imgix.net/profilePhotos/defaultUser.png',
      linkedInProfileUrl: '',
      facebookProfileUrl: user.services.facebook.link
    };
    user.profile = facebookOptions
    // Get user email from Facebook
    user.emails = [{'address': user.services.facebook.email, 'verified': true}];
    return user;

  } else if (user.services.linkedin) {
    linkedInOptions = {
      // Get name from Linked In.
      firstName: user.services.linkedin.firstName,
      lastName: user.services.linkedin.lastName,
      fullName: user.services.linkedin.firstName + ' ' + user.services.linkedin.lastName,
      company: '',
      title: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      zip: '',
      webAddress: '',
      profileImage: 'https://talloo.imgix.net/profilePhotos/defaultUser.png',
      // Get profile URL from Linked In.
      linkedInProfileUrl: user.services.linkedin.publicProfileUrl,
      facebookProfileUrl: ''
    };
    user.profile = linkedInOptions;
    // Get user email from LinkedIn
    user.emails = [{'address': user.services.linkedin.emailAddress, 'verified': true}];
    return user;
    // Talloo direct signup (email & password)
  } else {
    user.profile = options.profile;
    return user;
  }
});


Meteor.users.after.insert(function (userId, user) {


  if(user && !user.profile.phoneNumber) {
    var tallooMail = new Mailgun({
      apiKey: 'key-02b1a58e9b640cbed4b944e9bee25f4b',
      domain: 'app.talloo.com'
    });
    tallooMail.send({
      'to': 'hello@talloo.com',
      'from': 'hello@talloo.com',
      'html': '<html><head></head><body>' +
      '<h4>Hello,</h4>' +
      '<p>'+user.profile.fullName+' joined to Talloo newly.</p><p>To activate this user click this <a href="'+Meteor.absoluteUrl()+'activate-user/'+user._id+'?token='+user.secure.activationToken+'">link</a></p>' +
      '</body></html>',
      'text': '',
      'subject': 'Talloo Notice - ' + user.profile.fullName + ' signed up'
    });
  }
});

