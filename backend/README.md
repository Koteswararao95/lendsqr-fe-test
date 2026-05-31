# Lendsqr Backend API

Backend API for the Lendsqr Frontend Assessment with complete user management and authentication.

## 🚀 Quick Start

### Installation
```bash
cd backend
npm install
```

### Setup Environment
```bash
cp .env.example .env
```

### Run Development Server
```bash
npm run dev
```

Server starts at: `http://localhost:5000`

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with credentials |
| POST | `/api/auth/logout` | Logout user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (paginated) |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user status |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

---

## 🔐 Demo Credentials
- **Email:** `demo@lendsqr.com`
- **Password:** `password123`

---

## 📊 Query Parameters

### Users Endpoint
- `page` (default: 1) - Page number for pagination
- `limit` (default: 10) - Items per page
- `search` - Search by username, email, or phone
- `status` - Filter by status (Active, Inactive, Pending, Blacklisted)

**Example:**
```
GET /api/users?page=1&limit=10&search=Ahmed&status=Active
```

---

## 🔌 Authentication

All endpoints except `/health` and login require JWT token.

**Headers:**
```
Authorization: Bearer <token>
```

---

## 📦 Postman Collection

Import the Postman collection: `postman-collection.json`

Environment variables available:
- `base_url` - API base URL (default: http://localhost:5000)
- `token` - JWT token (auto-set after login)
- `email` - User email (auto-set after login)

---

## 🗄️ Mock Data

The API includes 500 pre-generated mock users with realistic data:
- Random names, emails, phone numbers
- Statuses: Active, Inactive, Pending, Blacklisted
- Organizations and loan information
- Activity timestamps

---

## 🧪 Testing

1. Start the server: `npm run dev`
2. Open Postman
3. Import `postman-collection.json`
4. Run Login request first (auto-sets token)
5. Test other endpoints

---

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🚀 Deployment

### Option 1: Render (Recommended)
1. Push to GitHub
2. Connect Render to GitHub
3. Set environment: `PORT=5000`
4. Deploy

### Option 2: Railway
1. Push to GitHub
2. Create new project on Railway
3. Connect GitHub repo
4. Auto-deploy

### Option 3: Heroku
```bash
heroku create your-app-name
git push heroku main
```

---

## 📝 Notes

- All user data is in-memory (resets on server restart)
- JWT tokens expire after 24 hours
- CORS enabled for frontend integration
