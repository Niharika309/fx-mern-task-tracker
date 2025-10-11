import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });
  
  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    assignedTo: '',
    page: 1,
    limit: 10
  });
  
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (activeTab === 'tasks') {
      fetchTasks();
    } else if (activeTab === 'employees') {
      fetchEmployees();
    }
  }, [activeTab, filters]);

  // Load employees when component mounts to populate task assignment dropdown
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchEmployees();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`/api/tasks?${params}`);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/tasks/users');
      console.log('Employees fetched:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setError('Failed to fetch employees');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/tasks', taskForm);
      setTaskForm({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      setError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', employeeForm);
      setEmployeeForm({ name: '', email: '', password: '', role: 'employee' });
      fetchEmployees();
    } catch (error) {
      setError('Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (error) {
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        setError('Failed to delete task');
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'tasks' ? 'active' : ''}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={activeTab === 'employees' ? 'active' : ''}
          onClick={() => setActiveTab('employees')}
        >
          Employees
        </button>
      </nav>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'tasks' && (
        <div className="tasks-section">
          <div className="section-header">
            <h2>Task Management</h2>
            <button 
              className="add-btn"
              onClick={() => {
                console.log('Opening task modal, current employees:', employees);
                fetchEmployees(); // Refresh employees list
                document.getElementById('taskModal').style.display = 'block';
              }}
            >
              Add Task
            </button>
          </div>

          <div className="filters">
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            
            <select 
              value={filters.assignedTo} 
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <div className="tasks-list">
              {tasks.map(task => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <div className="task-actions">
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="status-select"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button 
                        onClick={() => deleteTask(task._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    <span><strong>Assigned to:</strong> {task.assignedTo?.name}</span>
                    <span><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</span>
                    <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="pagination">
              <button 
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              <span>Page {pagination.page} of {pagination.pages}</span>
              <button 
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'employees' && (
        <div className="employees-section">
          <div className="section-header">
            <h2>Employee Management</h2>
            <button 
              className="add-btn"
              onClick={() => document.getElementById('employeeModal').style.display = 'block'}
            >
              Add Employee
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : (
            <div className="employees-list">
              {employees.map(employee => (
                <div key={employee._id} className="employee-card">
                  <h3>{employee.name}</h3>
                  <p>{employee.email}</p>
                  <span className="role-badge">{employee.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Task Modal */}
      <div id="taskModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => document.getElementById('taskModal').style.display = 'none'}>&times;</span>
          <h3>Create New Task</h3>
          <form onSubmit={handleTaskSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Assign to</label>
              <select
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                required
              >
                <option value="">Select Employee</option>
                {employees.length === 0 ? (
                  <option value="" disabled>Loading employees...</option>
                ) : (
                  employees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                  ))
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                required
              />
            </div>
            <button type="submit" disabled={loading}>Create Task</button>
          </form>
        </div>
      </div>

      {/* Employee Modal */}
      <div id="employeeModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => document.getElementById('employeeModal').style.display = 'none'}>&times;</span>
          <h3>Add New Employee</h3>
          <form onSubmit={handleEmployeeSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={employeeForm.email}
                onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={employeeForm.password}
                onChange={(e) => setEmployeeForm({...employeeForm, password: e.target.value})}
                required
                minLength="6"
              />
            </div>
            <button type="submit" disabled={loading}>Add Employee</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



