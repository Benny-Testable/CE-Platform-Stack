# Regression Test Data

This directory contains complex, problematic test data designed to stress-test and cause platform tools and taxonomy analysis to fail or produce different results.

## Test Data Files

### 1. users.json
Contains user data with multiple types of issues:
- **Duplicate IDs**: Same ID with different data (user-1, user-2)
- **Type Mismatches**: 
  - id: string vs number vs null vs undefined
  - email: string vs number (123456)
  - age: number vs string ("thirty")
  - phone: string vs number vs boolean (true)
  - isActive: boolean vs string ("true") vs number (0, 1)
- **Null/Undefined Values**: Multiple entries with null, undefined, empty strings
- **Edge Cases**: Extreme values (-100 for age), MAX_INT scenarios
- **Conflicting Data**: Same user ID with different emails, names

### 2. products.json
Contains product data with complex issues:
- **Duplicate IDs**: prod-1 and prod-2 appear multiple times with different data
- **Type Mismatches**:
  - name: string vs number (123) vs null vs empty string
  - price: number vs string vs null
  - quantity: number vs string vs null
  - categories: array vs string vs null
- **Circular References**: Products reference each other through categories
- **Duplicate SKUs**: "LP-001" appears twice, "MO-001" appears three times
- **Missing Data**: null categories, missing descriptions
- **Invalid Data**: Negative quantities

### 3. orders.json
Contains order data with circular dependencies:
- **Duplicate Order IDs**: order-1 appears 3 times with different items and totals
- **Type Mismatches**:
  - status: string vs number (1 = pending?, shipped, etc.)
  - items: array vs null vs string "not an array"
  - total: number vs string vs null
  - dates: ISO string vs timestamp vs invalid
- **Circular References**: Orders reference users and products
- **Inconsistent Calculations**: Same order with different totals
- **Duplicate Items**: Same item appears multiple times in same order
- **Conflicting Status**: order-3 shows both "delivered" and "delivery"

### 4. inventory.json
Contains inventory data with:
- **Duplicate IDs**: inv-1 appears 3 times with different quantities
- **Type Mismatches**:
  - quantity: number vs string vs null vs negative
  - warehouse: string vs number vs null
  - threshold: number vs string vs negative
- **Warehouse Conflicts**: Same product in same warehouse with different quantities
- **Cross-warehouse Inconsistencies**: Product quantities don't sum correctly
- **Missing Thresholds**: null or undefined threshold values
- **Case Sensitivity Issues**: "Warehouse A" vs "warehouse a"

### 5. roles_permissions.json
Contains role and permission data with circular references:
- **Duplicate Role IDs**: role-1 and role-2 appear multiple times
- **Type Mismatches**:
  - name: string vs number vs null
  - action: string vs number vs boolean vs null
  - users/permissions: array vs string vs single value
- **Circular References**:
  - Roles reference users, users would reference roles
  - Roles reference permissions, permissions reference roles
  - Duplicate relationships with conflicting grant status
- **Duplicate Permissions**: Same permission granted multiple times with different status
- **User-Role Duplicates**: Same user assigned to same role multiple times
- **Invalid Actions**: "invalid" action with "unknown" resource

## Expected Platform Behavior

When the platform processes this regression test data, it should encounter:

### Type System Issues
- Type checking failures
- Implicit type conversions leading to wrong results
- Schema validation failures

### Data Integrity Issues
- Duplicate key violations
- Referential integrity errors (circular references)
- Constraint violations

### Relationship Issues
- Circular dependency detection failures
- Inconsistent relationship data
- Unresolvable references

### Validation Failures
- Email format validation failures (123456 as email)
- Age range validation failures (-100, 9999999)
- Status enum validation failures ("delivery" vs "delivered")
- SKU uniqueness violations

### Analytics Impact
The taxonomy analysis should report:
- Higher error rate
- More failed validations
- Type inconsistency scores
- Data quality metrics significantly degraded
- Relationship complexity increased
- Circular dependency warnings

## Usage

1. Load this data into the platform
2. Run platform analysis tools
3. Compare results with baseline (CE-PYTS-008)
4. Document all failures, warnings, and changed metrics
5. Identify which tools are affected by which data issues

## Notes

This test data is intentionally malformed and problematic. It is NOT suitable for production use and is designed specifically for regression testing and platform stress testing.
