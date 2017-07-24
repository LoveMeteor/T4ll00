Template.news.helpers({
    newsPosts: function () {
        var posts = NewsFeedPosts.find({removed: false}, {sort: {createdAt: -1}});
        if (posts) {
            Meteor.subscribe('newsFeedPostComments', _.pluck(posts.fetch(), '_id'));
            Meteor.subscribe('publicUserData', _.pluck(posts.fetch(), 'author'));
            return posts;
        }
    },
    moreResults: function () {
        return !(NewsFeedPosts.find({removed: false}, {sort: {createdAt: -1}}).count() < Session.get('newsFeedLimit'));
    },
    formatPhone: function (phoneNumber) {
        var numbers = phoneNumber.replace(/\D/g, ''),
            char = {0: '(', 3: ') ', 6: '-'};
        phoneNumber = '';
        for (var i = 0; i < numbers.length; i++) {
            phoneNumber += (char[i] || '') + numbers[i];
        }

        return phoneNumber;
    },
    pinnedPosts: function () {
        var posts = NewsFeedPosts.find({_id: {$in: Meteor.user().pinned}, removed: false}, {sort: {createdAt: -1}});
        if (posts) {
            Meteor.subscribe('newsFeedPostComments', _.pluck(posts.fetch(), '_id'));
            Meteor.subscribe('publicUserData', _.pluck(posts.fetch(), 'author'));
            return posts;
        }
    },
    userPinned: function (post) {
        return Meteor.user().pinned.indexOf(post._id) > -1;
    }
});


Template.news.events({
    'click': function (e, t) {
        $('.heart-btn').parent().parent().removeClass('open');
    },
    'click .heart-btn': function (e, t) {
        e.preventDefault();
        if (NewsFeedPosts.findOne(e.currentTarget.id) && NewsFeedPosts.findOne(e.currentTarget.id).likedBy.indexOf(Meteor.userId()) < 0) {
            Meteor.call('addLikeToPost', e.currentTarget.id);
        } else {
            Meteor.call('removeLikeFromPost', e.currentTarget.id);
        }
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
    'mouseover .heart-btn': function (e, t) {
        e.preventDefault();
        $('.heart-btn').parent().parent().removeClass('open');

        var post = NewsFeedPosts.findOne(e.currentTarget.id) && NewsFeedPosts.findOne(e.currentTarget.id);

        if (post.likedBy.length) {
            $(e.target).parent().parent().addClass('open');
        }
    },
    'click .remove-post-btn': function (e) {
        e.preventDefault();
        NewsFeedPosts.update(e.currentTarget.id, {$set: {removed: true}});
    },
    'click .edit-post-btn': function (e) {
        e.preventDefault();
        Session.set('editPostId', e.currentTarget.id);
        $('#edit-post-modal').modal('show');
        Meteor.setTimeout(function () {
            autosize.update($('textarea'));
        }, 256);
    },
    'click .edit-post-comment-btn': function (e) {
        e.preventDefault();
        Session.set('editPostCommentId', e.currentTarget.id);
        console.log('new edit commment id', e.currentTarget.id);
        $('#edit-post-comment-modal').modal('show');
        Meteor.setTimeout(function () {
            autosize.update($('textarea'));
        }, 256);
    },
    'click .send-workspace-post-btn': function (e) {
        e.preventDefault();
        Session.set('selectedPost', e.currentTarget.id);
        $('#send-workspace-modal').modal('show');
        // NewsFeedPosts.update(e.currentTarget.id, {$set: {removed: true}});
    },
    'click .remind-post-btn': function (e) {
        e.preventDefault();
        Session.set('postId', e.currentTarget.id);
        $('#new-reminder-modal').modal('show');
    },
    'click .pin-post-btn': function (e) {
        e.preventDefault();
        Meteor.call('addPin', e.currentTarget.id);
        // TODO: call back with user feedback
    },
    'click .unpin-post-btn': function (e, t) {
        e.preventDefault();
        console.log('unpin');
        Meteor.call('removePin', e.currentTarget.id);
    },
    'click .share-post-btn': function (e) {
        e.preventDefault();
        Session.set('sharePostId', e.currentTarget.id);
        $('#share-post-modal').modal('show');
    },
    'click #people-post-btn': function (e) {
        e.preventDefault();
    },
    // 'blur input[type="text"][name="content"]': function (e) {
    //   if (!$(e.currentTarget).val()) {
    //     Session.set($(e.currentTarget).parents('form.form-inline')[0].id, false);
    //   }
    // },
    'focusin .comment-field': function (e) {
        // $(e.currentTarget).shiftenter({hint: ''});
        autosize($(e.currentTarget));
        // $('.file-upload-clear').click();
        Session.set($(e.currentTarget).parents('form.form-inline')[0].id, true);
    },
    'autocompleteselect textarea': function (event, template, doc) {
        console.log('tagged ', doc);
        Session.set('taggedUsers', (Session.get('taggedUsers') || []).concat(doc));
    },
    'keydown .comment-field': function (e) {
        if (e.which == 13 && e.shiftKey == false) {
            e.preventDefault();
            $($(e.currentTarget).parents('form.form-inline')[0]).submit();
        }
    },
    /* Start Invite */
    'click #invite-btn': function (e) {
        swal({
            title: "Share Talloo",
            text: 'Enter an email address.',
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
                    + "?subject=" + escape("Talloo + You")
                    + "&body=" + escape("Hi,\n\n Have you heard of Talloo? It's where I network to find new business. I thought you might be interested.\n\n Talloo is completely free. You should join and connect with me there.\n\nHere's the link: https://app.talloo.com");
                window.location.href = email;
                Invites.insert({to: inputValue});
                swal.close();
            } else {
                swal.showInputError("Please enter only one email address.");
                return false;
            }
        });
    }, /* end invite */

    'click .report-post-btn': function (e) {
        e.preventDefault();
        swal({
            title: "Report Post",
            text: '<p style="text-align: left;">You are reporting that this post is not compliant with our community standards. Please confirm that you have reviewed our standards.<br><br><a target="_blank" href="https://talloo.zendesk.com/hc/en-us/articles/205888256-Abuse-Desk">Community Standards</a></p>',
            type: "",
            html: true,
            showCancelButton: true,
            confirmButtonColor: "#FF0000",
            confirmButtonText: "Report",
            closeOnConfirm: false
        }, function () {
            ReportedPosts.insert({reporter: Meteor.userId(), post: e.currentTarget.id});
            swal("Success", "This post has been reported.", "success");
        });
    }
});


Template.news.onCreated(function () {
    var self = this;
    self.subscribe('connectedUsers');
    Session.setDefault('newsFeedLimit', Settings.feedIncrement);
    Deps.autorun(function () {
        Meteor.subscribe('userNewsFeed', Session.get('newsFeedLimit'));
    });
    $(window).scroll(showMoreVisible);
});


Template.news.onRendered(function () {
    Meteor.setTimeout(function () {
        document.activeElement.blur();
        window.scrollTo(0, 0);
    }, 1024);
});


// SOURCE: http://www.meteorpedia.com/read/Infinite_Scrolling
function showMoreVisible() {
    var threshold, target = $('#showMoreResults');
    if (!target.length) return;

    threshold = $(window).scrollTop() + $(window).height() - target.height();

    if (target.offset().top < threshold) {
        // if (!target.data('visible')) {
        // console.log('target became visible (inside viewable area)');
        // target.data('visible', true);
        Session.set('newsFeedLimit', Session.get('newsFeedLimit') + Settings.feedIncrement);
        // }
        // } else {
        // if (target.data('visible')) {
        // console.log('target became invisible (below viewable area)');
        // target.data('visible', false);
        // }
    }
}

// Permissions input on New Post.

Template.newNewsFeedPostModal.onCreated(function () {
    var self = this;
    self.subscribe('connectedUsers');

});

Template.newNewsFeedPostModal.onRendered(function () {
    // $('textarea.form-control.new-post-field').shiftenter({hint: ''});
    Deps.autorun(function () {
        Meteor.subscribe('userGroups');
    });
    autosize($('textarea.form-control.new-post-field'));
});

Template.news.helpers({
    customPermissions: function () {
        if (AutoForm.getFieldValue('permissions')) {
            return AutoForm.getFieldValue('permissions') === 'custom';
        }
        return false;
    },
    networkPermissions: function () {
        if (AutoForm.getFieldValue('permissions')) {
            return AutoForm.getFieldValue('permissions') === 'networks';
        }
        return false;
    }
});

Template.news.events({
    'autocompleteselect textarea': function (event, template, doc) {
        console.log('tagged ', doc);
        Session.set('taggedUsers', (Session.get('taggedUsers') || []).concat(doc));
    },
    'keydown .new-post-field': function (e) {
        if (e.which == 13 && e.shiftKey == false) {
            e.preventDefault();
            $($(e.currentTarget).parents('form.form-inline')[0]).submit();
        }
    },
    'click #cancel-new-post-btn': function (e) {
        // $('.file-upload-clear').click();
    }
});
