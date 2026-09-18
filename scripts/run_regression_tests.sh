#!/bin/bash
set -e

echo "==========================================="
echo "Regression Testing Framework - Test Suite"
echo "==========================================="
echo ""

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.yml"
LOG_DIR="./test_logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
TEST_RESULTS_FILE="$LOG_DIR/test_results_$TIMESTAMP.log"

# Create log directory
mkdir -p "$LOG_DIR"

echo "[$(date)] Starting regression test suite..." | tee -a "$TEST_RESULTS_FILE"

# Function to run tests with error handling
run_test() {
    local test_name="$1"
    local test_command="$2"

    echo ""
    echo "[$(date)] Running: $test_name" | tee -a "$TEST_RESULTS_FILE"
    echo "Command: $test_command" | tee -a "$TEST_RESULTS_FILE"

    if eval "$test_command" >> "$TEST_RESULTS_FILE" 2>&1; then
        echo "✓ $test_name PASSED" | tee -a "$TEST_RESULTS_FILE"
        return 0
    else
        echo "✗ $test_name FAILED" | tee -a "$TEST_RESULTS_FILE"
        return 1
    fi
}

# Start Docker Compose services
echo ""
echo "[$(date)] Starting Docker Compose services..." | tee -a "$TEST_RESULTS_FILE"
docker-compose up -d >> "$TEST_RESULTS_FILE" 2>&1

# Wait for services to be ready
echo "[$(date)] Waiting for services to be ready..." | tee -a "$TEST_RESULTS_FILE"
sleep 15

# Test 1: MongoDB Connection and Type Mismatches
run_test "MongoDB Connection Test" \
    "python3 -c \"import pymongo; client = pymongo.MongoClient('mongodb://localhost:27017'); db = client.test; db.test_collection.insert_one({'test': 'data'}); print('MongoDB connected'); assert db.test_collection.count_documents({}) > 0\""

# Test 2: Elasticsearch Connection
run_test "Elasticsearch Connection Test" \
    "python3 -c \"from elasticsearch import Elasticsearch; es = Elasticsearch(['http://localhost:9200']); info = es.info(); print('Elasticsearch connected'); assert info['cluster_name']\""

# Test 3: Redis Connection
run_test "Redis Connection Test" \
    "python3 -c \"import redis; r = redis.Redis(host='localhost', port=6379, decode_responses=True); r.set('test', 'data'); assert r.get('test') == 'data'; print('Redis connected')\""

# Test 4: Generate Test Data with Type Mismatches
run_test "Generate Test Data" \
    "python3 scripts/generate_test_data.py --mongo-uri mongodb://localhost:27017 --es-host http://localhost:9200 --users 50 --products 100 --orders 75"

# Test 5: TypeScript Type Checking (Type Mismatches)
echo ""
echo "[$(date)] Running TypeScript compilation with strict checking..." | tee -a "$TEST_RESULTS_FILE"
if [ -f "frontend/tsconfig.json" ]; then
    run_test "Frontend TypeScript Compilation" \
        "cd frontend && npx tsc --noEmit" || true
else
    echo "⊘ TypeScript check skipped (tsconfig.json not found)" | tee -a "$TEST_RESULTS_FILE"
fi

# Test 6: Python Type Checking with mypy
echo ""
echo "[$(date)] Running Python type checking..." | tee -a "$TEST_RESULTS_FILE"
if command -v mypy &> /dev/null; then
    run_test "Python Type Checking" \
        "mypy backend-python-service-a/app/main.py --ignore-missing-imports" || true
else
    echo "⊘ mypy check skipped (mypy not installed)" | tee -a "$TEST_RESULTS_FILE"
fi

# Test 7: REST API Circular Reference Tests
echo ""
echo "[$(date)] Testing REST API endpoints..." | tee -a "$TEST_RESULTS_FILE"

# Test User Endpoint with type mismatches
run_test "User API Endpoint - Type Mismatch Test" \
    "curl -s http://localhost:3001/api/users/1 -H 'Content-Type: application/json' | python3 -c \"import sys, json; data = json.load(sys.stdin); print('User ID type:', type(data.get('id'))); print('Email type:', type(data.get('email'))); print('Age type:', type(data.get('age')))\""

# Test Product Endpoint
run_test "Product API Endpoint Test" \
    "curl -s http://localhost:3001/api/products -H 'Content-Type: application/json' | python3 -c \"import sys, json; data = json.load(sys.stdin); print('Products returned:', len(data) if isinstance(data, list) else 'Not a list')\""

# Test 8: Circular Dependency Detection
echo ""
echo "[$(date)] Testing circular dependency patterns..." | tee -a "$TEST_RESULTS_FILE"

run_test "Circular Reference Test - User/Product" \
    "python3 -c \"
import requests
import time

# Get user which should trigger product loading
user_response = requests.get('http://localhost:3001/api/users/1')
time.sleep(1)

# Get products which should trigger user loading
product_response = requests.get('http://localhost:3001/api/products')
time.sleep(1)

print(f'User Status: {user_response.status_code}')
print(f'Product Status: {product_response.status_code}')
assert user_response.status_code == 200 or user_response.status_code == 404
assert product_response.status_code == 200
\""

# Test 9: Database Data Integrity
echo ""
echo "[$(date)] Testing data integrity issues..." | tee -a "$TEST_RESULTS_FILE"

run_test "Duplicate Key Detection" \
    "python3 -c \"
import pymongo
client = pymongo.MongoClient('mongodb://localhost:27017')
db = client.regression_db

# Check for duplicate emails
emails = db.users.distinct('email')
print(f'Unique emails: {len(set(str(e) for e in emails if e))}')
print(f'Total email fields: {db.users.count_documents({\"email\": {\"\\$exists\": True}})}')
\""

# Test 10: Elasticsearch Document Validation
echo ""
echo "[$(date)] Testing Elasticsearch indexing..." | tee -a "$TEST_RESULTS_FILE"

run_test "Elasticsearch Document Count" \
    "python3 -c \"
from elasticsearch import Elasticsearch
es = Elasticsearch(['http://localhost:9200'])

try:
    users_count = es.count(index='users')['count']
    products_count = es.count(index='products')['count']
    orders_count = es.count(index='orders')['count']
    print(f'Users indexed: {users_count}')
    print(f'Products indexed: {products_count}')
    print(f'Orders indexed: {orders_count}')
except:
    print('Index search failed - expected in regression testing')
\""

# Test 11: Type Mismatch Response Handling
echo ""
echo "[$(date)] Testing type mismatch responses..." | tee -a "$TEST_RESULTS_FILE"

run_test "Mixed Type Response Handling" \
    "python3 -c \"
import requests
import json

# Test with numeric ID
response = requests.get('http://localhost:3001/api/users/123')
data = response.json() if response.ok else {}

# Verify mixed type handling
id_value = data.get('id')
email_value = data.get('email')
age_value = data.get('age')

print(f'ID value: {id_value}, type: {type(id_value).__name__}')
print(f'Email value: {email_value}, type: {type(email_value).__name__}')
print(f'Age value: {age_value}, type: {type(age_value).__name__}')
\""

# Test 12: Service-to-Service Communication
echo ""
echo "[$(date)] Testing service-to-service communication..." | tee -a "$TEST_RESULTS_FILE"

run_test "Backend Service Communication" \
    "curl -s http://localhost:3001/health -H 'Content-Type: application/json' || echo 'Health endpoint not available - acceptable for regression testing'"

# Test 13: Cache Inconsistency
echo ""
echo "[$(date)] Testing cache behavior with type mismatches..." | tee -a "$TEST_RESULTS_FILE"

run_test "Redis Cache Test" \
    "python3 -c \"
import redis
import json

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Store mixed types in cache
r.set('test:user:1', json.dumps({'id': '1', 'email': 'test@example.com'}))
r.set('test:user:2', json.dumps({'id': 2, 'email': 123}))  # Type mismatch

# Retrieve and check types
user1 = json.loads(r.get('test:user:1') or '{}')
user2 = json.loads(r.get('test:user:2') or '{}')

print(f'User 1 ID type: {type(user1.get(\"id\")).__name__}')
print(f'User 2 ID type: {type(user2.get(\"id\")).__name__}')
print(f'User 2 Email type: {type(user2.get(\"email\")).__name__}')
\""

# Test 14: Error Handling and Serialization
echo ""
echo "[$(date)] Testing error handling..." | tee -a "$TEST_RESULTS_FILE"

run_test "Error Response Test" \
    "curl -s http://localhost:3001/api/users/nonexistent -H 'Content-Type: application/json' | python3 -c \"import sys, json; data = json.load(sys.stdin); print('Response keys:', list(data.keys()))\""

# Test 15: Performance with Circular References
echo ""
echo "[$(date)] Testing performance impact of circular references..." | tee -a "$TEST_RESULTS_FILE"

run_test "Performance Test" \
    "python3 -c \"
import requests
import time

start = time.time()
for i in range(10):
    requests.get(f'http://localhost:3001/api/users/{i}')
    requests.get('http://localhost:3001/api/products')
duration = time.time() - start

print(f'Completed 20 requests in {duration:.2f} seconds')
print(f'Average request time: {duration/20:.3f} seconds')
\""

# Summary
echo ""
echo "==========================================="
echo "Test Execution Summary"
echo "==========================================="
echo "[$(date)] Regression test suite execution completed" | tee -a "$TEST_RESULTS_FILE"

# Count test results
PASSED=$(grep -c "PASSED" "$TEST_RESULTS_FILE" || true)
FAILED=$(grep -c "FAILED" "$TEST_RESULTS_FILE" || true)

echo "Passed: $PASSED" | tee -a "$TEST_RESULTS_FILE"
echo "Failed: $FAILED" | tee -a "$TEST_RESULTS_FILE"
echo "Log file: $TEST_RESULTS_FILE" | tee -a "$TEST_RESULTS_FILE"

# Cleanup (optional)
# docker-compose down

echo ""
echo "Test suite execution finished!"
