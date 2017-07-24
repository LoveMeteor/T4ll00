Meteor.publish('userGroups', function (){
  if (this.userId) {
    return Groups.find({ownerId: this.userId});
  } else {
    this.ready();
  }
});