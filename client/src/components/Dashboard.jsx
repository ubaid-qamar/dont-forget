import React, { useState, useMemo } from 'react';
import { FiBell, FiUser, FiClipboard, FiCalendar, FiClock, FiAlertTriangle, FiRefreshCw, FiAlertOctagon, FiSearch, FiFileText } from 'react-icons/fi';
import TaskCard from './TaskCard';
import './Dashboard.css';

const Dashboard = ({ tasks, setTasks, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  }), [tasks, searchTerm, filterPriority]);

  const handleEditTask = (task) => {
    console.log('Edit task:', task);
    // Implement edit functionality
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleViewTask = (task) => {
    console.log('View task:', task);
    // Implement view functionality
  };

  const getTaskCounts = () => {
    return {
      total: tasks.length,
      dueToday: tasks.filter(t => t.priority === 'low').length,
      followUp: tasks.filter(t => t.priority === 'medium').length,
      late: tasks.filter(t => t.priority === 'high').length,
      highPriority: tasks.filter(t => t.priority === 'urgent').length,
      upcoming: tasks.filter(t => t.priority === 'upcoming').length
    };
  };

  const counts = getTaskCounts();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome, Admin</h1>
            <p className="welcome-date">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="header-actions">
            <button className="notification-btn" title="Notifications">
              <FiBell />
            </button>
            <button className="profile-btn" title="Profile">
              <FiUser />
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-header">
          <div className="section-title">
            <span className="title-icon"><FiClipboard /></span>
            <h2>Review Your Dashboard</h2>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card due-today">
            <div className="stat-icon"><FiCalendar /></div>
            <div className="stat-content">
              <div className="stat-number">{counts.dueToday}</div>
              <div className="stat-label">Due Today</div>
            </div>
          </div>
          <div className="stat-card follow-up">
            <div className="stat-icon"><FiClock /></div>
            <div className="stat-content">
              <div className="stat-number">{counts.followUp}</div>
              <div className="stat-label">Follow Up</div>
            </div>
          </div>
          <div className="stat-card late">
            <div className="stat-icon"><FiAlertTriangle /></div>
            <div className="stat-content">
              <div className="stat-number">{counts.late}</div>
              <div className="stat-label">Late</div>
            </div>
          </div>
          <div className="stat-card upcoming">
            <div className="stat-icon"><FiRefreshCw /></div>
            <div className="stat-content">
              <div className="stat-number">{counts.upcoming}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
          <div className="stat-card high-priority">
            <div className="stat-icon"><FiAlertOctagon /></div>
            <div className="stat-content">
              <div className="stat-number">{counts.highPriority}</div>
              <div className="stat-label">High Priority</div>
            </div>
          </div>
        </div>


        <div className="tasks-section">
          <div className="tasks-header">
            <h3>Tasks List</h3>
            <div className="tasks-controls">
              <div className="search-box">
                <span className="search-icon"><FiSearch /></span>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Priorities</option>
                <option value="low">Due Today</option>
                <option value="medium">Follow Up</option>
                <option value="high">Late</option>
                <option value="upcoming">Upcoming</option>
                <option value="urgent">High Priority</option>
              </select>
              <button className="primary-btn" onClick={() => onNavigate && onNavigate('follow-up')}>
                Follow-ups
              </button>
            </div>
          </div>

          <div className="tasks-grid">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onView={handleViewTask}
              />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="no-tasks">
              <div className="no-tasks-icon"><FiFileText /></div>
              <h3>No tasks found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
