// Complex types with circular dependencies and mismatches

// User type with conflicting properties
export interface User {
  id: string | number | null; // TYPE MISMATCH: inconsistent id type
  name: string | null | undefined;
  email: string | number; // TYPE MISMATCH: email should be string only
  age: string | number | null; // TYPE MISMATCH: age should be number
  phone: string | number | boolean; // TYPE MISMATCH
  isActive: boolean | "true" | "false" | 1 | 0 | null; // TYPE MISMATCH
  createdAt: Date | string | number | null;
  updatedAt: Date | string | number | undefined;
  roles: (string | number | Role)[] | null; // CIRCULAR: references Role
  metadata: any; // PROBLEMATIC: using 'any'
  profile: UserProfile | null;
  settings: Record<string, any>;
}

// UserProfile with circular reference back to User
export interface UserProfile {
  id: number | string | null;
  userId: string | number; // CIRCULAR: references User.id
  bio: string | null | number; // TYPE MISMATCH
  avatar: string | null | undefined | boolean; // TYPE MISMATCH
  cover: string | null;
  user: User | null; // CIRCULAR DEPENDENCY: references User
  friends: User[] | null;
  favoriteUsers: User[] | null | undefined;
}

// Role with circular reference
export interface Role {
  id: string | number;
  name: string | null;
  permissions: Permission[] | null; // CIRCULAR
  users: User[] | null; // CIRCULAR
  createdAt: string | number | Date | null;
}

// Permission with circular reference
export interface Permission {
  id: string | number | null;
  action: string | number; // TYPE MISMATCH
  resource: string | null;
  roles: Role[] | null; // CIRCULAR
  metadata: Record<string, unknown>;
}

// Product with deeply nested structure
export interface Product {
  id: string | number | null;
  name: string | null | 0 | false; // TYPE MISMATCH
  price: string | number | null | undefined;
  quantity: number | string | null; // TYPE MISMATCH
  description: string | null;
  manufacturer: Manufacturer | null; // CIRCULAR
  categories: Category[] | null;
  tags: (string | number | null)[] | null;
  variants: ProductVariant[] | null;
  metadata: Record<string, any>;
  inventory: Inventory | null; // CIRCULAR
}

export interface Manufacturer {
  id: string | number;
  name: string | null | number;
  products: Product[] | null; // CIRCULAR
  address: string | null;
  contact: string | number | null;
}

export interface Category {
  id: string | number | null;
  name: string | null;
  parent: Category | null; // CIRCULAR: self-reference
  children: Category[] | null; // CIRCULAR: self-reference
  products: Product[] | null; // CIRCULAR
  metadata: any;
}

export interface ProductVariant {
  id: string | number | null;
  productId: string | number | null;
  product: Product | null; // CIRCULAR
  sku: string | null | number;
  size: string | null | number | boolean;
  color: string | null;
  weight: number | string | null;
  price: string | number | null | undefined;
  stock: number | string | null;
}

export interface Inventory {
  id: string | number;
  productId: string | number | null;
  product: Product | null; // CIRCULAR
  quantity: number | string | null | undefined;
  warehouse: string | null | number;
  lastUpdated: string | number | Date | null;
  threshold: number | string | null;
}

// Order with deep nesting
export interface Order {
  id: string | number | null;
  userId: string | number | null;
  user: User | null; // CIRCULAR
  items: OrderItem[] | null | undefined;
  status: "pending" | "confirmed" | "shipped" | "delivered" | 1 | 2 | 3 | null; // TYPE MISMATCH
  total: number | string | null;
  tax: number | string | null | undefined;
  shipping: Shipping | null;
  createdAt: string | number | Date | null;
  updatedAt: string | number | Date | undefined;
  metadata: Record<string, any>;
}

export interface OrderItem {
  id: string | number | null;
  orderId: string | number | null;
  order: Order | null; // CIRCULAR
  productId: string | number | null;
  product: Product | null; // CIRCULAR
  quantity: number | string | null;
  price: number | string | null | undefined;
  discount: number | string | null | undefined;
}

export interface Shipping {
  id: string | number;
  orderId: string | number | null;
  order: Order | null; // CIRCULAR
  address: string | null | number;
  city: string | null;
  state: string | null | number;
  zip: string | number | null;
  country: string | null;
  trackingNumber: string | null | number;
  carrier: string | null | number;
  estimatedDelivery: string | number | Date | null;
  actualDelivery: string | number | Date | null | undefined;
}

// API Response with type issues
export interface ApiResponse<T = any> {
  success: boolean | "true" | "false" | 1 | 0 | null;
  data: T | null | undefined;
  error: ApiError | null | string | number;
  message: string | null;
  timestamp: string | number | Date | null;
  meta: Record<string, any>;
}

export interface ApiError {
  code: string | number | null;
  message: string | null | number;
  details: string | object | null | undefined;
  stack: string | null;
  metadata: any;
}
