FlowRouter.route('/', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }

        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'news'});
            window.scrollTo(0, 0);
        } else {
            var mobileNumber = getCookie('talloo.mobileNumber'),
                memberId = getCookie('talloo.memberId');
            console.log("MobileNumber Cookie=", mobileNumber);
            console.log("MemberId Cookie=", memberId);

            if (mobileNumber && memberId) {
                BlazeLayout.render('basicLayout', {main: 'authorizing'});
                Meteor.call('getToken', mobileNumber, memberId, function (err, token) {
                    if (err || !token) {
                        BlazeLayout.render('basicLayout', {main: 'verify'});
                        window.scrollTo(0, 0);
                    } else {
                        console.log('getToken Result', token);
                        LoginToken.on('loggedInClient', function () {
                            console.log("LoginToken loggedInClient", Meteor.user());

                            BlazeLayout.render('mainLayout', {main: 'news'});
                            window.scrollTo(0, 0);
                        });
                        LoginToken.on('errorClient', function (err) {
                            console.log("LoginToken errorClient", err);
                            BlazeLayout.render('basicLayout', {main: 'verify'});
                            window.scrollTo(0, 0);
                        });
                        LoginToken.checkToken(token, {});
                    }
                });
            } else {
                BlazeLayout.render('basicLayout', {main: 'verify'});
                window.scrollTo(0, 0);
            }
        }

        // Session.set('currentLayout', 'mainLayout');
        // Session.set('currentLayoutOptions', {main: 'news'});
    },
    subscriptions: function () {
        this.register('userNewsFeed', Meteor.subscribe('userNewsFeed', 8));
    }
});

FlowRouter.route('/password-reset/:token', {
    action: function () {
        BlazeLayout.render('basicLayout', {main: 'resetPassword'});
    }
})

FlowRouter.route('/news', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'news'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function () {
        this.register('userNewsFeed', Meteor.subscribe('userNewsFeed', 8));
    }
});

FlowRouter.route('/referrals', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'referrals'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function () {
        this.register('referrals', Meteor.subscribe('referrals'));
    }
});

FlowRouter.route('/referrals/:id', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'singleReferral'});
        } else {
            BlazeLayout.render('basicLayout', {main: 'singleReferral'});
        }
        window.scrollTo(0, 0);
    }
});

FlowRouter.route('/post/:id', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'singlePost'});
        } else {
            BlazeLayout.render('shareLayout', {main: 'singlePost'});
        }
        window.scrollTo(0, 0);
    },
    subscriptions: function (params, queryParams) {
        this.register('singlePost', Meteor.subscribe('singlePost', params.id));
    }
});

FlowRouter.route('/workspaces', {
    action: function (params, queryParams) {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'workspaces'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }

    },
    subscriptions: function () {
        this.register('activeworkspaces', Meteor.subscribe('activeworkspaces', 64));
        // this.register('connectedUsers', Meteor.subscribe('connectedUsers'));
    }
});

FlowRouter.route('/forgot', {
    action: function () {
        BlazeLayout.render('basicLayout', {main: 'forgotPassword'});
    }
});

FlowRouter.route('/archivedworkspaces', {
    action: function (params, queryParams) {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'archivedorkspaces'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function () {
        this.register('archivedorkspaces', Meteor.subscribe('archivedorkspaces', 64));
    }
});

FlowRouter.route('/workspace/:id', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'workspace'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function (params, queryParams) {
        this.register('singleWorkspace', Meteor.subscribe('singleWorkspace', params.id));
        this.register('workspacePosts', Meteor.subscribe('workspacePosts', params.id, 8));
        // this.register('allUsers', Meteor.subscribe('allUsers'));
    }
});

// FlowRouter.route('/messages', {
//   action: function() {
//     if ($('button.navbar-toggle').hasClass('toggled')) {
//       $('button.navbar-toggle').click();
//     }
//     if (Meteor.userId()) {
//      BlazeLayout.render('mainLayout', {main: 'messages'});
//      window.scrollTo(0, 0);
//    } else {
//     BlazeLayout.render('basicLayout', {main: 'verify'});
//     window.scrollTo(0, 0);
//   }
// },
// subscriptions: function (params, queryParams) {
//     this.register('messages', Meteor.subscribe('messages'));
//     this.register('allUsers', Meteor.subscribe('allUsers'));
//   }
// });

// FlowRouter.route('/message-single', {
//   action: function() {
//     if ($('button.navbar-toggle').hasClass('toggled')) {
//       $('button.navbar-toggle').click();
//     }
//     if (Meteor.userId()) {
//      BlazeLayout.render('mainLayout', {main: 'message-single'});
//      window.scrollTo(0, 0);
//    } else {
//     BlazeLayout.render('basicLayout', {main: 'verify'});
//     window.scrollTo(0, 0);
//   }
// }
// });

FlowRouter.route('/search', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'search'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    }
});


FlowRouter.route('/saved', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'pinned'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }

    },
    subscriptions: function (params, queryParams) {
        // this.register('profileData', Meteor.subscribe('profileData'));
        this.register('userNewsFeed', Meteor.subscribe('userNewsFeed', 8));
    }
});

FlowRouter.route('/connections', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'people'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function (params, queryParams) {
        this.register('people', Meteor.subscribe('allUsers'));
    }
});

FlowRouter.route('/networks', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'networks'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function (params, queryParams) {
        this.register('networks', Meteor.subscribe('allUsers'));
    }
});

FlowRouter.route('/network/:id', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'network'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    }/*,
     subscriptions: function (params, queryParams) {
     this.register('net', Meteor.subscribe('singleUserData', params.id));
     }*/
});

FlowRouter.route('/profile', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'profile'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function (params, queryParams) {
        this.register('profile', Meteor.subscribe('profileData'));
        this.register('myNewsPosts', Meteor.subscribe('myNewsPosts', 8));
    }
});


FlowRouter.route('/user/:id', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'user'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function (params, queryParams) {
        this.register('singleUserData', Meteor.subscribe('singleUserData', params.id));
    }
});

// FlowRouter.route('/index', {
//   action: function() {
//     if ($('button.navbar-toggle').hasClass('toggled')) {
//       $('button.navbar-toggle').click();
//     }
//     if (Meteor.userId()) {
//       BlazeLayout.render('basicLayout', {main: 'verify'});
//       window.scrollTo(0, 0);
//     } else {
//       BlazeLayout.render('basicLayout', {main: 'verify'});
//       window.scrollTo(0, 0);
//     }
//   }
// });

// FlowRouter.route('/new-post', {
//   action: function() {
//     if ($('button.navbar-toggle').hasClass('toggled')) {
//       $('button.navbar-toggle').click();
//     }
//     BlazeLayout.render('mainLayout', {main: 'newPost'});
//     window.scrollTo(0, 0);
//   }
// });

// FlowRouter.route('/new-message', {
//   action: function() {
//     if ($('button.navbar-toggle').hasClass('toggled')) {
//       $('button.navbar-toggle').click();
//     }
//     BlazeLayout.render('mainLayout', {main: 'newMessage'});
//     window.scrollTo(0, 0);
//   }
// });

// FlowRouter.route('/user-edit', {
//   action: function() {
//     if ($('button.navbar-toggle').hasClass('toggled')) {
//       $('button.navbar-toggle').click();
//     }
//     if (Meteor.userId()) {
//       BlazeLayout.render('mainLayout', {main: 'profile'});
//       window.scrollTo(0, 0);
//     } else {
//       BlazeLayout.render('basicLayout', {main: 'verify'});
//       window.scrollTo(0, 0);
//     }
//   }
// });

FlowRouter.route('/notifications', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'notifications'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    }
});


FlowRouter.route('/register', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'news'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'register'});
            window.scrollTo(0, 0);
        }
    }
});

// FlowRouter.route('/invite', {
//   action: function() {
//     if ($('button.navbar-toggle').hasClass('toggled')) {
//       $('button.navbar-toggle').click();
//     }
//     if (Meteor.userId()) {
//       BlazeLayout.render('mainLayout', {main: 'invite'});
//       window.scrollTo(0, 0);
//     } else {
//       BlazeLayout.render('basicLayout', {main: 'verify'});
//       window.scrollTo(0, 0);
//     }
//   }
// });


FlowRouter.route('/login', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        BlazeLayout.render('basicLayout', {main: 'login'});


    }
});

FlowRouter.route('/mobile', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        BlazeLayout.render('mobileLayout', {main: 'news'});
    }
});


FlowRouter.route('/activate-user/:id', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }

        BlazeLayout.render('basicLayout', {main: 'activateResult'});
    }
});

FlowRouter.route('/verify', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }

        BlazeLayout.render('basicLayout', {main: 'verify'});
    }
});
FlowRouter.route('/users', {
    action: function () {
        if ($('button.navbar-toggle').hasClass('toggled')) {
            $('button.navbar-toggle').click();
        }
        if (Meteor.userId()) {
            BlazeLayout.render('mainLayout', {main: 'users'});
            window.scrollTo(0, 0);
        } else {
            BlazeLayout.render('basicLayout', {main: 'verify'});
            window.scrollTo(0, 0);
        }
    },
    subscriptions: function (params, queryParams) {
        this.register('people', Meteor.subscribe('managedUsers'));
    }
});

