# CE-Platform-Stack - Regression Testing Branch
## Regression_Test_PyTsJs

This is a regression testing branch designed to test platform resilience with complex, problematic, and edge-case data.

### Tech Stack
- **Frontend**: TypeScript (React)
- **Backend**: JavaScript (Node.js/Express)
- **APIs & Utilities**: Python (Flask)

### Features
- **Complex Data**: Nested structures, circular dependencies, type mismatches
- **Duplicate Records**: Multiple instances of conflicting data
- **Edge Cases**: Null values, empty strings, extreme numbers
- **Negative Test Data**: Invalid formats, contradictory information
- **Database Relationships**: Circular references, complex joins

### Directory Structure
```
├── frontend/               # TypeScript React application
├── backend/               # JavaScript Node.js backend
├── apis/                  # Python Flask APIs
├── test-data/            # Regression test data (complex/negative)
├── docker-compose.yml    # Microservice orchestration
└── README.md
```

### Test Data Characteristics
- Duplicate records across tables
- Conflicting/contradictory values
- Type mismatches (string/number/boolean confusion)
- Null and undefined values
- Empty strings and extreme values (MAX_INT, MIN_INT)
- Circular database relationships
- Deeply nested JSON structures
- Invalid references and cross-table inconsistencies

### Expected Results
Platform tools and taxonomy analysis should report:
- Higher error rates
- Failed validations
- Type inconsistencies
- Relationship constraint violations
- Data integrity issues

This is designed for regression testing only.
