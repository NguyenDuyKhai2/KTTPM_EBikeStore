# E-Bike Login API Documentation

## Overview
Comprehensive login API system supporting multiple user roles: Customer, Staff, Manager, and Admin. The system uses JWT (JSON Web Tokens) for secure authentication and role-based access control.

## Authentication Endpoints

### Base URL
```
http://localhost:8080/api/v1/auth
```

### 1. Register User
**Endpoint:** `POST /register`

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "token": "demo-token-uuid",
  "roles": ["CUSTOMER"]
}
```

**Errors:**
- `400 Bad Request` - Missing required fields or password < 6 characters
- `409 Conflict` - Username or email already exists

---

### 2. Basic Login
**Endpoint:** `POST /login`

**Request:**
```json
{
  "usernameOrEmail": "johndoe",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "token": "demo-token-uuid",
  "roles": ["CUSTOMER"]
}
```

---

### 3. Enhanced Login (with JWT)
**Endpoint:** `POST /login/enhanced`

Returns JWT token with expiration time and additional metadata.

**Request:**
```json
{
  "usernameOrEmail": "johndoe",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "roles": ["CUSTOMER"],
  "active": true,
  "verified": false,
  "issuedAt": "2026-03-25T10:30:00",
  "expiresAt": "2026-03-26T10:30:00"
}
```

**Error Responses:**
- `400 Bad Request` - Missing credentials
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - User is inactive
- `404 Not Found` - User not found

---

### 4. Customer Login
**Endpoint:** `POST /login/customer`

Returns role-specific data including customer information.

**Request:**
```json
{
  "usernameOrEmail": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "role": "CUSTOMER",
  "roleData": {
    "role": "CUSTOMER",
    "userId": 1,
    "permissions": ["READ_PROFILE", "VIEW_ORDERS", "CREATE_ORDER"],
    "type": "Individual Customer",
    "memberSince": "2026-03-20T08:15:30"
  },
  "authResponse": {
    "userId": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "roles": ["CUSTOMER"],
    "active": true,
    "verified": false,
    "issuedAt": "2026-03-25T10:30:00",
    "expiresAt": "2026-03-26T10:30:00"
  }
}
```

---

### 5. Staff Login
**Endpoint:** `POST /login/staff`

Returns staff-specific data including department information.

**Request:**
```json
{
  "usernameOrEmail": "staff_user",
  "password": "StaffPassword123"
}
```

**Response (200 OK):**
```json
{
  "role": "STAFF",
  "roleData": {
    "role": "STAFF",
    "userId": 2,
    "permissions": ["READ_PROFILE", "VIEW_ORDERS", "UPDATE_ORDERS", "CREATE_SUPPORT_TICKET"],
    "type": "Store Staff",
    "department": "Sales/Support"
  },
  "authResponse": {
    "userId": 2,
    "username": "staff_user",
    "email": "staff@example.com",
    "fullName": "Staff Member",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "roles": ["STAFF"],
    "active": true,
    "verified": true,
    "issuedAt": "2026-03-25T10:30:00",
    "expiresAt": "2026-03-26T10:30:00"
  }
}
```

---

### 6. Manager Login
**Endpoint:** `POST /login/manager`

Returns manager-specific data with enhanced permissions.

**Request:**
```json
{
  "usernameOrEmail": "manager_user",
  "password": "ManagerPassword123"
}
```

**Response (200 OK):**
```json
{
  "role": "MANAGER",
  "roleData": {
    "role": "MANAGER",
    "userId": 3,
    "permissions": ["FULL_ORDER_MANAGEMENT", "STAFF_MANAGEMENT", "REPORT_VIEWING", "DISCOUNT_APPROVAL"],
    "type": "Store Manager",
    "authority": "Full Store Management"
  },
  "authResponse": {
    "userId": 3,
    "username": "manager_user",
    "email": "manager@example.com",
    "fullName": "Manager Name",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "roles": ["MANAGER"],
    "active": true,
    "verified": true,
    "issuedAt": "2026-03-25T10:30:00",
    "expiresAt": "2026-03-26T10:30:00"
  }
}
```

---

### 7. Admin Login
**Endpoint:** `POST /login/admin`

Returns admin-specific data with system-wide permissions.

**Request:**
```json
{
  "usernameOrEmail": "admin_user",
  "password": "AdminPassword123"
}
```

**Response (200 OK):**
```json
{
  "role": "ADMIN",
  "roleData": {
    "role": "ADMIN",
    "userId": 4,
    "permissions": ["SYSTEM_ADMIN", "USER_MANAGEMENT", "ROLE_MANAGEMENT", "AUDIT_LOG_ACCESS", "SYSTEM_SETTINGS"],
    "type": "System Administrator",
    "authority": "System-wide Management"
  },
  "authResponse": {
    "userId": 4,
    "username": "admin_user",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "roles": ["ADMIN"],
    "active": true,
    "verified": true,
    "issuedAt": "2026-03-25T10:30:00",
    "expiresAt": "2026-03-26T10:30:00"
  }
}
```

---

## Utility Endpoints

### Get User Profile
**Endpoint:** `GET /profile?usernameOrEmail=john@example.com`

**Response (200 OK):**
```json
{
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "active": true,
  "verified": false,
  "roles": ["CUSTOMER"],
  "permissions": ["READ_PROFILE", "VIEW_ORDERS", "CREATE_ORDER"]
}
```

---

### Verify Token
**Endpoint:** `GET /verify-token`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
true
```

---

### Extract Username from Token
**Endpoint:** `GET /user-from-token`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
"johndoe"
```

---

## JWT Token Structure

The JWT token contains the following claims:

```json
{
  "sub": "johndoe",           // Username
  "userId": 1,                // User ID
  "email": "john@example.com",// Email
  "roles": "CUSTOMER",        // Comma-separated roles
  "fullName": "John Doe",     // Full name
  "iat": 1711353000,          // Issued at
  "exp": 1711439400           // Expiration time
}
```

---

## Authentication

All protected endpoints require the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Role-Based Access Control

| Endpoint | CUSTOMER | STAFF | MANAGER | ADMIN |
|----------|----------|-------|---------|-------|
| `/api/v1/customer/**` | ✓ | ✓ | ✓ | ✓ |
| `/api/v1/staff/**` | ✗ | ✓ | ✓ | ✓ |
| `/api/v1/manager/**` | ✗ | ✗ | ✓ | ✓ |
| `/api/v1/admin/**` | ✗ | ✗ | ✗ | ✓ |

---

## Configuration

Update the following properties in `application.properties`:

```properties
# JWT Secret (change this to a secure random value in production)
jwt.secret=your-super-secret-jwt-key-change-this-in-production-with-a-secure-random-key-at-least-32-characters

# JWT Expiration time in milliseconds (default: 24 hours = 86400000)
jwt.expiration=86400000
```

---

## Implementation Details

### Files Created/Updated

1. **JwtTokenProvider.java** - JWT token generation and validation
2. **JwtAuthenticationFilter.java** - JWT authentication filter for Spring Security
3. **EnhancedAuthResponse.java** - Enhanced response DTO with JWT details
4. **RoleSpecificLoginResponse.java** - Role-specific login response
5. **ErrorResponse.java** - Error response DTO
6. **SecurityConfiguration.java** - Updated Spring Security configuration
7. **AuthenticationService.java** - Interface with new methods
8. **AuthenticationServiceImpl.java** - Implementation with JWT support
9. **AuthController.java** - Updated controller with new endpoints

### Key Features

- ✓ JWT token generation and validation
- ✓ Role-based login endpoints
- ✓ Secure password encoding (BCrypt)
- ✓ Authentication logging
- ✓ Token expiration handling
- ✓ Stateless session management
- ✓ Method-level security annotations support

---

## Error Handling

Standard HTTP status codes are used:

- `200 OK` - Successful authentication
- `201 Created` - User created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Invalid credentials
- `403 Forbidden` - User inactive or insufficient permissions
- `404 Not Found` - User not found
- `409 Conflict` - Resource already exists

---

## Security Recommendations

1. Change the JWT secret key in production
2. Use HTTPS/TLS for all API endpoints
3. Implement token refresh mechanism
4. Add rate limiting for login attempts
5. Enable CORS appropriately for frontend applications
6. Monitor authentication logs for suspicious activity
7. Use strong passwords (minimum 8 characters recommended)

---

## Usage Examples

### cURL Examples

#### Register
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Customer Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login/customer \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "john@example.com",
    "password": "SecurePassword123"
  }'
```

#### Access Protected Resource
```bash
curl -X GET http://localhost:8080/api/v1/auth/verify-token \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Next Steps

1. Set up test user data in your database for each role
2. Integrate this authentication system with your frontend applications
3. Implement token refresh mechanism if tokens expire frequently
4. Add additional logging and monitoring
5. Perform security testing and vulnerability assessment
