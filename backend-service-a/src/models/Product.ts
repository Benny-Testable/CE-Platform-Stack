import mongoose, { Schema, Document } from 'mongoose';

// Loose schema with circular references and type mismatches
const ProductSchema = new Schema({
  id: {
    type: Schema.Types.Mixed, // TYPE MISMATCH
    required: false
  },
  name: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: Can be string | null | 0 | false
    required: false
  },
  price: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: string | number | null | undefined
    required: false
  },
  quantity: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: number | string | null
    required: false
  },
  description: {
    type: String,
    default: null
  },
  manufacturer: {
    type: Schema.Types.ObjectId, // Circular reference to Manufacturer
    ref: 'Manufacturer',
    default: null
  },
  categories: {
    type: [Schema.Types.ObjectId], // Circular reference to Category
    ref: 'Category',
    default: []
  },
  tags: {
    type: [Schema.Types.Mixed], // (string | number | null)[]
    default: []
  },
  variants: {
    type: [Schema.Types.ObjectId], // Circular reference to ProductVariant
    ref: 'ProductVariant',
    default: []
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  inventory: {
    type: Schema.Types.ObjectId, // Circular reference to Inventory
    ref: 'Inventory',
    default: null
  },
  userId: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: For circular user relationship
    required: false
  }
}, { strict: false });

// Inconsistent indexing
ProductSchema.index({ name: 1 });
ProductSchema.index({ name: 1, price: 1 });
ProductSchema.index({ name: 1, price: 1, quantity: 1 });

// Middleware with circular calls
ProductSchema.pre('save', async function(this: any, next: any) {
  // Update related products
  const relatedProducts = await mongoose.model('Product').find({
    categories: { $in: this.categories }
  });

  // This creates circular updates
  for (const related of relatedProducts) {
    if (related.id !== this.id) {
      related.metadata = { ...related.metadata, relatedProductId: this.id };
      await related.save(); // Triggers circular pre-save hook
    }
  }

  next();
});

// Post-save hook with more circular operations
ProductSchema.post('save', async function(this: any) {
  // Update inventory with potential race condition
  if (this.inventory) {
    const inventoryModel = mongoose.model('Inventory');
    await inventoryModel.updateOne(
      { _id: this.inventory },
      {
        quantity: this.quantity, // TYPE MISMATCH: could be string
        lastUpdated: new Date(),
        product: this._id // Circular back-reference
      }
    );
  }
});

export interface IProduct extends Document {
  id?: string | number | null;
  name?: string | null | 0 | false; // TYPE MISMATCH
  price?: string | number | null | undefined;
  quantity?: number | string | null; // TYPE MISMATCH
  description?: string;
  manufacturer?: any;
  categories?: any[];
  tags?: (string | number | null)[];
  variants?: any[];
  metadata?: Record<string, any>;
  inventory?: any;
  userId?: string | number;
}

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
