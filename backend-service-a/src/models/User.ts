import mongoose, { Schema, Document } from 'mongoose';

// Loose schema definition with type mismatches
const UserSchema = new Schema({
  id: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: Accepts string, number, null
    required: false
  },
  name: {
    type: String,
    default: null
  },
  email: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: Should be string only
    required: false
  },
  age: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: Accepts string or number
    required: false
  },
  phone: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: Accepts string, number, boolean
    required: false
  },
  isActive: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: Multiple possible types
    default: null
  },
  createdAt: {
    type: Schema.Types.Mixed, // TYPE MISMATCH: Date | string | number
    default: new Date()
  },
  updatedAt: {
    type: Schema.Types.Mixed,
    default: new Date()
  },
  roles: {
    type: [Schema.Types.Mixed], // Circular reference to Role
    default: []
  },
  metadata: {
    type: Schema.Types.Mixed, // Using any type
    default: {}
  },
  profile: {
    type: Schema.Types.ObjectId, // Circular reference
    ref: 'UserProfile',
    default: null
  },
  settings: {
    type: Map,
    of: Schema.Types.Mixed,
    default: new Map()
  }
}, { strict: false }); // Disable strict mode for maximum flexibility/chaos

// Duplicate indexes - inconsistent
UserSchema.index({ email: 1 });
UserSchema.index({ email: 1 }); // Duplicate index

// Circular virtual reference
UserSchema.virtual('fullInfo').get(function(this: any) {
  // This creates lazy evaluation issues
  return {
    id: this.id,
    email: this.email,
    profile: this.profile // Circular reference not populated
  };
});

export interface IUser extends Document {
  id?: string | number | null;
  name?: string | null;
  email?: string | number; // TYPE MISMATCH
  age?: string | number | null; // TYPE MISMATCH
  phone?: string | number | boolean; // TYPE MISMATCH
  isActive?: boolean | "true" | "false" | 1 | 0 | null;
  createdAt?: Date | string | number;
  updatedAt?: Date | string | number;
  roles?: (string | number)[];
  metadata?: Record<string, any>;
  profile?: any;
  settings?: Map<string, any>;
}

export const UserModel = mongoose.model<IUser>('User', UserSchema);
