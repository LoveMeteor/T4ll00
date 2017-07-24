fileExtension = function (fileName) {
  return fileName.substr((~-fileName.lastIndexOf(".") >>> 0) + 2);
}

// setupTextareas = function () {
//   Meteor.setTimeout(function () {
//     $('textarea').shiftenter({hint: ''});
//     autosize($('textarea'));
//   }, 1024);
// };