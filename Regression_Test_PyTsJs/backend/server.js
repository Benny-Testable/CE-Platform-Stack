// Backend Server - Express with circular dependencies and type issues

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Role = require('./models/Role');
const Permission = require('./models/Permission');
const Order = require('./models/Order');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory databases with type inconsistencies
const usersDB = {};
const rolesDB = {};
const productsDB = {};
const ordersDB = {};

// Routes with problematic patterns

// Create User - Type mismatches
app.post('/api/users', (req, res) => {
  const userData = req.body;
  const user = new User(userData);

  // Store with potential type mismatch
  const userId = user.id;
  usersDB[userId] = user;

  res.status(201).json(user.toJSON());
});

// Get User - Circular reference
app.get('/api/users/:userId', (req, res) => {
  const userId = req.params.userId;

  // Try to find with type coercion
  let user = usersDB[userId];
  if (!user && !isNaN(userId)) {
    user = usersDB[parseInt(userId)];
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user.toJSON());
});

// Add Role to User - CIRCULAR OPERATION
app.post('/api/users/:userId/roles/:roleId', async (req, res) => {
  const { userId, roleId } = req.params;

  const user = usersDB[userId];
  const role = rolesDB[roleId];

  if (!user || !role) {
    return res.status(404).json({ error: 'User or Role not found' });
  }

  // CIRCULAR: Both modify each other
  await user.addRole(roleId);
  await role.addUser(userId);

  res.json({
    user: user.toJSON(),
    role: role.toJSON(),
    message: 'Role added (circular refs created)'
  });
});

// Create Role
app.post('/api/roles', (req, res) => {
  const roleData = req.body;
  const role = new Role(roleData);

  rolesDB[role.id] = role;

  res.status(201).json(role.toJSON());
});

// Merge Users - Problematic merge logic
app.post('/api/users/merge', (req, res) => {
  const { userId1, userId2 } = req.body;

  const user1 = usersDB[userId1];
  const user2 = usersDB[userId2];

  if (!user1 || !user2) {
    return res.status(404).json({ error: 'Users not found' });
  }

  // Merge without proper validation (creates duplicates)
  const merged = user1.mergeWith(user2);

  // Data is now duplicate in both users
  return res.json(merged.toJSON());
});

// Create Product
app.post('/api/products', (req, res) => {
  const productData = req.body;
  const product = new Product(productData);

  productsDB[product.id] = product;

  res.status(201).json({
    id: product.id,
    name: product.name,
    price: product.getPrice(),
    message: 'Product created'
  });
});

// Check Product Stock - Type coercion issues
app.get('/api/products/:productId/stock', (req, res) => {
  const productId = req.params.productId;
  const product = productsDB[productId];

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const inStock = product.checkStock();

  res.json({
    productId,
    inStock,
    price: product.getPrice(),
    quantity: product.quantity
  });
});

// Create Order - CIRCULAR with User
app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  const order = new Order(orderData);

  ordersDB[order.id] = order;

  // CIRCULAR: Add to user's orders
  const user = usersDB[order.userId];
  if (user && user.orders) {
    user.orders.push(order.id);
  }

  return res.status(201).json({
    id: order.id,
    status: order.status,
    total: order.calculateTotal(),
    message: 'Order created (circular refs)'
  });
});

// Get data with potential circular serialization issues
app.get('/api/debug/data', (req, res) => {
  try {
    const data = {
      users: Object.entries(usersDB).map(([id, user]) => ({
        id: String(id),
        data: user.toJSON()
      })),
      roles: Object.entries(rolesDB).map(([id, role]) => ({
        id: String(id),
        data: role.toJSON()
      })),
      products: Object.keys(productsDB).length,
      orders: Object.keys(ordersDB).length
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Serialization failed',
      message: error.message,
      type: error.constructor.name
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('WARNING: This server contains intentional circular dependencies and type issues for regression testing');
});

module.exports = app;
