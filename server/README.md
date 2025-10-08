# Task Tracker Backend (MVC Architecture)

## Project Structure

```
server/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── AuthController.js    # Authentication logic
│   └── TaskController.js    # Task management logic
├── middleware/
│   └── auth.js             # Authentication middleware
├── models/
│   ├── User.js             # User data model
│   └── Task.js             # Task data model
├── routes/
│   ├── auth.js             # Authentication routes
│   └── tasks.js            # Task routes
├── services/
│   ├── AuthService.js      # Authentication business logic
│   └── TaskService.js      # Task business logic
├── scripts/
│   └── seed.js             # Database seeding script
├── app.js                  # Main application file
└── package.json
```

## MVC Architecture

### Models (Data Layer)
- **User.js**: Handles user data operations (CRUD)
- **Task.js**: Handles task data operations (CRUD)

### Views (Not applicable for API)
- This is a REST API, so no views are needed

### Controllers (Presentation Layer)
- **AuthController.js**: Handles authentication requests
- **TaskController.js**: Handles task management requests

### Services (Business Logic Layer)
- **AuthService.js**: Authentication business logic
- **TaskService.js**: Task management business logic

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tasks
- `POST /api/tasks` - Create task (admin only)
- `GET /api/tasks` - Get tasks with filters and pagination
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `GET /api/tasks/users` - Get employees (admin only)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `env.example`:
```bash
cp env.example .env
```

3. Update `.env` with your database credentials

4. Run database seeding:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

## Database Schema

### Users Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR(255), NOT NULL)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL)
- role (ENUM('admin', 'employee'), NOT NULL)
- createdAt (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### Tasks Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- title (VARCHAR(255), NOT NULL)
- description (TEXT, NOT NULL)
- assignedTo (INT, NOT NULL, FOREIGN KEY)
- dueDate (DATE, NOT NULL)
- status (ENUM('Pending', 'In Progress', 'Completed'), DEFAULT 'Pending')
- createdAt (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- updatedAt (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

