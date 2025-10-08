const express = require('express');
const { body } = require('express-validator');
const TaskController = require('../controllers/TaskController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Create task (admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('assignedTo').isMongoId().withMessage('Valid assigned user ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required')
], TaskController.createTask);

// Get tasks
router.get('/', authenticateToken, TaskController.getTasks);

// Update task
router.put('/:id', authenticateToken, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status')
], TaskController.updateTask);

// Delete task (admin only)
router.delete('/:id', authenticateToken, requireAdmin, TaskController.deleteTask);

// Get all users (for admin to assign tasks)
router.get('/users', authenticateToken, requireAdmin, TaskController.getEmployees);

module.exports = router;
