Template.fab.events({
    'click #new-referral-btn': function (e) {
        $('#new-referral-modal').modal('show');
        Meteor.setTimeout(function () {
            document.getElementsByClassName('new-referral-field')[0].focus();
        }, 512);
    },

    'click #new-workspace-btn': function (e) {
        $('#new-workspace-modal').modal('show');
        Meteor.setTimeout(function () {
            document.getElementsByClassName('new-workspace-field')[0].focus();
        }, 512);
    },

    'click #new-post-btn': function (e) {

        var user = Meteor.user();
        if(!user.metadata.isCertified) {
            var expiresAt = user.metadata.expiresAt;
            if(!expiresAt || new Date()>new Date(expiresAt)) {
                swal("You expired. Please contact with administrator"); return;
            }
        }

        $('#new-post-modal').modal('show');
        AutoForm.resetForm('newNFPostModalForm');
        $('.file-upload-clear').click();
        Meteor.setTimeout(function () {
            autosize.update($('textarea.form-control.new-post-field'));
            document.getElementsByClassName('new-post-field')[0].focus();
        }, 512);

    },
    'click #invite-btn': function (e) {
        swal({
            title: "Send an invitation",
            text: 'Enter the email address to send to:',
            type: 'input',
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top"
        }, function (inputValue) {
            if (inputValue === false) {
                swal.close();
                return;
            }
            if (inputValue.search(SimpleSchema.RegEx.Email) > -1) {
                Meteor.call('saveInviteEmail', inputValue);
                var senderName = Meteor.user().profile.fullName || '';
                var email = 'mailto:' + inputValue
                    + "?subject=" + escape("Join me on Talloo")
                    + "&body=" + escape("I have been using Talloo to discover local business news and new leads. I'd like to add you to my network.\n\nTalloo is free.\n\nJoin me at https://app.talloo.com");
                window.location.href = email;
                Invites.insert({to: inputValue});
                swal.close();
            } else {
                swal.showInputError("It looks like you might have mistyped that email address.");
                return false;
            }
        });
    },
    'click #feedback-btn': function (e) {
        window.open('https://talloo.zendesk.com/hc/en-us/requests/new', '_blank');
    }
});

// href="mailto:email@echoecho.com?subject=SweetWords&body=Please send me a copy of your new program!"
