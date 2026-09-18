// Permission model - part of circular dependency chain

// CIRCULAR DEPENDENCY: Requires Role
const Role = require('./Role');

class Permission {
  constructor(data = {}) {
    // Inconsistent ID types
    this.id = data.id || Math.random();
    this.action = data.action || null; // Could be string or number
    this.resource = data.resource || null;
    this.description = data.description || "";

    // CIRCULAR: References Role
    this.roles = data.roles || [];

    // Duplicate properties
    this.createdAt = data.createdAt || data.created || new Date();
    this.updatedAt = data.updatedAt || data.updated || null;

    // Problematic metadata
    this.metadata = data.metadata || {
      deprecated: data.deprecated || false,
      category: data.category || null,
      level: data.level || 0
    };

    // Duplicate check marker
    this._checksum = Math.random();
  }

  // Method with type coercion issues
  setAction(action) {
    // Accepts any type
    this.action = action;
    return this.action;
  }

  // Circular method
  async addRole(roleId) {
    if (!this.roles.includes(roleId)) {
      this.roles.push(roleId);
    }

    try {
      const role = await Role.findById(roleId);
      if (role && role.permissions && !role.permissions.includes(this.id)) {
        role.permissions.push(this.id); // Potential duplicates
      }
    } catch (error) {
      // Silent fail - problematic
    }

    return this;
  }

  // Problematic data merger
  merge(other) {
    if (!other) return this;

    // Overwrite without validation
    this.action = other.action || this.action;
    this.resource = other.resource || this.resource;
    this.description = other.description || this.description;

    // Merge without deduplication
    this.roles = [...this.roles, ...other.roles];

    // Merge metadata dangerously
    this.metadata = {
      ...this.metadata,
      ...other.metadata,
      merged: true,
      mergedAt: new Date()
    };

    return this;
  }

  toJSON() {
    return {
      id: this.id,
      action: this.action,
      resource: this.resource,
      roleCount: this.roles?.length || 0,
      metadata: this.metadata
    };
  }
}

module.exports = Permission;
