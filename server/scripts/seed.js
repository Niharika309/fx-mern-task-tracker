require('dotenv').config();
const { connectDB } = require('../config/database');
const User = require('../models/User');
const Task = require('../models/Task');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await Task.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();

    // Create employee users
    const employee1 = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'emp123',
      role: 'employee'
    });
    await employee1.save();

    const employee2 = new User({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'emp123',
      role: 'employee'
    });
    await employee2.save();

    // Create sample tasks
    const tasks = [
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the new feature',
        assignedTo: employee1._id,
        dueDate: new Date('2024-02-15'),
        status: 'Pending'
      },
      {
        title: 'Fix login bug',
        description: 'Investigate and fix the login issue reported by users',
        assignedTo: employee1._id,
        dueDate: new Date('2024-02-10'),
        status: 'In Progress'
      },
      {
        title: 'Design new UI mockups',
        description: 'Create mockups for the dashboard redesign',
        assignedTo: employee2._id,
        dueDate: new Date('2024-02-20'),
        status: 'Pending'
      },
      {
        title: 'Code review for PR #123',
        description: 'Review the pull request for the authentication module',
        assignedTo: employee2._id,
        dueDate: new Date('2024-02-12'),
        status: 'Completed'
      }
    ];

    for (const taskData of tasks) {
      const task = new Task(taskData);
      await task.save();
    }

    console.log('Database seeded successfully!');
    console.log('\nTest accounts:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Employee 1: john@example.com / emp123');
    console.log('Employee 2: jane@example.com / emp123');
    console.log('\nSample tasks have been created for testing.');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();

