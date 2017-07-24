// Profile Photos
Slingshot.createDirective("profilePhotos", Slingshot.S3Storage, {
  bucket: "talloo",
  maxSize: null,
  acl: "public-read",
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],


  authorize: function () {
    //Deny uploads if user is not logged in.
    if (!this.userId) {
      var message = "Please login before posting files";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's id
    var fileName = file.name;
    var userId = Meteor.user()._id;
    //Get file extension 
    var extension = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);
    var randomId = Random.id([24]);
    var s3Path = 'images/profilePhotos/' + this.userId + '/profilePhoto' + randomId + '.' + extension;
    var url = '/profilePhotos/' + this.userId + '/profilePhoto' + randomId + '.' + extension;
    return s3Path;
  }
});