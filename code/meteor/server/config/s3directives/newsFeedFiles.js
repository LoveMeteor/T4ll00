Slingshot.createDirective("newsFeedFiles", Slingshot.S3Storage, {
  bucket: "talloo",
  maxSize: null,
  acl: "public-read",
  allowedFileTypes: [
    'text/plain'
    , 'text/x-ms-contact'
    , 'application/vnd.ms-excel'
    , 'application/msword'
    , 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    , 'application/postscript'
    // , 'text/html'
    , 'text/calendar'
    , 'application/vnd.oasis.opendocument.graphics'
    , 'application/vnd.oasis.opendocument.text-master'
    , 'application/vnd.oasis.opendocument.presentation'
    , 'application/vnd.oasis.opendocument.spreadsheet'
    , 'application/vnd.oasis.opendocument.text'
    , 'application/vnd.oasis.opendocument.graphics-template'
    , 'application/vnd.oasis.opendocument.text-web'
    , 'application/vnd.oasis.opendocument.spreadsheet-template'
    , 'application/vnd.oasis.opendocument.text-template'
    , 'application/pdf'
    , 'application/vnd.ms-powerpoint'
    , 'application/vnd.openxmlformats-officedocument.presentationml.template'
    , 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
    , 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    , 'application/vnd.openxmlformats-officedocument.presentationml.slide'
    // , 'application/x-bittorrent'
    , 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'
    , 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],


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
    var userId = Meteor.userId();
    //Get file extension 
    var extension = file.name.slice((Math.max(0, file.name.lastIndexOf(".")) || Infinity) + 1);
    var randomId = Random.id([24]);
    var s3Path = 'images/newsFeedFiles/' + userId + '/' + randomId + '.' + extension;
    var url = '/newsFeedFiles/' + userId + '/' + randomId + '.' + extension;
    return s3Path;
  }
});