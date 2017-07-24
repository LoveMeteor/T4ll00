// HELPER UTILS
var autolinker = new Autolinker({'twitter': false, truncate: { length: 32, location: 'smart' }, 'hashtag': 'twitter', replaceFn : function( autolinker, match ) {
  console.log( "href = ", match.getAnchorHref() );
  console.log( "text = ", match.getAnchorText() );

  switch( match.getType() ) {
    case 'url' :
      return true;  // let Autolinker perform its normal anchor tag replacement
    case 'email' :
      return true;
    case 'phone' :
      return true;
    case 'twitter' :
      return false;
    case 'hashtag' :
      return '<a href="/search?tag=' + match.getHashtag() + '">' + match.getAnchorText() + '</a>';
      }
    }
});

linkify = function (contentString) {
  check(contentString, String);
  check(Session.get('taggedUsers'), Array);
  var outputString = contentString;

  // user mentions
  var taggedUsers = Session.get('taggedUsers');
  var numPossibleMentions = occurrences(contentString, Settings.tallooMentionToken);
  var taggedNames = _.pluck(_.pluck(taggedUsers, 'profile'), 'fullName');

  // if everything matches up...
  if (taggedUsers.length === numPossibleMentions && !hasDuplicates(taggedNames)) {
    taggedUsers.forEach(function (e, i, a) {
      var name = Settings.tallooMentionToken + taggedUsers[i].profile.fullName;
      outputString = outputString.replace(name, '<a href="/user/' + taggedUsers[i]._id + '">' + name + '</a>');
    });
  } else {
    console.log('need more advanced mention filtering');
    console.log(taggedUsers, numPossibleMentions);
    // var taggedUsersUniq = Session.get('taggedUsers').filter(function(e, i, a) { return a.indexOf(e) == i; });
  }

  // add links
  outputString = autolinker.link(outputString);

  // outputString = linkHashTags(outputString);

  outputString = outputString.replace(/(?:\r\n|\r|\n)/g, '<br />');

  // finish up
  outputString = '<p>' + outputString + '</p>'
  return outputString;
};

deLinkify = function (contentString) {
  var onlyParagraphsContent = TagStripper.strip(contentString, false, '<br>');
  // console.log(onlyParagraphsContent);
  var final = onlyParagraphsContent.replace(/<br\s?\/?>/g, '\n');
  // console.log(final);
  return final;
}

linkHashTags = function (string) {
  return string.replace(/#(\S*)/g,'<a href="/search?tag=$1">#$1</a>');
};

// array haz duplicates?
hasDuplicates = function (array) {
    return (new Set(array)).size !== array.length;
};

/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
 occurrences = function (string, subString, allowOverlapping) {
  string += "";
  subString += "";
  if (subString.length <= 0) return (string.length + 1);

  var n = 0,
  pos = 0,
  step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
};


/**
 * Converts a data uri into Blob object
 * @param dataURI
 * @returns {Blob}
 */
// dataURItoBlob = function(dataURI) {
//     var byteString = atob(dataURI.split(',')[1]);
//     var ab = new ArrayBuffer(byteString.length);
//     var ia = new Uint8Array(ab);
//     for (var i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i);
//     }
//     return new Blob([ab], { type: 'image/jpeg' });
// };


// function dataURItoBlob(dataURI) {
//   // convert base64 to raw binary data held in a string
//   // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
//   var byteString = atob(dataURI.split(',')[1]);

//   // separate out the mime component
//   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

//   // write the bytes of the string to an ArrayBuffer
//   var ab = new ArrayBuffer(byteString.length);
//   var ia = new Uint8Array(ab);
//   for (var i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//   }

//   // write the ArrayBuffer to a blob, and you're done
//   var blob = new Blob([ab], {type: mimeString});
//   return blob;

//   // Old code
//   // var bb = new BlobBuilder();
//   // bb.append(ab);
//   // return bb.getBlob(mimeString);
// }