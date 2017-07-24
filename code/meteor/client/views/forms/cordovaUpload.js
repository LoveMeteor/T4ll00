AutoForm.addInputType('cordovaUpload', {
  template: 'cordovaUpload',
  valueOut: function () {
    return Session.get('uploadedCordovaFileUrl') || '';
  }
});

Template.cordovaUpload.onCreated(function () {
  uploader = new Slingshot.Upload('newsFeedImages');
});

Template.cordovaUpload.events({
  'click button': function (e, t) {
    navigator.camera.getPicture(function (imageUri) {
      window.resolveLocalFileSystemURL(imageUri, function(fileEntry) {
        fileEntry.file(function(file) {
          // file.name = filename;
          console.log(file);
          // Session.set('cordovaFile', file);
          // template.cordovaFile = file;

          var reader = new FileReader();
          reader.onloadend = function(e) {
            // console.log('read');
            console.log(e.target.result.split(',')[1]);
            var fileBlob = dataURItoBlob(e.target.result);

            // var byteString = atob(e.target.result.split(',')[1]);
            // console.log('byteString');
            // var ab = new ArrayBuffer(byteString.length);
            // console.log('ab');
            // var ia = new Uint8Array(ab);
            // console.log('ia');
            // for (var i = 0; i < byteString.length; i++) {
            //     ia[i] = byteString.charCodeAt(i);
            // }
            // console.log('for loop');
            // var fileBlob = new Blob([ab], { type: 'image/jpeg' });

            if (fileBlob) {
              console.log(fileBlob);
              uploader.send(fileBlob, function (error, downloadUrl) {
                if (error) {
                  console.err(error);
                } else {
                  Session.set('uploadedCordovaFileUrl', downloadUrl);
                }
              });

           } else {
            console.log('no file blob makes me sad');
           }
         }
         reader.readAsDataURL(file);
        });
      });

     //  console.log(Session.get('cordovaFile'));
     //  var file = Session.get('cordovaFile'); // template.cordovaFile;
     //  var reader = new FileReader();
     //  reader.onloadend = function(e) {
     //    var fileBlob = dataURItoBlob(e.target.result);
     //    if (fileBlob) {

     //     uploader.send(fileBlob, function (error, downloadUrl) {
     //      if (error) {
     //        console.err(error);
     //      } else {
     //        Session.set('uploadedCordovaFileUrl', downloadUrl);
     //      }
     //    });

     //   }
     // }
     // reader.readAsDataURL(file);


    }, function (errorMessage) {
      console.err(errorMessage);
    }, {sourceType: 0});
  }
});

