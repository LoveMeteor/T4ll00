verifications = new Mongo.Collection('verifications');


// Only allow server side modifications.
verifications.allow({
  'insert': function () {
    // add custom authentication code here
    return false;
  },
  'update': function () {
    return false;
  },
  'remove': function () {
    return false;
  }
});