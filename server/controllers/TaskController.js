const { body, validationResult } = require('express-validator');
const TaskService = require('../services/TaskService');

class TaskController {
  static async createTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, assignedTo, dueDate } = req.body;
      const task = await TaskService.createTask({ title, description, assignedTo, dueDate });

      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getTasks(req, res) {
    try {
      const { status, assignedTo, page, limit } = req.query;
      const filters = { status, assignedTo, page, limit };
      
      const result = await TaskService.getTasks(filters, req.user);
      res.json(result);
    } catch (error) {
      console.error('Get tasks error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async updateTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const taskId = req.params.id;
      const { title, description, dueDate, status } = req.body;
      
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (status !== undefined) updateData.status = status;

      const task = await TaskService.updateTask(taskId, updateData, req.user);
      res.json(task);
    } catch (error) {
      console.error('Update task error:', error);
      const statusCode = error.message === 'Task not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const taskId = req.params.id;
      const deleted = await TaskService.deleteTask(taskId, req.user);
      
      if (deleted) {
        res.json({ message: 'Task deleted successfully' });
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      console.error('Delete task error:', error);
      const statusCode = error.message === 'Task not found' ? 404 : 
                        error.message === 'Access denied' ? 403 : 400;
      res.status(statusCode).json({ error: error.message });
    }
  }

  static async getEmployees(req, res) {
    try {
      const employees = await TaskService.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error('Get employees error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = TaskController;

