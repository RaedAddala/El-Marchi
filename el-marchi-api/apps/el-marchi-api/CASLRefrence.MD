# Introduction to CASL

**CASL** (Casl Access Security Layer) is a lightweight and flexible access control system for JavaScript applications. It's designed to help developers implement fine-grained access control policies easily and efficiently. CASL supports both **role-based access control (RBAC)** and **attribute-based access control (ABAC)**, allowing for a wide range of authorization scenarios.

## Role-Based Access Control (RBAC) in CASL

- **Concept**: RBAC involves assigning permissions to roles, and roles to users. Users gain permissions indirectly through their roles.

- **In CASL**:
  - **Roles** are defined as collections of permissions.
  - **Users** can have one or multiple roles, thereby inheriting all associated permissions.
  - Example:

    ```typescript
    // Role definition
    const adminRole = {
      name: 'admin',
      permissions: [
        { action: 'manage', subject: 'all' } // Grants all actions on all subjects
      ]
    }

    // Assigning role to user
    user.roles = [adminRole];
    ```

- **Benefits**: Simplifies permission management by grouping permissions into roles. Easy to understand and maintain for smaller to medium-sized applications.

## Attribute-Based Access Control (ABAC) in CASL

- **Concept**: ABAC evaluates access decisions based on attributes of the user, the resource, and the environment. It allows for more dynamic and context-aware permissions.

- **In CASL**:
  - **Permissions** can include conditions based on attributes.
  - **MongoQuery** conditions can be used to define these rules.
  - Example:

    ```typescript
    // Permission with conditions
    const readPermission = {
      action: 'read',
      subject: 'Document',
      conditions: {
        "ownerId": { "$eq": user.id }, // Only documents owned by the user
        "status": { "$in": ["approved"] } // Must be approved documents
      }
    }

    // Assigning permission directly to user
    user.permissions = [readPermission];
    ```

- **Benefits**: Offers more granular control over access, allowing for dynamic policies that can change based on various attributes (like user's department, time of day, or document status).

## Combining RBAC and ABAC in CASL

- CASL allows for a hybrid approach where roles can define broad permissions, while specific conditions or attributes can further refine access control.

- **Example**:

  ```typescript
  const managerRole = {
    name: 'manager',
    permissions: [
      { action: 'read', subject: 'Report', conditions: { "department": { "$in": user.departments } } },
      { action: 'create', subject: 'Report' }
    ]
  };

  // User with a role that includes attribute-based conditions
  user.roles = [managerRole];
  ```

- **Advantages**: Flexibility to scale from simple to complex access control scenarios, adapting to both organizational structure (roles) and specific business logic (attributes).

CASL's architecture supports both these models, making it versatile for different types of applications, from simple CRUD operations to complex, multi-layered systems.

## CASL Conditions

CASL uses this structure to define its roles: `Action:Subject:Condition`. Conditions follows the `MongoQuery` syntax. Here is how to use this syntax:

### Comparison Operators

- **$eq (Equal)**
  - `{ "field": { "$eq": value } }`
  - Example: `{ "age": { "$eq": 30 } }`

- **$ne (Not Equal)**
  - `{ "field": { "$ne": value } }`
  - Example: `{ "status": { "$ne": "inactive" } }`

- **$gt (Greater Than)**
  - `{ "field": { "$gt": value } }`
  - Example: `{ "price": { "$gt": 100 } }`

- **$gte (Greater Than or Equal)**
  - `{ "field": { "$gte": value } }`
  - Example: `{ "quantity": { "$gte": 50 } }`

- **$lt (Less Than)**
  - `{ "field": { "$lt": value } }`
  - Example: `{ "price": { "$lt": 500 } }`

- **$lte (Less Than or Equal)**
  - `{ "field": { "$lte": value } }`
  - Example: `{ "age": { "$lte": 18 } }`

- **$in**
  - `{ "field": { "$in": [value1, value2, ...] } }`
  - Example: `{ "category": { "$in": ["books", "electronics"] } }`

- **$nin (Not In)**
  - `{ "field": { "$nin": [value1, value2, ...] } }`
  - Example: `{ "tags": { "$nin": ["urgent", "priority"] } }`

### Logical Operators

- **$and**
  - `{ "$and": [ { <expression1> }, { <expression2> }, ... ] }`
  - Example:

    ```markdown
    { "$and": [
        { "price": { "$lt": 1000 } },
        { "stock": { "$gt": 0 } }
    ] }
    ```

- **$or**
  - `{ "$or": [ { <expression1> }, { <expression2> }, ... ] }`
  - Example:

    ```markdown
    { "$or": [
        { "status": "A" },
        { "qty": { "$lt": 30 } }
    ] }
    ```

- **$nor**
  - `{ "$nor": [ { <expression1> }, { <expression2> }, ... ] }`
  - Example:

    ```markdown
    { "$nor": [
        { "status": "A" },
        { "qty": 6 }
    ] }
    ```

- **$not**
  - `{ "field": { "$not": { <operator-expression> } } }`
  - Example: `{ "price": { "$not": { "$gt": 1.99 } } }`

### Element Operators

- **$exists**
  - `{ "field": { "$exists": <boolean> } }`
  - Example: `{ "username": { "$exists": true } }`

- **$type**
  - `{ "field": { "$type": <BSON type> } }`
  - Example: `{ "age": { "$type": "int" } }`

### Array Operators

- **$all**
  - `{ "field": { "$all": [<value1>, <value2>, ...] } }`
  - Example: `{ "tags": { "$all": ["red", "blank"] } }`

- **$elemMatch**
  - `{ "field": { "$elemMatch": { <query1>, <query2>, ... } } }`
  - Example:

    ```markdown
    { "results": { "$elemMatch": { "score": { "$gt": 80 }, "grade": "B" } } }
    ```

- **$size**
  - `{ "field": { "$size": <number> } }`
  - Example: `{ "hobbies": { "$size": 3 } }`

### Evaluation Operators

- **$regex**
  - `{ "field": { "$regex": "<pattern>", "$options": "<options>" } }`
  - Example: `{ "name": { "$regex": "^M", "$options": "i" } }`

- **$expr**
  - `{ "$expr": { <expression> } }`
  - Example: `{ "$expr": { "$gt": ["$qty", "$minQty"] } }`

### Geospatial Operators

- **$geoWithin**
  - Selects geometries within a bounding GeoJSON geometry.

- **$geoIntersects**
  - Selects geometries that intersect with a GeoJSON geometry.

- **$near**
  - Returns geospatial objects in proximity to a point.

- **$nearSphere**
  - Similar to `$near` but for spherical geometry.
