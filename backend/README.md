# Alumni Connect - Backend API

Backend REST API for the Alumni Connect platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Separate collections for Alumni and Students
- **Posts & Feed**: Create, like, comment, and share posts
- **Events Management**: Create and manage events with registration
- **Opportunities**: Job and internship postings
- **Real-time Messaging**: Direct messaging between users
- **Notifications**: Real-time notification system
- **File Uploads**: Image upload support via Cloudinary
- **Security**: Helmet, CORS, rate limiting, input validation

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Socket.io** - Real-time communication

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema (Alumni & Student)
│   │   ├── Post.js              # Post schema
│   │   ├── Event.js             # Event schema
│   │   ├── Opportunity.js       # Job/Internship schema
│   │   ├── Message.js           # Message schema
│   │   ├── Conversation.js      # Conversation schema
│   │   └── Notification.js      # Notification schema
│   ├── routes/
│   │   └── authRoutes.js        # Authentication routes
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   └── server.js                # Express app setup
├── .env                         # Environment variables
├── .env.example                 # Environment variables template
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for image uploads)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
DB_NAME=ALUMNI-CONNECT

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

3. Start the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:5000`

### Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (student/alumni)
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `PUT /api/auth/update-password` - Update password (authenticated)

### Users (Coming Soon)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/connect/:id` - Send connection request

### Posts (Coming Soon)
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Events (Coming Soon)
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `POST /api/events/:id/register` - Register for event

### Opportunities (Coming Soon)
- `GET /api/opportunities` - Get all opportunities
- `POST /api/opportunities` - Create opportunity
- `GET /api/opportunities/:id` - Get opportunity by ID
- `POST /api/opportunities/:id/apply` - Apply for opportunity

### Messages (Coming Soon)
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/:conversationId` - Get messages in conversation
- `POST /api/messages` - Send new message

### Notifications (Coming Soon)
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## Database Collections

The MongoDB database (`ALUMNI-CONNECT`) uses the following collections:

- **Alumni Data** - Alumni user profiles
- **Student Data** - Student user profiles
- **posts** - User posts and job postings
- **events** - Events and workshops
- **opportunities** - Job and internship listings
- **messages** - Direct messages
- **conversations** - Message conversations
- **notifications** - User notifications

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": []
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Request rate limiting
- CORS configuration
- Helmet.js security headers
- Input validation and sanitization
- Protected routes with middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Contact

ACE BIT Sindri
- Email: ace@bitsindri.ac.in
- Website: https://www.bitsindri.ac.in

---

Developed by the ACE Team, BIT Sindri
