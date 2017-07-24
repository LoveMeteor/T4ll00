
/*Accounts.validateLoginAttempt(function(attempt){ console.log("Accounts.validateLoginAttempt");
    if(!attempt.allowed)
        return false;

    if(!attempt.user)
        return false;

    var user = attempt.user;

    console.log(attempt.methodName);
    if(user.metadata.hasOwnProperty('isActivated')) {console.log("IsActivated="+user.metadata.isActivated, user);
        if(user.metadata.isActivated!=true) {
            throw new Meteor.Error(444, 'You must be activated by administrator');
            //return false;
        }

    }


    return true;
});*/