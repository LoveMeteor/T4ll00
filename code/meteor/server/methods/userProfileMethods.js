Meteor.methods({
    'updateName': function (firstName, lastName) {
        check(firstName, String);
        check(lastName, String);
        Meteor.users.update({_id: Meteor.user()._id}, {
            $set: {
                'profile.firstName': firstName,
                'profile.lastName': lastName,
                'profile.fullName': firstName + ' ' + lastName
            }
        });
    },
    'updateTitle': function (title) {
        check(title, String);
        Meteor.users.update({_id: Meteor.user()._id}, {$set: {'profile.title': title}});
    },
    'updateCompany': function (company) {
        check(company, String);
        Meteor.users.update({_id: Meteor.user()._id}, {$set: {'profile.company': company}});
    },
    'updatePhoneNumber': function (phoneNumber) {
        // Check phone number is a string.
        check(phoneNumber, String);
        console.log(phoneNumber);
        // Generate Random code for sms verifications
        var randomCode = getRandomInt(100000, 999999).toString();
        // Insert the verification code sent with the user ID into user secure.
        // Update user with phone verified field to false.
        Meteor.users.update({_id: Meteor.user()._id}, {
            $set: {
                'metadata.smsVerified': 'pending',
                'secure.smsCode': randomCode,
                'secure.numberVerify': phoneNumber
            }
        });
        // Account SID and Account Token for Twilio
        var accountSID = 'AC5d7534e8c98bab6d49b3b2b60fe3cd95';
        var authToken = '0c8b44b4f96ca08901bc4fb48f5425f8';
        // Pass the account SID and Auth Token to Twilio client
        var client = Twilio(accountSID, authToken);
        // Send the message United States & Candada only for now.
        client.sendMessage({
            to: '+1' + phoneNumber, // Any number Twilio can deliver to
            from: '+12089146732', // A number you bought from Twilio and can use for outbound communication
            body: 'Hi ' + Meteor.user().profile.firstName + ', your Talloo confirmation code is: ' + randomCode
        }, function (err, responseData) { //this function is executed when a response is received from Twilio
            if (!err) { // "err" is an error received during the request, if any

                // "responseData" is a JavaScript object containing data received from Twilio.
                // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                // console.log(responseData.from); // outputs "+14506667788"
                // console.log(responseData.body); // outputs "word to your mother."

            } else {
                console.log(err);
            }
        });
    },
    'verifyPhoneNumber': function (verificationCode) {
        check(verificationCode, String);
        var userData = Meteor.users.findOne({_id: this.userId});
        if (userData.secure.smsCode === verificationCode) {
            Meteor.users.update({_id: this.userId}, {
                $set: {
                    'metadata.smsVerified': 'true',
                    'profile.phoneNumber': userData.secure.numberVerify
                }
            });
            return true;
        } else {
            return false;
        }
    },
    'updateEmail': function (email) {
        check(email, String);
        Meteor.users.update({_id: Meteor.user()._id}, {$set: {'emails.0.address': email}});
    },
    'updateAddress': function (street, city, state, zip) {
        check(street, String);
        check(city, String);
        check(state, String);
        check(zip, String);
        Meteor.users.update({_id: Meteor.user()._id},
            {
                $set: {
                    'profile.streetAddress': street,
                    'profile.city': city,
                    'profile.state': state,
                    'profile.zip': zip
                }
            });
    },
    'updateWebAddress': function (webAddress) {
        check(webAddress, String);
        Meteor.users.update({_id: Meteor.user()._id}, {$set: {'profile.webAddress': webAddress}});
    },
    'updateUserImage': function (imageID) {
        check(imageID, String);
        Meteor.users.update({_id: Meteor.user()._id}, {$set: {'profile.profileImage': imageID}});
    },
    'setProfilePhotoUrl': function (url) {
        check(url, String);
        Meteor.users.update({_id: this.userId}, {$set: {'profile.profileImage': url}});
    },
    'checkService': function () {
        var user = Meteor.users.findOne({_id: this.userId});
        if (user.services.password) {
            return true;
        } else {
            return false;
        }
    },
    'updateUserSettings': function (phone, address, email) {
        check(phone, Boolean);
        check(address, Boolean);
        check(email, Boolean);
        Meteor.users.update({'_id': this.userId}, {
            $set: {
                'settings.phonePublic': phone,
                'settings.addressPublic': address,
                'settings.emailPublic': email
            }
        }, {multi: true});
    },
    'updatedLinkedIn': function (address) {
        check(address, String);
        Meteor.users.update({'_id': this.userId}, {$set: {'profile.linkedInProfileUrl': address}});
    },
    'updateFacebook': function (address) {
        check(address, String);
        Meteor.users.update({'_id': this.userId}, {$set: {'profile.facebookProfileUrl': address}})
    },
    'updateTwitter': function (address) {
        check(address, String);
        Meteor.users.update({'_id': this.userId}, {$set: {'profile.twitterProfileUrl': address}})
    },
    'deactivateAccount': function () {
        Meteor.users.update({'_id': this.userId}, {$set: {'settings.deactivated': true}});
    },
    'checkActivation': function () {
        if (Meteor.users.findOne({'_id': this.userId}).settings.deactivated) {
            Meteor.users.update({'_id': this.userId}, {$set: {'settings.deactivated': false}});
        }
    },
    'resetVerification': function () {
        Meteor.users.update({'_id': this.userId}, {$set: {'metadata.smsVerified': 'false'}});
    }
});


// function logArrayElements(element, index, array) {
//   console.log('a[' + index + '] = ' + element);
// }

// // Note elision, there is no member at 2 so it isn't visited
// [2, 5, , 9].forEach(logArrayElements);
// // logs:
// // a[0] = 2
// // a[1] = 5
// // a[3] = 9

// Used for SMS code generation. 
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}