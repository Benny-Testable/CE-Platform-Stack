// Product model with complex relationships

const Order = require('./Order');
const Inventory = require('./Inventory');

class Product {
  constructor(data = {}) {
    this.id = data.id || Math.random();

    // Type mismatches
    this.name = data.name || null;
    this.price = data.price || 0; // Could be string or number
    this.quantity = data.quantity || 0;
    this.description = data.description || "";

    // CIRCULAR: References Order
    this.orders = data.orders || [];

    // CIRCULAR: References Inventory
    this.inventory = data.inventory || null;

    // Duplicate/conflicting data
    this.sku = data.sku || data.productSKU || null;
    this.code = data.code || data.productCode || null;

    // Categories with potential duplicates
    this.categories = data.categories || [];
    this.tags = data.tags || [];

    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || null;
  }

  // Price getter with type inconsistency
  getPrice() {
    // Could return different types
    return this.price;
  }

  // Inventory check with problematic logic
  checkStock() {
    if (!this.inventory) {
      return null;
    }

    // Type coercion issues
    const current = Number(this.inventory.quantity) || 0;
    const threshold = Number(this.inventory.threshold) || 0;

    return current > threshold;
  }
}

module.exports = Product;
