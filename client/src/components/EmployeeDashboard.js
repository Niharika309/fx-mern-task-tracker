import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchTasks();
  }, [filters]);

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

  const updateTaskStatus = async (taskId, status) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (error) {
      setError('Failed to update task status');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ffc107';
      case 'In Progress': return '#17a2b8';
      case 'Completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '#dc3545'; // Overdue
    if (diffDays <= 1) return '#fd7e14'; // Due today/tomorrow
    if (diffDays <= 3) return '#ffc107'; // Due soon
    return '#28a745'; // Not urgent
  };

  return (
    <div className="employee-dashboard">
      <header className="dashboard-header">
        <h1>My Tasks</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p className="stat-number">{pagination.total || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p className="stat-number">{tasks.filter(t => t.status === 'Pending').length}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p className="stat-number">{tasks.filter(t => t.status === 'In Progress').length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">{tasks.filter(t => t.status === 'Completed').length}</p>
          </div>
        </div>

        <div className="filters-section">
          <h3>Filter Tasks</h3>
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
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading your tasks...</div>
        ) : (
          <div className="tasks-section">
            <h3>Your Tasks</h3>
            {tasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks found. You're all caught up! 🎉</p>
              </div>
            ) : (
              <div className="tasks-list">
                {tasks.map(task => (
                  <div key={task._id} className="task-card">
                    <div className="task-header">
                      <h4>{task.title}</h4>
                      <div className="task-status">
                        <select 
                          value={task.status} 
                          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                          className="status-select"
                          style={{ 
                            backgroundColor: getStatusColor(task.status),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                    
                    <p className="task-description">{task.description}</p>
                    
                    <div className="task-meta">
                      <div className="meta-item">
                        <strong>Due Date:</strong>
                        <span 
                          style={{ 
                            color: getPriorityColor(task.dueDate),
                            fontWeight: 'bold'
                          }}
                        >
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="meta-item">
                        <strong>Status:</strong>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(task.status) }}
                        >
                          {task.status}
                        </span>
                      </div>
                      
                      <div className="meta-item">
                        <strong>Created:</strong>
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="pagination">
            <button 
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button 
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;





