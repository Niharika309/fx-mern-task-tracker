# Task Tracker - MERN Stack Application

A full-stack task management application built with MongoDB, Express.js, React, and Node.js. This application allows admins to create employees and assign tasks, while employees can view and update their task status.

## 🚀 Features

### Backend (API)
- **Authentication**: JWT-based authentication with role-based access control
- **User Management**: Create and manage admin and employee accounts
- **Task Management**: Full CRUD operations for tasks with filtering and pagination
- **Security**: Password hashing, input validation, and access control

### Frontend (React)
- **Login/Register**: Secure authentication with form validation
- **Admin Dashboard**: 
  - Create and manage employees
  - Create, view, update, and delete tasks
  - Filter tasks by status and assignee
  - Pagination support
- **Employee Dashboard**:
  - View assigned tasks
  - Update task status
  - Filter tasks by status
  - Task statistics

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fx-mern-task-tracker
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/task_tracker
# JWT_SECRET=your_jwt_secret_key_here
# PORT=5000

# Start MongoDB (if not already running)
# On macOS with Homebrew:
brew services start mongodb-community

# On Ubuntu/Debian:
sudo systemctl start mongod

# On Windows:
# Start MongoDB service from Services

# Seed the database with sample data
npm run seed

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to client directory (in a new terminal)
cd client

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'employee']),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  title: String (required),
  description: String (required),
  assignedTo: ObjectId (ref: User),
  dueDate: Date (required),
  status: String (enum: ['Pending', 'In Progress', 'Completed']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Tasks
- `POST /api/tasks` - Create task (admin only)
- `GET /api/tasks` - Get tasks with filtering and pagination
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `GET /api/tasks/users` - Get all employees (admin only)

## 👥 Demo Accounts

The seed script creates the following test accounts:

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Employee Accounts:**
- Email: john@example.com
- Password: emp123
- Email: jane@example.com
- Password: emp123

## 🎯 Usage

### For Admins:
1. Login with admin credentials
2. Navigate to "Employees" tab to add new employees
3. Navigate to "Tasks" tab to:
   - View all tasks
   - Create new tasks
   - Filter tasks by status and assignee
   - Update or delete tasks

### For Employees:
1. Login with employee credentials
2. View your assigned tasks
3. Update task status (Pending → In Progress → Completed)
4. Filter tasks by status

## 🧪 Testing the API

You can test the API endpoints using tools like Postman or curl:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "admin123"}'

# Get tasks (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

## 📁 Project Structure

```
fx-mern-task-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── ...
│   └── package.json
├── server/                # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── scripts/          # Utility scripts
│   └── app.js           # Main server file
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Server (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_tracker
JWT_SECRET=your_jwt_secret_key_here
```

**Client (env.example):**
```
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a cloud MongoDB service
2. Update MONGODB_URI in production environment
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **Port Already in Use:**
   - Change PORT in .env file
   - Kill existing processes using the port

3. **CORS Issues:**
   - Ensure backend is running on correct port
   - Check proxy configuration in client/package.json

4. **Authentication Issues:**
   - Clear browser localStorage
   - Check JWT_SECRET in .env file

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Happy Coding! 🎉**





