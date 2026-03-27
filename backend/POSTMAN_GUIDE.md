# Postman Collection - E-Bike Login API

## File Information
- **Filename:** `E-Bike-Login-API.postman_collection.json`
- **Location:** Backend folder
- **Description:** Complete Postman collection for testing E-Bike Authentication API

## How to Import

### Method 1: Import via File
1. Open Postman
2. Click **Import** button (top-left corner)
3. Select **Choose Files**
4. Navigate to and select `E-Bike-Login-API.postman_collection.json`
5. Click **Import**

### Method 2: Import via Link (if hosted)
1. Click **Import** in Postman
2. Select **Link** tab
3. Paste the file URL
4. Click **Import**

## Environment Setup

The collection includes pre-configured environment variables:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:8080/api/v1` | API base URL |
| `jwt_token` | (empty) | Auto-populated JWT token |
| `customer_token` | (empty) | Customer JWT token |
| `staff_token` | (empty) | Staff JWT token |
| `manager_token` | (empty) | Manager JWT token |
| `admin_token` | (empty) | Admin JWT token |
| `username` | (empty) | Currently logged-in username |
| `userId` | (empty) | Currently logged-in user ID |

### Customize Base URL
If your API runs on a different port/URL:
1. Open the collection
2. Go to **Variables** tab
3. Change `base_url` to your API endpoint
4. Click **Save**

## Collection Structure

### 1. Authentication (3 endpoints)
- **Register User** - Create new user account
- **Basic Login** - Get basic auth token
- **Enhanced Login** - Get JWT token with expiration

### 2. Role-Specific Login (4 endpoints)
- **Customer Login** - Customer role login
- **Staff Login** - Staff role login
- **Manager Login** - Manager role login
- **Admin Login** - Admin role login

### 3. Token Operations (2 endpoints)
- **Verify Token** - Check if token is valid
- **Extract Username** - Get username from token

### 4. User Profile (2 endpoints)
- **Get User Profile** - Fetch user info by username
- **Get Profile by Email** - Fetch user info by email

### 5. Error Cases (5 endpoints)
- **Invalid Credentials** - Test with wrong password
- **User Not Found** - Test with non-existent user
- **Duplicate Email** - Test registration with existing email
- **Weak Password** - Test with password < 6 characters
- **Missing Fields** - Test with incomplete data

## Quick Start Testing Flow

### Step 1: Register a User
1. Open **Authentication → Register User**
2. Modify the request body with your test data:
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "TestPassword123",
     "firstName": "Test",
     "lastName": "User"
   }
   ```
3. Click **Send**
4. Should return 201 Created

### Step 2: Login with Enhanced JWT
1. Open **Authentication → Enhanced Login**
2. Update credentials in request body
3. Click **Send**
4. JWT token will be automatically saved to `jwt_token` variable

### Step 3: Test Role-Specific Login
1. Choose a role login (Customer, Staff, Manager, or Admin)
2. Update credentials if needed
3. Click **Send**
4. Token will be saved to role-specific variable

### Step 4: Verify Token
1. Open **Token Operations → Verify Token**
2. It will use the `jwt_token` variable in Authorization header
3. Click **Send**
4. Should return `true`

### Step 5: Get User Profile
1. Open **User Profile → Get User Profile**
2. Update the `usernameOrEmail` parameter if needed
3. Click **Send**
4. Retrieve user details

## Authentication

All protected endpoints use JWT Bearer token in Authorization header:
```
Authorization: Bearer {{jwt_token}}
```

The collection automatically:
- Extracts and saves tokens from login responses
- Applies tokens to protected endpoints
- Validates token expiration

## Test Data Templates

### Customer User
```json
{
  "username": "customer.user",
  "email": "customer@example.com",
  "password": "CustomerPass123"
}
```

### Staff User
```json
{
  "username": "staff.user",
  "email": "staff@example.com",
  "password": "StaffPassword123"
}
```

### Manager User
```json
{
  "username": "manager.user",
  "email": "manager@example.com",
  "password": "ManagerPassword123"
}
```

### Admin User
```json
{
  "username": "admin.user",
  "email": "admin@example.com",
  "password": "AdminPassword123"
}
```

## Response Examples

### Successful Enhanced Login
```json
{
  "userId": 1,
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "roles": ["CUSTOMER"],
  "active": true,
  "verified": false,
  "issuedAt": "2026-03-25T10:30:00",
  "expiresAt": "2026-03-26T10:30:00"
}
```

### Customer Login Response
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
  "authResponse": { ... }
}
```

## Error Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (Register) |
| 400 | Bad Request (invalid data) |
| 401 | Unauthorized (invalid credentials) |
| 403 | Forbidden (inactive user) |
| 404 | Not Found (user doesn't exist) |
| 409 | Conflict (email/username exists) |

## Test Scripts

The collection includes pre-request and test scripts that:
- Automatically save tokens to environment variables
- Validate responses
- Log test results to console
- Display token expiration times

### Access Test Results
1. Click **Send** on any request
2. View results in **Tests** tab at the bottom
3. Check console output for detailed logs

## Bulk Testing

### Test All Login Endpoints
1. Go to **Collections** → E-Bike Login API
2. Click the **▶️ Run** button
3. Select desired endpoints
4. Choose your environment
5. Click **Run**

This will execute all tests and show results in runner view.

## Troubleshooting

### Issue: "base_url is not defined"
**Solution:** Make sure the environment is selected in Postman

### Issue: 401 Unauthorized on protected endpoints
**Solution:** 
1. First run a login endpoint to get a token
2. Verify token is saved in environment variables
3. Check token hasn't expired

### Issue: 404 User Not Found
**Solution:** Register a user first or verify credentials are correct

### Issue: Cannot import collection
**Solution:**
1. Ensure file is saved locally
2. Check file format is valid JSON
3. Try importing via raw JSON in Postman

## Tips & Best Practices

✅ **Do:**
- Run Register endpoint before testing logins
- Save environment after token extraction
- Use role-specific logins for role-based testing
- Test error cases to validate error handling
- Check console for detailed logs

❌ **Don't:**
- Manually modify tokens
- Keep sensitive tokens in collection (use environment)
- Share collection with hardcoded credentials
- Run all tests from different API instances simultaneously

## Advanced Usage

### Create Multiple Test Users
Use Postman's **Run Collection** feature with different data sets

### Automated Testing
Export the collection to CI/CD pipeline using newman:
```bash
newman run E-Bike-Login-API.postman_collection.json \
  -e environment.json \
  --reporters cli,json
```

### Monitor API Performance
Use Postman's **Monitors** feature to run collection on schedule

## Support

For issues or questions:
1. Check the API documentation: `LOGIN_API_DOCUMENTATION.md`
2. Review server logs for detailed error messages
3. Verify all environment variables are set
4. Ensure server is running on correct port
