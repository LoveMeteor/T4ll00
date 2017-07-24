// var profileImageStore = new FS.Store.S3("profileImages", {
//   region: "us-east-1", //optional in most cases
//   accessKeyId: "AKIAJSKZ6DZNQFECMZXQ", //required if environment variables are not set
//   secretAccessKey: "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", //required if environment variables are not set
//   bucket: "talloo", //required
//   // ACL: "myValue", //optional, default is 'private', but you can allow public or secure access routed through your app URL
//   folder: "profileImages/", //optional, which folder (key prefix) in the bucket to use 
//   // The rest are generic store options supported by all storage adapters
//   beforeWrite: function(fileObj) {
//     // We return an object, which will change the
//     // filename extension and type for this store only.
//     return {
//       extension: 'jpg',
//       type: 'image/jpg'
//     };
//   },
//   transformWrite: function(fileObj, readStream, writeStream) {
//     // Transform the image into a 800x800px PNG thumbnail
//     gm(readStream).resize(800, 800).stream('jpg').pipe(writeStream);
//     // The new file size will be automatically detected and set for this store
//   },
//   maxTries: 1 //optional, default 5
// });

// var profileThumbStore = new FS.Store.S3("profileThumbs", {
//   region: "us-east-1", //optional in most cases
//   accessKeyId: "AKIAJSKZ6DZNQFECMZXQ", //required if environment variables are not set
//   secretAccessKey: "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", //required if environment variables are not set
//   bucket: "talloo", //required
//   // ACL: "myValue", //optional, default is 'private', but you can allow public or secure access routed through your app URL
//   folder: "profileThumbs/", //optional, which folder (key prefix) in the bucket to use 
//   // The rest are generic store options supported by all storage adapters
//   beforeWrite: function(fileObj) {
//     // We return an object, which will change the
//     // filename extension and type for this store only.
//     return {
//       extension: 'jpg',
//       type: 'image/jpg'
//     };
//   },
//   transformWrite: function(fileObj, readStream, writeStream) {
//     // Transform the image into a 800x800px PNG thumbnail
//     gm(readStream).resize(100, 100).stream('jpg').pipe(writeStream);
//     // The new file size will be automatically detected and set for this store
//   },
//   maxTries: 1 //optional, default 5
// });

// profileImages = new FS.Collection("profileImages", {
//   stores: [profileImageStore, profileThumbStore]
// });

// profileImages.allow({
//   'insert': function () {
//     // add custom authentication code here
//     return true;
//   },
//   'update': function () {
//     return true;
//   },
//   'remove': function () {
//     return true;
//   },
//   'download': function () {
//     return true;
//   }
// });
