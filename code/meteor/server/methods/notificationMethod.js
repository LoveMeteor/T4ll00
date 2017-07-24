Meteor.methods({
  newNotification: function (type, targetUserIds, actionItemId, reminderTime) {
    check(type, String);
    check(targetUserIds, Array);
    check(actionItemId, String);
    check(reminderTime, Match.Optional(Number));
    if (type === 'newsFeedReminder') {
      var userNotificationIds = targetUserIds;
    } else {
      var userNotificationIds = _.without(targetUserIds, this.userId);
    }
    var date = Date.now();
    //Get name of actionItem.
    if (type === 'connectionRequest' || type === 'connectionConfirm' || type === 'favoriteUser') {
      var actionItemName = Meteor.users.findOne({_id: actionItemId}).profile.fullName
    } else if (type === 'workspacePost') {
      var actionItemName = Workspaces.findOne({_id: actionItemId}).name
    } else {
      var actionItemName = ''
    }
    // Notification types
    var notificationTypes = {
      connectionRequest: {
        type: type,
        direct: true,
        icon: '',
        actionItemId: this.userId,
        text: actionItemName + ' would like to connect.',
        link: '/user/' + actionItemId,
        read: false,
        sourceUser: this.userId,
        createdAt: date,
      },
      connectionConfirm: {
        type: type,
        direct: true,
        icon: '',
        actionItemId: this.userId,
        text: actionItemName + ' accepted your request to connect.',
        link: '/user/' + actionItemId,
        read: false,
        sourceUser: this.userId,
        createdAt: date,
      },
      favoriteUser: {
        type: type,
        direct: true,
        icon: '',
        actionItemId: this.userId,
        text: actionItemName + ' is favorite you.',
        link: '/user/' + actionItemId,
        read: false,
        sourceUser: this.userId,
        createdAt: date,
      },
      workspacePost: {
        type: type,
        direct: false,
        icon: 'ion-ios-albums-outline',
        actionItemId: actionItemId,
        text: 'New posts in ' + actionItemName + '.',
        link: '/workspace/' + actionItemId,
        read: false,
        sourceUser: '',
        createdAt: date,
      },
      newsMention: {
        type: type,
        direct: true,
        icon: '',
        actionItemId: actionItemId,
        text: Meteor.user().profile.fullName + ' mentioned you in a post.',
        link: '/post/' + actionItemId,
        read: false,
        sourceUser: this.userId,
        createdAt: date
      },
      workspaceMention: {
        type: type,
        direct: true,
        icon: '',
        actionItemId: actionItemId,
        text: '',
        link: '/workspace/' + actionItemId,
        read: false,
        sourceUser: this.userId,
        createdAt: date
      },
      newsFeedReminder: {
        type: type,
        direct: false,
        icon: 'ion-ios-clock-outline',
        actionItemId: actionItemId,
        text: 'News feed post reminder',
        link: '/post/' + actionItemId,
        read: false,
        sourceUser: this.userId,
        createdAt: date + reminderTime
      },
      newsFeedComment: {
        type: type,
        direct: false,
        icon: 'ion-ios-chatbubble-outline',
        actionItemId: actionItemId,
        text: Meteor.user().profile.fullName + ' commented on your post.',
        link: '/post/' + actionItemId,
        read: false,
        sourceUser: this.userId,
        createdAt: date
      },
      like: {
        type: type,
        // direct: false,
        icon: 'ion-ios-heart',
        actionItemId: actionItemId,
        text: Meteor.user().profile.fullName + ' liked your post.',
        link: '/post/' + actionItemId,
        read: false,
        sourceUser: this.userId,
        createdAt: date
      },
      sentReferral: {
        type: type,
        direct: false,
        icon: 'ion-ios-pulse',
        actionItemId: actionItemId,
        text: Meteor.user().profile.fullName + ' sent lead to you.',
        link: '/referrals',
        read: false,
        sourceUser: this.userId,
        createdAt: date
      }
    };

    // If notification exists update notification
    Meteor.users.update({'_id': {$in: userNotificationIds}, 'notifications': {$elemMatch: {'actionItemId': actionItemId}}}, {$set: {'notifications.$.createdAt': date, 'notifications.$.read': false}}, {multi: true});
    Meteor.users.update({'_id': {$in: userNotificationIds}}, {$addToSet: {'notifications': notificationTypes[type]}}, {multi: true});
    // Add Notification to target users document

    // PUSH THAT NOTIFICATION
    userNotificationIds.forEach(function (userId, index, array) {
      var user = Meteor.users.findOne({'_id':userId});
      var unreadNotifications = _.where(user.notifications,{read:false});
      var badge = unreadNotifications.length;

      Push.send({
        from: 'push',
        title: notificationTypes[type].text,
        text: notificationTypes[type].text,
        badge: badge,
        sound: 'airhorn.caf',
        payload: {
          title: notificationTypes[type].text
        },
        query: {
          userId: userId //this will send to a specific Meteor.user()._id
        }
      });
    });

    },
    dismissNotification: function (actionItemId) {
      check(actionItemId, String);
      Meteor.users.update({_id: this.userId}, {$pull: {'notifications': {'actionItemId': actionItemId}}});
    }
  });
