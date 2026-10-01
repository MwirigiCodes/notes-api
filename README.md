# Notes API

A secure, production-ready RESTful API for managing personal notes with user authentication and authorization. Built with Express.js and MongoDB, featuring JWT-based authentication, rate limiting, input validation, and comprehensive security measures.

## Table of Contents

- [Features](#features)
- [Stack](#stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication Endpoints](#authentication-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Note Endpoints](#note-endpoints)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure signup and login with bcrypt password hashing
- **JWT Authorization**: Access and refresh token-based authentication with cookie storage
- **Note Management**: Full CRUD operations (Create, Read, Update, Delete) for user notes
- **Input Validation**: Comprehensive request validation using express-validator
- **Rate Limiting**: Built-in rate limiting to prevent API abuse (100 requests per 15 minutes)
- **Security Headers**: Helmet.js integration for secure HTTP headers
- **CORS Support**: Cross-Origin Resource Sharing configured for safe client requests
- **User Isolation**: Ensures users can only access their own notes and data
- **Strong Password Requirements**: Enforces secure passwords (min 8 chars, mixed case, numbers, symbols)
- **Database Persistence**: MongoDB for reliable data storage with automatic timestamps
- **Docker Ready**: Includes Dockerfile for containerized deployment

## Stack

- **Language**: JavaScript (Node.js)
- **Runtime**: Node.js 24 (Alpine Linux)
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB 9.9.5 (with Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken 9.0.3) + bcryptjs (3.0.3)
- **Validation**: express-validator 7.3.2
- **Security**: 
  - Helmet.js 8.3.0 (security headers)
  - express-rate-limit 8.7.0 (rate limiting)
  - CORS 2.8.6 (cross-origin requests)
- **Testing**: Vitest 5.0.1
- **Environment**: dotenv 17.4.2

## Project Structure

```
notes-api/
├── src/
│   ├── config/
│   │   └── db.js                  Database connection configuration
│   ├── controllers/
│   │   ├── auth.controller.js     Authentication logic (signup, login, logout, refresh)
│   │   ├── note.controller.js     Note CRUD operations
│   │   └── user.controller.js     User management operations
│   ├── middleware/
│   │   ├── protectRoutes.js       JWT authentication middleware
│   │   └── validations.js         Input validation rules using express-validator
│   ├── models/
│   │   ├── Note.js                Note schema and model
│   │   └── User.js                User schema and model
│   ├── routes/
│   │   ├── auth.route.js          Authentication endpoints
│   │   ├── note.route.js          Note management endpoints
│   │   └── user.route.js          User management endpoints
│   ├── utils/
│   │   ├── rateLimiter.js         Rate limiting configuration
│   │   └── tokens.js              JWT token generation and cookie handling
│   └── index.js                   Application entry point
├── package.json                   Project dependencies and scripts
├── Dockerfile                     Docker container configuration
├── .dockerignore                  Docker build exclusions
└── .gitignore                     Git exclusions

```

### How It Fits Together

When a request comes in, it flows through the Express middleware stack:

1. **Rate Limiter** (`rateLimiter.js`) - Limits requests to 100 per 15 minutes
2. **Body Parser** - Parses JSON payloads from requests
3. **Cookie Parser** - Extracts cookies from request headers
4. **Route Handler** - Directs to appropriate endpoint
5. **Authentication Middleware** (`protectRoutes.js`) - Validates JWT token for protected routes
6. **Validation Middleware** (`validations.js`) - Validates and sanitizes request data
7. **Controller** - Executes business logic and database operations
8. **Database** - Mongoose models interact with MongoDB
9. **Response** - Returns JSON response with status codes

For example, creating a note: `POST /api/notes` → Rate Limiter → Cookie Parser → Validation → `protectRoutes` middleware → `createNote` controller → `Note.create()` → MongoDB → Response.

## Prerequisites

Before running this application, ensure you have:

- **Node.js** (version 18.x or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **MongoDB** instance running locally or a MongoDB Atlas cloud database
- **Docker** (optional, for containerized deployment)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MwirigiCodes/notes-api.git
   cd notes-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Configuration](#configuration) section)

## Configuration

Create a `.env` file in the project root directory with the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/notes-api
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notes-api

# JWT Secrets (generate strong random strings)
ACCESS_TOKEN_SECRET=your_strong_access_token_secret_here_min_32_chars
REFRESH_TOKEN_SECRET=your_strong_refresh_token_secret_here_min_32_chars
```

**Important Security Notes:**
- Never commit `.env` files to version control
- Generate strong, random secrets (minimum 32 characters)
- Use different secrets for development and production
- For production, set `NODE_ENV=production` to enable secure cookies

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```
The server will start with file watching enabled. Any changes to files will automatically restart the server.

### Production Mode
```bash
npm start
```
Runs the application without file watching.

### Expected Output
```
MONGODB CONNECTED SUCCESSFULLY
Server started at http://localhost:3000
```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### **POST** `/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `firstName`: 2-50 characters, alphabetic only
- `lastName`: 2-50 characters, alphabetic only
- `email`: Valid email format
- `password`: Minimum 8 characters, must contain:
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character

**Response:** `201 Created`
```json
{
  "message": "Signed up successfully"
}
```

**Cookies Set:**
- `accessToken`: JWT token (expires in 15 minutes)
- `refreshToken`: JWT token (expires in 7 days)

---

#### **POST** `/auth/login`
Authenticate and log in an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "message": "Logged in successfully"
}
```

**Cookies Set:**
- `accessToken`: JWT token (expires in 15 minutes)
- `refreshToken`: JWT token (expires in 7 days)

---

#### **POST** `/auth/logout`
Log out the current user and clear authentication tokens.

**Response:** `200 OK`
```json
{
  "message": "Logged out successfully"
}
```

---

#### **POST** `/auth/refresh`
Refresh the access token using a valid refresh token.

**Response:** `200 OK`
```json
{
  "message": "Token refreshed successfully"
}
```

**Cookies Set:**
- `accessToken`: New JWT token (expires in 15 minutes)

---

### User Endpoints

**All user endpoints require authentication** (valid `accessToken` cookie)

#### **GET** `/users`
Retrieve all users (passwords excluded).

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "notes": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

#### **GET** `/users/:id`
Retrieve a specific user by ID.

**URL Parameters:**
- `id`: MongoDB user ID

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "notes": [],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

#### **PUT** `/users/:id`
Update user information.

**URL Parameters:**
- `id`: MongoDB user ID

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "User updated successfully"
}
```

---

#### **DELETE** `/users/:id`
Delete a user account.

**URL Parameters:**
- `id`: MongoDB user ID

**Response:** `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

### Note Endpoints

**All note endpoints require authentication** (valid `accessToken` cookie)

#### **GET** `/notes`
Retrieve all notes for the authenticated user.

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My First Note",
    "content": "This is the content of my first note",
    "creator": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

---

#### **GET** `/notes/:id`
Retrieve a specific note by ID (only if user is the creator).

**URL Parameters:**
- `id`: MongoDB note ID

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "My First Note",
  "content": "This is the content of my first note",
  "creator": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

#### **POST** `/notes`
Create a new note.

**Request Body:**
```json
{
  "title": "My New Note",
  "content": "This is the content of my new note"
}
```

**Validation Rules:**
- `title`: Required, non-empty, must be unique per user
- `content`: Required, non-empty

**Response:** `201 Created`
```json
{
  "message": "Note created successfully"
}
```

---

#### **PUT** `/notes/:id`
Update an existing note (only if user is the creator).

**URL Parameters:**
- `id`: MongoDB note ID

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "content": "Updated note content"
}
```

**Validation Rules:**
- `title`: Optional, must be unique per user if provided
- `content`: Optional

**Response:** `200 OK`
```json
{
  "message": "Note updated successfully"
}
```

---

#### **DELETE** `/notes/:id`
Delete a note (only if user is the creator).

**URL Parameters:**
- `id`: MongoDB note ID

**Response:** `200 OK`
```json
{
  "message": "Note deleted successfully"
}
```

---

## Security Features

### 1. **Password Security**
- Passwords hashed using bcryptjs with salt rounds of 10
- Strong password requirements enforced:
  - Minimum 8 characters
  - Mix of uppercase and lowercase letters
  - At least one number
  - At least one special character

### 2. **JWT Authentication**
- **Access Token**: 15-minute expiration for active sessions
- **Refresh Token**: 7-day expiration for session renewal
- Tokens stored in HTTP-only cookies to prevent XSS attacks
- `sameSite: 'strict'` prevents CSRF attacks
- Secure flag enabled in production for HTTPS-only transmission

### 3. **Input Validation & Sanitization**
- All user inputs validated using express-validator
- Email format validation and normalization
- String escaping to prevent XSS attacks
- MongoDB ID validation to prevent injection attacks

### 4. **Rate Limiting**
- 100 requests per IP address per 15-minute window
- Prevents brute force attacks and API abuse
- Returns `429 Too Many Requests` when limit exceeded

### 5. **HTTP Security Headers**
- Helmet.js integrated for security headers:
  - Content Security Policy (CSP)
  - X-Frame-Options (clickjacking prevention)
  - X-Content-Type-Options (MIME sniffing prevention)
  - Strict-Transport-Security (HTTPS enforcement)

### 6. **CORS Protection**
- Cross-Origin Resource Sharing configured safely
- Prevents unauthorized cross-origin requests

### 7. **User Isolation**
- Users can only access their own notes
- Database queries include user ID checks
- Authentication middleware on protected routes

## Error Handling

The API returns appropriate HTTP status codes and error messages:

| Status Code | Meaning | Example Response |
|---|---|---|
| `200` | OK | Successful request |
| `201` | Created | Resource successfully created |
| `400` | Bad Request | Invalid input or validation error |
| `401` | Unauthorized | Missing or invalid authentication token |
| `404` | Not Found | Resource not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error (check logs) |

**Example Error Response:**
```json
{
  "message": "Validation failed",
  "errors": [
    "First Name must be between 2 and 50 characters",
    "Please provide a valid email"
  ]
}
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t notes-api .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017/notes-api \
  -e ACCESS_TOKEN_SECRET=your_secret_here \
  -e REFRESH_TOKEN_SECRET=your_secret_here \
  notes-api
```

### Using Docker Compose
Create a `docker-compose.yml` file:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/notes-api
      - ACCESS_TOKEN_SECRET=your_secret_here
      - REFRESH_TOKEN_SECRET=your_secret_here
      - NODE_ENV=production
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run with:
```bash
docker-compose up
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/MwirigiCodes/notes-api/issues).

## Changelog

### Version 1.0.0
- Initial release
- User authentication with JWT
- Full CRUD operations for notes
- Rate limiting and security features
- Docker support
