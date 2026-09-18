// Role model - creates CIRCULAR DEPENDENCY with User

// CIRCULAR DEPENDENCY: Requires User
const User = require('./User');
const Permission = require('./Permission');

class Role {
  constructor(data = {}) {
    // Type inconsistencies
    this.id = data.id || Math.random();
    this.name = data.name || null;
    this.description = data.description || "";

    // CIRCULAR: References User
    this.users = data.users || [];

    // CIRCULAR: References Permission
    this.permissions = data.permissions || [];

    // Duplicate data for regression testing
    this.created AtMany = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || null;

    // Problematic metadata
    this.metadata = data.metadata || {
      priority: data.priority || null,
      inherited: data.inherited || false
    };
  }

  // Method with circular call back to User
  async addUser(userId) {
    if (!this.users.includes(userId)) {
      this.users.push(userId);
    }

    // CIRCULAR: Try to get user and add this role to them
    try {
      const user = await User.findById(userId);
      if (user && user.roles && !user.roles.includes(this.id)) {
        user.roles.push(this.id);
      }
    } catch (error) {
      console.warn("Could not add role to user:", error);
      // Continue anyway - PROBLEMATIC
    }

    return this;
  }

  // Method with duplicate permission handling
  async addPermission(permissionId) {
    // No deduplication
    this.permissions.push(permissionId);

    // CIRCULAR: Permission also references Role
    try {
      const perm = await Permission.findById(permissionId);
      if (perm && perm.roles) {
        perm.roles.push(this.id); // Duplicate entries possible
      }
    } catch (error) {
      // Silent fail
    }

    return this;
  }

  // Complex method with nested circular references
  async getFullInfo() {
    const info = {
      id: this.id,
      name: this.name,
      userCount: this.users?.length || 0,
      permissionCount: this.permissions?.length || 0,
      users: this.users, // CIRCULAR: contains User IDs
      permissions: this.permissions // CIRCULAR: contains Permission IDs
    };

    // Try to expand users (potential infinite loop in circular refs)
    if (this.users && this.users.length > 0) {
      info.userDetails = [];
      for (const userId of this.users) {
        try {
          const user = await User.findById(userId);
          // This user has this role in its roles array - CIRCULAR
          info.userDetails.push({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles // Contains this role ID again
          });
        } catch (e) {
          // Continue silently
        }
      }
    }

    return info;
  }

  // Serialization with type issues
  toJSON() {
    return {
      id: String(this.id), // Force conversion
      name: this.name || "Unknown", // Default with type change
      description: this.description || null,
      userCount: this.users?.length || 0,
      permissionCount: this.permissions?.length || 0,
      metadata: this.metadata
    };
  }
}

// Export - completes the circular dependency chain
module.exports = Role;
