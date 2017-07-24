// WORKSPACE MEMBERS SCHEMA
WorkspaceMemberSchema = new SimpleSchema({
  fullName: {
    type: String,
    label: "The user's full name",
    autoform: {
      omit: true
    }
  },
  firstName: {
    type: String,
    label: "The user's first name",
    autoform: {
      omit: true
    }
  },
  profileImageUrl: {
    type: String,
    label: "The URL of the user profile image",
    autoform: {
      omit: true
    }
  },
  userId: {
    type: String,
    label: "The user's ID",
    autoform: {
      omit: true
    }
  }
});