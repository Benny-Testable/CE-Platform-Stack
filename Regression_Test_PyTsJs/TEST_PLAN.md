# Regression Testing Plan - Regression_Test_PyTsJs

## Overview
This microservice repository is designed to test platform resilience when processing complex, problematic, and edge-case data. It creates scenarios that should cause platform tools and taxonomy analysis to fail or produce drastically different results compared to the baseline (CE-PYTS-008 branch).

## Architecture

### Frontend (TypeScript React)
- **Location**: `./frontend`
- **Issues**:
  - Type mismatches in interfaces (circular type definitions)
  - Inconsistent type handling in component props
  - State management with undefined/null issues
  - Circular component dependencies
  - Complex nested state with type unions

### Backend (JavaScript Node.js)
- **Location**: `./backend`
- **Issues**:
  - CIRCULAR DEPENDENCIES between models (User → Role → Permission → back to User)
  - Type inconsistencies across methods
  - Problematic merge and update logic
  - Silent error handling
  - Duplicate data creation
  - No validation on type mismatches

### Python APIs (Flask)
- **Location**: `./apis`
- **Issues**:
  - Circular imports between models
  - Type coercion issues
  - Problematic circular operations
  - Silent failure patterns
  - No proper data validation

## Test Data Issues

### Type Mismatches
- **ID Fields**: string | number | null | undefined
- **Email**: string | number (e.g., 12345)
- **Age**: number | string ("thirty", "-100", "9999999")
- **Status**: string | number (e.g., "pending" | 1 | 0)
- **Boolean Fields**: boolean | "true" | "false" | 0 | 1 | null

### Duplicate Data
- Same IDs with different values
- Duplicate relationships (user-role duplicates)
- Multiple product SKUs with same value
- Duplicate order items in single order

### Circular References
- Users ↔ Roles (bidirectional)
- Roles ↔ Permissions (bidirectional)
- Products ↔ Orders (bidirectional)
- Categories (self-referential)

### Edge Cases
- Null and undefined values throughout
- Empty strings mixed with valid strings
- Extreme numbers (-100, 9999999, MAX_INT)
- Invalid date formats mixed with valid ISO strings
- Empty arrays vs null vs undefined

### Conflicting Data
- Same entity with different values
- Inconsistent status values (delivered vs delivery)
- Case sensitivity mismatches (Warehouse A vs warehouse a)
- Quantity mismatches across warehouses

## Expected Platform Failures

### Type System
- Type checking failures
- Type coercion producing wrong results
- Schema validation errors
- Interface mismatch errors

### Data Integrity
- Duplicate key violations
- Referential integrity errors (circular references)
- Constraint violations
- Unique index violations (duplicate SKUs)

### Relationship Handling
- Circular dependency detection failures
- Stack overflow on circular reference traversal
- Infinite loop in serialization
- Unresolvable reference errors

### Analytics & Taxonomy
- Higher error counts
- Failed validation percentages significantly increased
- Type inconsistency scores elevated
- Circular dependency warnings
- Data quality metrics degraded
- Relationship complexity increased

## Testing Steps

1. **Data Import**
   - Load test data from `./test-data/*.json`
   - Record any import errors
   - Note data rejection/filtering

2. **Type Analysis**
   - Run platform type checking tools
   - Document type mismatch detections
   - Compare with baseline

3. **Circular Dependency Detection**
   - Run circular dependency scanner
   - Compare with CE-PYTS-008 results
   - Test infinite loop prevention

4. **Data Quality**
   - Run data validation tools
   - Record failure rates
   - Compare quality scores

5. **Taxonomy Analysis**
   - Run platform taxonomy on this branch
   - Compare results with CE-PYTS-008
   - Document metric changes

6. **Performance**
   - Monitor for hangs on circular references
   - Check memory usage
   - Test serialization limits

## Comparison Baseline

### CE-PYTS-008 (Baseline)
- Clean data
- Proper types
- No circular references
- No duplicates
- Validation: ~100% pass rate
- Expected error rate: ~0%
- Taxonomy results: Baseline

### Regression_Test_PyTsJs (This Branch)
- Complex/problematic data
- Type mismatches
- Circular references
- Duplicates
- Validation: Expected <50% pass rate
- Expected error rate: >50%
- Taxonomy results: Drastically different

## Success Criteria

The regression testing is successful if platform tools report:

✓ Higher error rates (5x-10x baseline)
✓ Type inconsistency detections increased
✓ Circular dependency warnings present
✓ Duplicate detection triggered
✓ Data quality metrics significantly lower
✓ Relationship complexity increased
✓ No infinite loops or hangs
✓ Graceful error handling

## Files Structure

```
Regression_Test_PyTsJs/
├── README.md                    # Project overview
├── TEST_PLAN.md                # This file
├── docker-compose.yml          # Microservice orchestration
├── .gitignore
│
├── frontend/                   # TypeScript React (problematic types)
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── src/
│       ├── types.ts           # Circular & mismatched types
│       └── components/
│           └── UserComponent.tsx  # Type violations
│
├── backend/                    # JavaScript Node.js (circular deps)
│   ├── package.json
│   ├── server.js
│   ├── Dockerfile
│   └── models/
│       ├── User.js            # CIRCULAR DEPENDENCY
│       ├── Role.js            # CIRCULAR DEPENDENCY
│       ├── Permission.js      # CIRCULAR DEPENDENCY
│       ├── Order.js
│       ├── Product.js
│       ├── Inventory.js
│       └── UserProfile.js
│
├── apis/                       # Python Flask (circular imports)
│   ├── app.py
│   ├── models.py             # CIRCULAR IMPORTS
│   ├── requirements.txt
│   └── Dockerfile
│
└── test-data/                  # Regression test data
    ├── README.md
    ├── users.json             # Duplicates, type mismatches
    ├── products.json          # Duplicates, circular refs
    ├── orders.json            # Circular dependencies
    ├── inventory.json         # Warehouse conflicts
    └── roles_permissions.json # Circular relationships
```

## Notes

- This is intentionally broken data for regression testing
- DO NOT use in production
- Expected to cause platform tool failures
- Designed to stress test error handling
- Monitor for infinite loops and hangs
- Document all failures and metric changes

## Version Info

- Branch: `Regression_Test_PyTsJs`
- Base: CE-PYTS-008
- Purpose: Regression Testing
- Data Complexity: HIGH
- Expected Failures: HIGH
