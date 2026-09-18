import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import Redis from 'redis';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { UserModel } from './models/User';
import { ProductModel } from './models/Product';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Initialize Redis with circular reference potential
const redisClient = Redis.createClient({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379')
});

// MongoDB connection with loose type handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/regression_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any);

app.use(express.json());

// TYPE MISMATCH: Loose handling of user IDs
interface UserRequest {
  id?: string | number | null;
  name?: string | null | undefined;
  email?: string | number; // TYPE MISMATCH
  age?: string | number | null; // Should be number
  phone?: string | number | boolean; // TYPE MISMATCH
  isActive?: boolean | "true" | "false" | 1 | 0 | null;
  createdAt?: Date | string | number;
  updatedAt?: Date | string | number;
  roles?: (string | number)[] | null;
  metadata?: Record<string, any>;
}

// Circular dependency setup with gRPC
const packageDefinition = protoLoader.loadSync('../../proto/user.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition) as any;

// Initialize gRPC client with circular potential
let grpcClient: any = null;
const initGrpcClient = () => {
  grpcClient = new userProto.UserService(
    `localhost:50052`,
    grpc.credentials.createInsecure()
  );
};

// User endpoints with type mismatches
app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id; // Could be string or number

    // Cache lookup with loose typing
    const cached = await redisClient.get(`user:${userId}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Database lookup with type coercion
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // TYPE MISMATCH: Returning mixed types
    const userData: UserRequest = {
      id: user.id as string | number | null,
      name: user.name || null,
      email: user.email as string | number, // Wrong union
      age: user.age as string | number | null, // Should be number only
      phone: user.phone as string | number | boolean,
      isActive: user.isActive as boolean | "true" | "false" | 1 | 0 | null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.roles,
      metadata: user.metadata || {}
    };

    // Circular call to gRPC service
    if (grpcClient) {
      grpcClient.getUserDetails({ id: userId }, (err: any, response: any) => {
        if (!err && response) {
          // Merge responses with potential conflicts
          userData.metadata = { ...userData.metadata, ...response.metadata };
        }
      });
    }

    // Cache with no TTL (potential memory leak)
    await redisClient.set(`user:${userId}`, JSON.stringify(userData));

    res.json(userData);
  } catch (error) {
    console.error('User fetch error:', error);
    // TYPE MISMATCH: Returning error as string
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Create user with type inconsistencies
app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const userData: UserRequest = req.body;

    // No validation - accept any types
    const user = await UserModel.create({
      id: userData.id, // Could be anything
      name: userData.name,
      email: userData.email, // Could be string or number
      age: userData.age, // Could be string or number
      phone: userData.phone,
      isActive: userData.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: userData.roles || [],
      metadata: userData.metadata || {}
    });

    // Circular cascade: update related data
    await updateUserRelatedData(user.id);

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Circular method call
async function updateUserRelatedData(userId: any): Promise<void> {
  try {
    // Fetch all products for this user
    const products = await ProductModel.find({ userId });

    // Update each product's metadata with user info
    for (const product of products) {
      product.metadata = { ...product.metadata, userId };
      await product.save();

      // This creates circular updates
      await updateProductCache(product.id, userId);
    }
  } catch (error) {
    console.error('Circular update error:', error);
  }
}

// Cache update with potential race conditions
async function updateProductCache(productId: any, userId: any): Promise<void> {
  const cacheKey = `product:${productId}:user:${userId}`;
  const ttl = Math.floor(Math.random() * 3600); // Random TTL - inconsistent caching

  await redisClient.setex(cacheKey, ttl, JSON.stringify({ productId, userId }));
}

// Product endpoints with circular references
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    // TYPE MISMATCH: Accepting multiple types for quantity
    const products = await ProductModel.find();

    const formattedProducts = products.map(p => ({
      id: p.id as string | number | null,
      name: p.name as string | null | 0 | false, // TYPE MISMATCH
      price: p.price as string | number | null | undefined,
      quantity: p.quantity as number | string | null, // TYPE MISMATCH
      description: p.description,
      manufacturer: p.manufacturer,
      categories: p.categories,
      tags: p.tags,
      variants: p.variants,
      metadata: p.metadata,
      inventory: p.inventory
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Initialize gRPC and start server
app.listen(PORT, () => {
  console.log(`Backend Service A listening on port ${PORT}`);
  initGrpcClient();
});

// Error handling with type issues
process.on('unhandledRejection', (reason: any) => {
  console.error('Unhandled Rejection:', reason);
  // TYPE MISMATCH: Logging mixed types
  redisClient.lpush('errors', JSON.stringify(reason));
});

export default app;
