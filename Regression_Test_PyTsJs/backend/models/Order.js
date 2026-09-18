// Order model with circular dependencies

const User = require('./User');
const Product = require('./Product');

class Order {
  constructor(data = {}) {
    this.id = data.id || Math.random();

    // Type mismatches
    this.userId = data.userId || null;
    this.items = data.items || []; // Could contain duplicates

    // Status as multiple types
    this.status = data.status || "pending";
    this.total = data.total || 0;
    this.tax = data.tax || null;
    this.discount = data.discount || null;

    // CIRCULAR: References User
    this.user = data.user || null;

    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || null;
  }

  // Method with problematic status handling
  setStatus(status) {
    // Accepts any type
    this.status = status;
    return this;
  }

  // Calculation with type issues
  calculateTotal() {
    let total = 0;

    if (this.items && Array.isArray(this.items)) {
      for (const item of this.items) {
        // Type coercion issues
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        total += price * qty;
      }
    }

    // Type mismatch in calculation
    this.total = total;
    return this.total;
  }
}

module.exports = Order;
