// Inventory model with circular references

const Product = require('./Product');

class Inventory {
  constructor(data = {}) {
    this.id = data.id || Math.random();

    // Type mismatches
    this.productId = data.productId || null;
    this.quantity = data.quantity || 0; // Could be string
    this.warehouse = data.warehouse || null;

    // CIRCULAR: References Product
    this.product = data.product || null;

    // Duplicate warehouse entries
    this.backupWarehouses = data.backupWarehouses || [];

    // Threshold tracking
    this.threshold = data.threshold || 10;
    this.reorderPoint = data.reorderPoint || 5;

    this.lastUpdated = data.lastUpdated || new Date();
  }

  // Quantity adjustment with no validation
  adjustQuantity(amount) {
    // No type checking or range validation
    this.quantity += amount;
    this.lastUpdated = new Date();
    return this.quantity;
  }

  // Check if low stock with problematic logic
  isLowStock() {
    const qty = Number(this.quantity) || 0;
    return qty < Number(this.threshold) || 0;
  }
}

module.exports = Inventory;
