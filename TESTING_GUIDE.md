# Comprehensive Regression Testing Guide

This document provides detailed instructions for understanding and running the regression testing suite for the Polyglot Microservices Platform.

## Overview

This repository is designed as an **intentional regression testing framework** with:
- **80+ type mismatches** across TypeScript and Python services
- **Circular dependencies** both at code and data levels
- **Multiple data integrity issues** including duplicates and conflicts
- **Protocol Buffer definitions** with self-referential message types
- **Service-to-service circular calls** creating potential deadlocks
- **Cache inconsistencies** and memory leak patterns

## Architecture

### Microservices

1. **Frontend (Angular 20)**
   - Location: `frontend/src/`
   - Services: `user.service.ts`, `product.service.ts`, `order.service.ts`
   - Type Issues: Mixed union types, circular service dependencies
   - Key File: `frontend/src/types.ts` - intentional type mismatches

2. **Backend Service A (Node.js/Express)**
   - Location: `backend-service-a/src/`
   - Features: MongoDB integration, gRPC client, Redis caching
   - Type Issues: Loose TypeScript interfaces, mixed type handling
   - Models: User, Product with circular references

3. **Backend Service B (Node.js/Express)**
   - Socket.io integration, message queues, Elasticsearch
   - WebSocket circular subscriptions
   - Type issues in response handling

4. **Backend Python Service A (FastAPI)**
   - Location: `backend-python-service-a/app/`
   - Features: Pydantic models with union types, gRPC server
   - Type Issues: Union types for IDs, emails, quantities
   - Circular reference patterns between User and UserProfile

5. **Backend Python Service B (Celery)**
   - Location: `backend-python-service-b/app/`
   - Features: Async task processing, Elasticsearch indexing
   - Type Issues: Mixed parameter types, loose validation
   - Circular task dependencies

### Databases & Infrastructure

- **MongoDB 8**: Loose schema with Mixed type fields
- **Elasticsearch 8**: Document indexing with type inconsistencies
- **Redis 7**: Caching with no TTL (memory leak patterns)
- **RabbitMQ 3.13**: Message queue for async processing
- **Kafka 7.6.0**: Event streaming with circular topics
- **Prometheus**: Metrics collection

## Type Mismatch Categories

### 1. ID Type Mismatches
```typescript
// Should be consistent, but intentionally mixed:
id: string | number | null  // Instead of just string
```

### 2. Email Type Mismatches
```typescript
// Should be string only:
email: string | number  // Accepts numeric values
```

### 3. Quantity Type Mismatches
```typescript
// Should be number only:
quantity: number | string | null  // Accepts strings like "10"
```

### 4. Status Code Mixing
```typescript
// Order status can be string or number:
status: "pending" | "confirmed" | 1 | 2 | 3  // Mixed types
```

### 5. Timestamp Inconsistencies
```typescript
// Should be Date, but accepts multiple formats:
createdAt: Date | string | number | null
```

## Circular Dependency Patterns

### Code-Level Circular Dependencies

1. **Frontend Services**
   ```
   UserService → ProductService → UserService
   UserService → OrderService → UserService
   ```

2. **Backend Services**
   ```
   Backend-A (gRPC Client) → Backend-Python-A (gRPC Server)
   Backend-B (WebSocket) → Backend-A (REST)
   Backend-Python-B (Celery) → Backend-A (HTTP)
   ```

### Data-Level Circular Dependencies

1. **User ↔ UserProfile**
   - User has reference to UserProfile
   - UserProfile has reference to User

2. **Product ↔ Manufacturer**
   - Product references Manufacturer
   - Manufacturer has list of Products

3. **Order ↔ OrderItem ↔ Product**
   - Complex circular relationships

### Self-Referential Dependencies

1. **Category (Self-Reference)**
   - Category can have parent Category
   - Category can have child Categories

2. **Role ↔ Permission**
   - Role has list of Permissions
   - Permission has list of Roles

## Data Integrity Issues

### Duplicate Key Violations
- Multiple users with same email
- Multiple products with same SKU
- Duplicate order IDs with different data

### Invalid References
- Orders referencing non-existent users
- Products referencing non-existent manufacturers
- Order items with invalid product IDs

### Type Coercion Issues
- String "123" vs number 123 vs null
- Boolean false vs number 0 vs string "false"
- Float "99.99" vs integer 99

## Running Tests

### Prerequisites

```bash
# Install Docker & Docker Compose
# Have Python 3.8+ and Node.js 16+ installed

# Install dependencies
cd frontend && npm install
cd backend-service-a && npm install
cd backend-python-service-a && pip install -r requirements.txt
```

### Start Services

```bash
# Start all services with Docker Compose
docker-compose up -d

# Wait for services to be ready (15-30 seconds)
docker-compose logs -f

# Check service health
curl http://localhost:3001/health  # Backend A
curl http://localhost:8001/docs   # Backend Python A (Swagger UI)
```

### Run Regression Test Suite

```bash
# Make script executable
chmod +x scripts/run_regression_tests.sh

# Run full test suite
./scripts/run_regression_tests.sh

# Or run specific tests
python3 -c "import pytest; pytest.main(['test_types.py', '-v'])"
```

### Generate Test Data

```bash
# Generate synthetic test data with intentional issues
python3 scripts/generate_test_data.py \
    --mongo-uri mongodb://localhost:27017 \
    --es-host http://localhost:9200 \
    --users 100 \
    --products 200 \
    --orders 150
```

## Expected Test Failures

The regression test suite is **designed to fail** with approximately:

### Type System Failures
- **80+ type mismatches** between backend services and frontend
- **30+ serialization failures** due to incompatible types
- **15+ circular dependency warnings** from type checkers

### Data Layer Failures
- **100+ duplicate key violations**
- **50+ invalid reference errors**
- **20+ cascade update failures**

### Integration Failures
- **20+ timeout scenarios** due to circular calls
- **10+ deadlock patterns** in service communication
- **5+ infinite recursion** attempts

### Expected Error Distribution

```
Type Mismatches:         60 occurrences
Circular References:     25 occurrences
Data Integrity:          40 occurrences
Serialization:           30 occurrences
Cache Inconsistency:     15 occurrences
Service Communication:   20 occurrences
─────────────────────────────────────
Total Expected Errors:   190+ scenarios
```

## Key Test Files

### TypeScript Files with Type Issues
- `frontend/src/types.ts` - Interface definitions with mismatches
- `frontend/src/services/user.service.ts` - Circular dependencies
- `frontend/src/services/product.service.ts` - Type coercion
- `frontend/src/services/order.service.ts` - Mixed return types
- `backend-service-a/src/index.ts` - Loose typing
- `backend-service-a/src/models/User.ts` - Loose schema

### Python Files with Type Issues
- `backend-python-service-a/app/main.py` - Pydantic with unions
- `backend-python-service-b/app/celery_tasks.py` - Async type issues

### Protocol Buffers with Type Mismatches
- `proto/user.proto` - All messages have type incompatibilities

### Test Data Generation
- `scripts/generate_test_data.py` - Generates 500+ MongoDB documents with duplicates and conflicts
- `scripts/run_regression_tests.sh` - Orchestrates all regression tests

## Debugging Type Mismatches

### TypeScript Strict Mode
```bash
cd frontend
npx tsc --strict --noEmit
# Will show 80+ type errors
```

### Python Type Checking
```bash
mypy backend-python-service-a/app/main.py --strict
# Will show 40+ type errors
```

### Runtime Type Inspection
```bash
# TypeScript/Node
node -e "const types = require('./frontend/dist/types'); console.log(typeof types.User)"

# Python
python3 -c "from backend_python_service_a.app.main import User; print(User.__fields__)"
```

## Viewing Circular Dependencies

### MongoDB
```javascript
// Query circular references
db.users.find({ "profile": { $exists: true } });
db.roles.find({ "permissions": { $exists: true } });
```

### Elasticsearch
```bash
# View indexed documents with circular refs
curl "localhost:9200/users/_search?q=profile:*"
curl "localhost:9200/products/_search?q=manufacturer:*"
```

## Monitoring & Logs

### Docker Logs
```bash
# Frontend
docker-compose logs frontend-angular

# Backend services
docker-compose logs backend-service-a
docker-compose logs backend-service-b
docker-compose logs backend-python-service-a
docker-compose logs backend-python-service-b

# Databases
docker-compose logs mongo
docker-compose logs elasticsearch
docker-compose logs redis
```

### Prometheus Metrics
```bash
# Access metrics at http://localhost:9090
# Query examples:
# http_requests_total
# service_latency_seconds
# database_query_duration
```

## Intentional Anti-Patterns

These are **intentional design choices** for regression testing:

1. **No Type Validation** - Accept any type for any field
2. **Loose Schemas** - MongoDB Schema.Types.Mixed everywhere
3. **Circular Caching** - No TTL on Redis keys
4. **No Locking** - Race conditions in concurrent updates
5. **Eval() Usage** - Security risk in Python backend
6. **No Error Handling** - Let exceptions propagate
7. **Infinite Recursion** - Category tree traversal
8. **Memory Leaks** - Subscriptions never unsubscribed

## Success Criteria for Regression Testing

A successful regression test run should demonstrate:

1. **20x-100x higher error rate** than well-designed systems
2. **80+ distinct type inconsistencies**
3. **15+ circular dependency warnings**
4. **100+ duplicate key constraint violations**
5. **30+ serialization/deserialization failures**
6. **Measurable performance degradation** due to circular calls

## Cleanup

```bash
# Stop all services
docker-compose down

# Remove data volumes
docker-compose down -v

# Clean up logs
rm -rf test_logs/
rm -rf node_modules/ venv/

# Prune docker resources
docker system prune -a
```

## Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Find and kill process
lsof -i :3001
kill -9 <PID>
```

### Issue: MongoDB Connection Refused
```bash
# Ensure MongoDB is running
docker ps | grep mongo
docker-compose up -d mongo
```

### Issue: Type Errors Not Showing
```bash
# Ensure TypeScript strict mode
cd frontend
npx tsc --strict --listFilesOnly
```

### Issue: Circular Dependencies Not Detected
```bash
# Install circular dependency detector
npm install --save-dev circular-dependency-plugin
# Configure in webpack.config.js
```

## Reference Documentation

- **README.md** - High-level architecture overview
- **TEST_PLAN.md** - Detailed testing strategy and metrics
- **TESTING_GUIDE.md** - This file (comprehensive testing guide)
- **docker-compose.yml** - Service orchestration
- **Frontend types.ts** - TypeScript type definitions with issues

## Contributing

To add more regression test cases:

1. Create new service method with intentional type mismatch
2. Document expected failure mode
3. Add to test suite in `scripts/run_regression_tests.sh`
4. Update error count in TEST_PLAN.md
5. Commit with explanation of intentional issue

## Contact & Support

For questions about the regression testing framework, refer to:
- Architecture diagram in README.md
- Type issues documented in each service file
- Test execution logs in `test_logs/` directory

---

**Last Updated:** September 18, 2026
**Framework Version:** 2.0 (Complex Regression Testing)
**Total Type Mismatches:** 80+
**Circular Dependencies:** 30+
**Expected Test Failures:** 190+
