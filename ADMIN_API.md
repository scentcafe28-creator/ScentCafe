# ScentCafe Admin API Documentation

## Overview

The ScentCafe Admin API provides endpoints for managing customer requests, updating ticket statuses, and viewing all submissions. All admin endpoints require:

1. **Authentication**: A valid session token from an admin user
2. **Authorization**: The authenticated user must have `role: "admin"`

## Admin Credentials

**Demo Admin Account:**
- Email: `admin@scentcafe.com`
- Password: `admin123`

---

## Authentication

### Login (Admin)

**Endpoint:** `POST /api/login`

**Request:**
```json
{
  "email": "admin@scentcafe.com",
  "password": "admin123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "admin-user",
    "firstName": "ScentCafe",
    "lastName": "Admin",
    "name": "ScentCafe Admin",
    "email": "admin@scentcafe.com",
    "role": "admin"
  },
  "token": "hex_string_token_here"
}
```

**Usage:**
- Store the `token` value
- Include it in the `Authorization` header for all subsequent admin requests:
  ```
  Authorization: Bearer <token>
  ```

---

## Admin Endpoints

### 1. Get All Requests

Retrieve all customer requests in the system.

**Endpoint:** `GET /api/admin/requests`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "requests": [
    {
      "number": "SC-2026-0001",
      "name": "John Doe",
      "phone": "+27123456789",
      "request": "I need assistance with SASSA application.",
      "service": "SASSA Assistance",
      "status": "Received",
      "date": "2026-10-07T19:45:30.123Z",
      "userEmail": "customer@example.com"
    },
    {
      "number": "SC-2026-0002",
      "name": "Jane Smith",
      "phone": "+27987654321",
      "request": "Help with CV creation",
      "service": "CV Creation",
      "status": "In Progress",
      "date": "2026-10-07T20:15:45.789Z",
      "userEmail": "jane@example.com"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (user is not admin)

---

### 2. Update Request Status

Update the status of a customer request.

**Endpoint:** `PATCH /api/admin/requests/:number`

**Parameters:**
- `:number` - Ticket number (e.g., `SC-2026-0001`)

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "In Progress"
}
```

**Valid Statuses:**
- `Received` - Initial status when request is submitted
- `In Progress` - Request is being handled
- `Awaiting Customer` - Awaiting customer response/information
- `Completed` - Request is resolved

**Response (200):**
```json
{
  "ticket": {
    "number": "SC-2026-0001",
    "name": "John Doe",
    "phone": "+27123456789",
    "request": "I need assistance with SASSA application.",
    "service": "SASSA Assistance",
    "status": "In Progress",
    "date": "2026-10-07T19:45:30.123Z",
    "userEmail": "customer@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "message": "A valid status is required."
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid status
- `401` - Unauthorized
- `403` - Forbidden (not admin)
- `404` - Ticket not found

---

### 3. Delete Request

Remove a customer request from the system.

**Endpoint:** `DELETE /api/admin/requests/:number`

**Parameters:**
- `:number` - Ticket number (e.g., `SC-2026-0001`)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Ticket removed successfully.",
  "ticket": {
    "number": "SC-2026-0001",
    "name": "John Doe",
    "phone": "+27123456789",
    "request": "I need assistance with SASSA application.",
    "service": "SASSA Assistance",
    "status": "Received",
    "date": "2026-10-07T19:45:30.123Z",
    "userEmail": "customer@example.com"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Forbidden (not admin)
- `404` - Ticket not found

---

## Example: Complete Admin Workflow

### Step 1: Admin Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@scentcafe.com",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "admin-user",
    "firstName": "ScentCafe",
    "lastName": "Admin",
    "name": "ScentCafe Admin",
    "email": "admin@scentcafe.com",
    "role": "admin"
  },
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

### Step 2: Get All Requests

```bash
curl -X GET http://localhost:3000/api/admin/requests \
  -H "Authorization: Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

### Step 3: Update a Request Status

```bash
curl -X PATCH http://localhost:3000/api/admin/requests/SC-2026-0001 \
  -H "Authorization: Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress"
  }'
```

### Step 4: Delete a Request

```bash
curl -X DELETE http://localhost:3000/api/admin/requests/SC-2026-0001 \
  -H "Authorization: Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
```

---

## Security Notes

- **Admin Token**: Treat the session token like a password. Store it securely (e.g., in secure HTTP-only cookies or secure storage).
- **Role-Based Access**: Only users with `role: "admin"` can access admin endpoints.
- **Password Requirements**: Admin passwords must be at least 6 characters long.
- **Email Validation**: Emails are validated and normalized to lowercase.

---

## Error Handling

All endpoints return consistent error responses:

**401 Unauthorized:**
```json
{
  "message": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "message": "Admin access required."
}
```

**404 Not Found:**
```json
{
  "message": "Ticket not found."
}
```

**400 Bad Request:**
```json
{
  "message": "A valid status is required."
}
```

---

## Implementation Tips

### For cURL (Command Line)
Use the examples above to test endpoints directly from the terminal.

### For JavaScript/Node.js
```javascript
const token = 'your_admin_token_here';

// Get all requests
fetch('http://localhost:3000/api/admin/requests', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data.requests));

// Update status
fetch('http://localhost:3000/api/admin/requests/SC-2026-0001', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ status: 'In Progress' })
})
.then(res => res.json())
.then(data => console.log(data.ticket));
```

### For Python
```python
import requests

token = 'your_admin_token_here'
headers = {'Authorization': f'Bearer {token}'}

# Get all requests
response = requests.get('http://localhost:3000/api/admin/requests', headers=headers)
print(response.json())

# Update status
response = requests.patch(
  'http://localhost:3000/api/admin/requests/SC-2026-0001',
  headers={**headers, 'Content-Type': 'application/json'},
  json={'status': 'In Progress'}
)
print(response.json())
```

---

## Next Steps

- Build an admin dashboard UI that consumes these endpoints
- Implement webhooks to notify customers of status updates
- Add analytics and reporting endpoints
- Integrate email notifications for ticket status changes
