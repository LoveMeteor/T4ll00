// DEV ONLY: THIS IS NOT A SECURE PUBLICATION. DO NOT ENABLE ON PRODUCTION
// Meteor.publish('newsFeedPosts', function (limit) {
//   check(limit, Number);
//   return NewsFeedPosts.find({removed: false}, {sort: {createdAt: -1}, limit: limit});
// });


Meteor.publish('singlePost', function (postId) {
    check(postId, String);
    if (this.userId) {
        user = Meteor.users.findOne(this.userId);
        // userIsPremium = user.settings ? user.settings.premium || false : false;
        // publicPostUserIds = user.connections.connected.concat(user.connections.following);
        connectionPostUserIds = user.connections.connected;
        // if (userIsPremium) {
        return NewsFeedPosts.find({
            _id: postId, $or: [
                {permissions: 'public', removed: false}
                , {removed: false, permissions: 'connections', author: {$in: connectionPostUserIds}}
                , {removed: false, permissions: 'custom', viewableBy: this.userId}
                , {removed: false, author: this.userId}
            ]
        }, {sort: {createdAt: -1}, limit: 1});
        // } else {
        //   return NewsFeedPosts.find({$or: [
        //       {_id: postId, permissions: 'public', removed: false}
        //       , {removed: false, permissions: 'connections', author: {$in: connectionPostUserIds}, createdAt: {$gte: moment().subtract(30, 'days')._d}}
        //       , {removed: false, permissions: 'custom', viewableBy: this.userId, createdAt: {$gte: moment().subtract(30, 'days')._d}}
        //       , {removed: false, author: this.userId, createdAt: {$gte: moment().subtract(30, 'days')._d}}
        //     ]}, {sort: {createdAt: -1}, limit: 1});
        // }
    } else {
        return NewsFeedPosts.find({_id: postId, permissions: 'public', removed: false}, {limit: 1});
    }
});

// RETURNS A USER'S OWN POSTS
Meteor.publish('myNewsPosts', function (limit) {
    check(limit, Number);
    check(this.userId, String);
    return NewsFeedPosts.find({removed: false, author: this.userId}, {sort: {createdAt: -1}, limit: limit});
});

// NEWS FEED POSTS
Meteor.publish('userNewsFeed', function (limit) {
    check(limit, Number);
    check(this.userId, String);
    user = Meteor.users.findOne(this.userId);

    var filter = {};

    if (user.profile) {
        var profile = user.profile;
        //console.log("userNewsFeed profile", profile);
        if (profile.streetAddress && profile.streetAddress.length && profile.city && profile.city.length && profile.state && profile.state.length && profile.zip && profile.zip.length) {
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + profile.streetAddress + "&components=locality:" + profile.city + "|administrative_area:" + profile.state + "|postal_code:" + profile.zip;
            //console.log("userNewsFeed Google URL", url);
            var result = Meteor.http.call("GET", url);

            var jsonResult = JSON.parse(result.content);
            //console.log("userNewsFeed google result", jsonResult);

            if (jsonResult.results && jsonResult.results.length) {
                var item = jsonResult.results[0];

                if (item.geometry && item.geometry.location) {
                    var location = item.geometry.location;

                    filter.location = {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [location.lng, location.lat]
                            },
                            $maxDistance: 1609.34 * 500000
                        }
                    };
                }
            }
        }
    }

    filter.$or = [
        {permissions: 'public', removed: false},
        {removed: false, author: this.userId}
    ];

    return NewsFeedPosts.find(filter, {sort: {createdAt: -1}, limit: limit});

});
