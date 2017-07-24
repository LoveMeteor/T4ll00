Meteor.methods({
    findUsersWithMobile: function(mobileNumber) {
        check(mobileNumber, String);

        var users = Meteor.users.find({'profile.phoneNumber':mobileNumber}).fetch();

        console.log("FindUsersWithMobile", mobileNumber, users);
        return users;
    },
    getToken: function (mobileNumber, memberId) {
        check(mobileNumber, String);
        check(memberId, String);

        var user = Meteor.users.findOne({'profile.phoneNumber':mobileNumber, 'metadata.memberId':memberId});

        if(user) {
            var token = LoginToken.createTokenForUser(user._id);

            console.log("LoginToken createdToken", token, user._id, user);
            return token;
        } else {
            return null;
        }
    },

    'sendMemberIdSMS': function (mobileNumber) {
        check(mobileNumber, String);
        console.log(mobileNumber);

        var user = Meteor.users.findOne({'profile.phoneNumber': mobileNumber});

        if(user && user.metadata.memberId) {
            sendSMS(mobileNumber, user.metadata.memberId);

            return user.metadata.memberId;
        } else {

            // Generate Random code for sms verifications
            var randomCode = getRandomInt(100000, 999999).toString();

            while(Meteor.users.find({'metadata.memberId': randomCode}).count()>0) {
                randomCode = getRandomInt(100000, 999999).toString();
            }

            if(!user) {
                Accounts.createUser({
                    username: mobileNumber,
                    memberId: randomCode,
                    profile: {
                        phoneNumber: mobileNumber
                    }
                })
            } else {
                if(user.metadata.isCertified)
                    Meteor.users.update({_id:user._id}, {$set:{'metadata.memberId':randomCode}});
                else
                    Meteor.users.update({_id:user._id}, {$set:{'metadata.memberId':randomCode, 'metadata.expiresAt':moment().add(7, 'day').toDate()}});
            }
            sendSMS(mobileNumber, randomCode);

            return randomCode;
        }

    },
    'verifyMemberId': function (phoneNumber, memberId) {
        check(phoneNumber, String);
        check(memberId, String);
        var user = Meteor.users.findOne({'profile.phoneNumber': phoneNumber});

        if(user.metadata.memberId === memberId) return true;
        return false;
    },
    'setCertified': function(userId, certified) {
        check(userId, String);
        check(certified, Boolean);

        Meteor.users.update({_id: userId}, {$set:{'metadata.isCertified':certified}});
    }

});
// Used for SMS code generation.
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function sendSMS(mobileNumber, memberId) {
    // Account SID and Account Token for Twilio
    var accountSID = 'AC5d7534e8c98bab6d49b3b2b60fe3cd95';
    var authToken = '0c8b44b4f96ca08901bc4fb48f5425f8';
    // Pass the account SID and Auth Token to Twilio client
    var client = Twilio(accountSID, authToken);
    // Send the message United States & Candada only for now.
    client.sendMessage({
        to: '+1' + mobileNumber, // Any number Twilio can deliver to
        from: '+12089146732', // A number you bought from Twilio and can use for outbound communication
        body: 'Hi , your Talloo member id is: ' + memberId
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
}