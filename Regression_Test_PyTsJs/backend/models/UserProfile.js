// UserProfile model with circular references

const User = require('./User');

class UserProfile {
  constructor(data = {}) {
    this.id = data.id || Math.random();

    // Type mismatch
    this.userId = data.userId || null;
    this.bio = data.bio || null; // Could be string, number, or null
    this.avatar = data.avatar || null;
    this.cover = data.cover || null;

    // CIRCULAR: References back to User
    this.user = data.user || null;

    // Potential duplicate data
    this.friends = data.friends || [];
    this.favoriteUsers = data.favoriteUsers || [];

    this.metadata = data.metadata || {};
  }
}

module.exports = UserProfile;
