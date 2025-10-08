const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');

class TaskService {
  static async createTask(taskData) {
    const { title, description, assignedTo, dueDate } = taskData;

    // Check if assigned user exists
    const user = await User.findById(assignedTo);
    if (!user) {
      throw new Error('Assigned user not found');
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      dueDate
    });

    await task.save();
    return task;
  }

  static async getTasks(filters, user) {
    const { status, assignedTo, page = 1, limit = 10 } = filters;
    const query = {};

    // If user is employee, only show their tasks
    if (user.role === 'employee') {
      query.assignedTo = user.id;
    }

    if (status) {
      query.status = status;
    }

    if (assignedTo && user.role === 'admin') {
      query.assignedTo = assignedTo;
    }

    const skip = (page - 1) * limit;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    return {
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async updateTask(taskId, updateData, user) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid task ID');
    }

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Check permissions
    if (user.role === 'employee' && task.assignedTo.toString() !== user.id) {
      throw new Error('Access denied');
    }

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    return updatedTask;
  }

  static async deleteTask(taskId, user) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid task ID');
    }

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    // Check permissions (only admin can delete)
    if (user.role !== 'admin') {
      throw new Error('Access denied');
    }

    await Task.findByIdAndDelete(taskId);
    return true;
  }

  static async getEmployees() {
    return await User.find({ role: 'employee' });
  }
}

module.exports = TaskService;

