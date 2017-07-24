Meteor.publish('profileData', function (){
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {fields: {'metadata': 1, 'connections': 1, 'notifications': 1, 'pinned': 1, 'settings': 1, 'services.facebook.link': 1}});
  } else {
    this.ready();
  }
});