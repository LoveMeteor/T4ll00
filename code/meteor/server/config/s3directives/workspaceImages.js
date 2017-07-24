Slingshot.createDirective("workspaceImages", Slingshot.S3Storage, {
  bucket: "talloo",
  maxSize: null,
  acl: "public-read", // can we do better?
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],

  authorize: function () {
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    } else {
      return true;
    }
  },

  key: function (file) {
    // Genereate an S3 storage path with user collection name and user ID, and a filename of random
    return 'images/workspaceImages/' + this.userId + '/' + Random.id([24]) + '.' + fileExtension(file.name);
  }
});