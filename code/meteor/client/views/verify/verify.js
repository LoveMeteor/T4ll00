Template.verify.onRendered(function () {
    Meteor.subscribe('allUsers');

    Session.set('step', 1);
});
function formatPhone (phoneNumber) {
    var numbers = phoneNumber.replace(/\D/g, ''),
        char = {0: '(', 3: ') ', 6: '-'};
    phoneNumber = '';
    for (var i = 0; i < numbers.length; i++) {
        phoneNumber += (char[i] || '') + numbers[i];
    }

    return phoneNumber;
}

Template.verify.helpers({
    step1: function () {
        return Session.get('step') == 1;
    },
    step2: function () {
        return Session.get('step') == 2;
    },
    step3: function () {
        return Session.get('step') == 3;
    }
});

Template.verify.events({
    'keydown #mobile-number-input': function (e) {
        if(e.which != 8 && e.which != 37 && e.which != 39 && e.which != 46)
            e.preventDefault();

        if(e.which<0x30 || e.which>0x39) {

        } else {
            var val = $("#mobile-number-input").val();
            if(val.length<=13) {
                val += String.fromCharCode(e.which);

                $("#mobile-number-input").val(formatPhone(val));
            }
        }
    },
    'click #verify-continue1-btn': function (e) {
        var mobileNumber = $("#mobile-number-input").val().match(/\d+/g).join([]);
        if (mobileNumber) {
            console.log("verify1", mobileNumber);
            Meteor.call('findUsersWithMobile', mobileNumber, function (err, users) {
                if (err) {
                    console.log("findUsersWithMobile", err);
                } else {
                    if (users.length == 0) {
                        Session.set('newUser', true);
                        swal({
                            title: "Are you sure?",
                            text: "We could not found the mobile that you entered!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Create new account with this mobile",
                            cancelButtonText: "Login with email",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        }, function (isConfirm) {
                            if (isConfirm) {
                                Meteor.call("sendMemberIdSMS", mobileNumber, function (err, res) {
                                    if (err) {
                                        console.log("sendMemberVerifySMS failed", err);
                                        return;
                                    }
                                    console.log("sendMemberIdSMS Result", res);
                                    setCookie('talloo.mobileNumber', mobileNumber, 15);
                                    Session.set('step', 2);
                                });
                            } else {
                                location.href = '/login';
                            }
                        });
                    } else {
                        Meteor.call("sendMemberIdSMS", mobileNumber, function (err, res) {
                            if (err) {
                                console.log("sendMemberVerifySMS failed", err);
                                return;
                            }
                            console.log("sendMemberIdSMS Result", res);
                            setCookie('talloo.mobileNumber', mobileNumber, 15);
                            Session.set('step', 2);
                        });
                    }
                }
            });

        }
    },
    'click #verify-continue2-btn': function (e) {
        var mobileNumber = getCookie('talloo.mobileNumber'),
            memberNumber = $("#member-number-input").val();

        if (mobileNumber && memberNumber) {
            Meteor.call("verifyMemberId", mobileNumber, memberNumber, function (err, res) {
                if (err) {
                    console.log("sendMemberVerifySMS failed", err);
                    return;
                }

                if (res == true) {
                    if(Session.get('newUser')) {
                        Session.set('step', 3);
                    } else {
                        location.href = "/";
                    }
                    setCookie('talloo.memberId', memberNumber);
                } else {
                    swal('Could not verify your member id.');
                }
            });
        }
    },
    'click #verify-accept-btn': function (e) {
        //if(!$("#tos-checkbox").attr('checked') || !$("#pp-checkbox").attr('checked')) {
        //    swal('You must accept our policy.');
        //} else {
        location.href = "/";
        //}
    }
});