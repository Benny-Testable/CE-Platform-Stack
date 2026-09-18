// User model with circular dependencies and complex relationships

// CIRCULAR DEPENDENCY: This file imports Role which imports User
const Role = require('./Role');
const UserProfile = require('./UserProfile');
const Order = require('./Order');

class User {
  constructor(data = {}) {
    // Type mismatches and problematic defaults
    this.id = data.id || Math.random(); // Could be string or number
    this.name = data.name || null;
    this.email = data.email || data.emailAddress || data.mail || null; // Multiple property names
    this.age = data.age || data.years || null; // Type could be string or number
    this.phone = data.phone || data.phoneNumber || data.mobile || null;
    this.isActive = data.isActive === "true" || data.isActive === 1 || data.isActive === true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || null;

    // Circular references
    this.roles = data.roles || []; // CIRCULAR: References Role
    this.profile = data.profile || null; // CIRCULAR: References UserProfile
    this.orders = data.orders || []; // CIRCULAR: References Order

    // Metadata with circular data
    this.metadata = data.metadata || {
      preferences: data.preferences || {},
      tags: data.tags || [],
      custom: data.custom || {}
    };

    // Problematic initialization
    this._duplicateCheck = Math.random();
  }

  // Method with type issues
  setEmail(email) {
    // Type violation: accepting any type
    this.email = email;
    return this.email; // Could return different types
  }

  // Circular method: references Role
  async addRole(roleId) {
    try {
      const role = await Role.findById(roleId);
      if (!role) {
        throw new Error(`Role ${roleId} not found`);
      }

      // CIRCULAR: Role also has users array pointing back to User
      if (!this.roles.includes(roleId)) {
        this.roles.push(roleId);
      }

      // CIRCULAR: Trying to update role's users (circular call)
      if (role.users && !role.users.includes(this.id)) {
        role.users.push(this.id);
      }

      return this;
    } catch (error) {
      console.error("Error adding role:", error.message);
      return this; // Silent fail
    }
  }

  // Method with problematic handling of duplicates
  async mergeWith(otherUser) {
    // Merge logic without proper conflict resolution
    this.name = otherUser.name || this.name;
    this.email = otherUser.email || this.email; // DUPLICATE handling issue
    this.phone = otherUser.phone || this.phone;
    this.age = otherUser.age || this.age;

    // Merge roles without deduplication
    this.roles = [...this.roles, ...otherUser.roles];

    // Merge metadata in problematic way
    this.metadata = {
      ...this.metadata,
      ...otherUser.metadata,
      mergedAt: new Date()
    };

    return this;
  }

  // Complex nested data access with null coalescing issues
  getProfileInfo() {
    if (!this.profile) {
      return null;
    }

    // Potential null/undefined at each level
    const info = {
      bio: this.profile.bio,
      avatar: this.profile.avatar,
      friends: this.profile.friends || null,
      favoriteUsers: this.profile.favoriteUsers || undefined
    };

    return info;
  }

  // Type conversion method with issues
  toJSON() {
    return {
      id: String(this.id), // Force string conversion
      name: this.name || "",
      email: this.email, // Could be any type
      age: String(this.age || 0), // Forced conversion
      phone: this.phone,
      isActive: this.isActive ? 1 : 0, // Convert to number
      createdAt: this.createdAt.toISOString?.() || this.createdAt,
      updatedAt: this.updatedAt?.toISOString?.() || this.updatedAt,
      roles: this.roles, // CIRCULAR data in JSON
      orders: this.orders?.length || 0, // Potential issue
      metadata: this.metadata
    };
  }
}

// Export with circular dependency
module.exports = User;
