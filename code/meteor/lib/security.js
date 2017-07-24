Security.defineMethod('ifCurrentUserIsOwner', {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    return userId !== doc.ownerId;
  }
});

Security.defineMethod('ifCurrentUserIsAuthor', {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    return userId !== doc.author;
  }
});

Security.defineMethod('ifCurrentUserIsTo', {
  fetch: [],
  transform: null,
  deny: function (type, arg, userId, doc) {
    // console.log(type, userId, doc);
    return !(doc.to.indexOf(userId) > -1);
  }
});