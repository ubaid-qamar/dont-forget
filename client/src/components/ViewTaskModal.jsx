import React from 'react';
import { FiX, FiCalendar, FiClock, FiUser, FiVideo, FiPhone, FiFileText, FiTag, FiLink, FiRepeat, FiBell } from 'react-icons/fi';
import './ViewTaskModal.css';

const ViewTaskModal = ({ task, onClose }) => {
  if (!task) return null;

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const { date, time } = formatDateTime(task.dateTime);

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#28A745',
      'medium': '#FFC107',
      'high': '#DC3545',
      'urgent': '#E83E8C'
    };
    return colors[priority] || '#28A745';
  };

  const getTaskTypeIcon = (type) => {
    switch(type) {
      case 'Video': return <FiVideo />;
      case 'Phone': return <FiPhone />;
      case 'Note': return <FiFileText />;
      default: return <FiFileText />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="view-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottomColor: getPriorityColor(task.priority) }}>
          <h2>Task Details</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="task-detail-section">
            <div className="detail-row">
              <div className="detail-label">
                <FiFileText className="detail-icon" />
                <span>Title</span>
              </div>
              <div className="detail-value title">{task.name}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <FiFileText className="detail-icon" />
                <span>Description</span>
              </div>
              <div className="detail-value description">
                {task.keyPoints && task.keyPoints.length > 0 ? (
                  <ul className="key-points-list">
                    {task.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{task.description}</p>
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <FiCalendar className="detail-icon" />
                <span>Date</span>
              </div>
              <div className="detail-value">{date}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <FiClock className="detail-icon" />
                <span>Time</span>
              </div>
              <div className="detail-value">{time}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                {getTaskTypeIcon(task.taskType)}
                <span>Task Type</span>
              </div>
              <div className="detail-value">{task.taskType || 'Regular'}</div>
            </div>

            <div className="detail-row">
              <div className="detail-label">
                <FiTag className="detail-icon" />
                <span>Priority</span>
              </div>
              <div className="detail-value">
                <span 
                  className="priority-badge" 
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority ? task.priority.toUpperCase() : 'MEDIUM'}
                </span>
              </div>
            </div>

            {task.invitee && (
              <div className="detail-row">
                <div className="detail-label">
                  <FiUser className="detail-icon" />
                  <span>Invitee</span>
                </div>
                <div className="detail-value">{task.invitee}</div>
              </div>
            )}

            {task.taskType === 'Video' && task.platform && (
              <div className="detail-row">
                <div className="detail-label">
                  <FiVideo className="detail-icon" />
                  <span>Platform</span>
                </div>
                <div className="detail-value">{task.platform}</div>
              </div>
            )}

            {task.meetingLink && (
              <div className="detail-row">
                <div className="detail-label">
                  <FiLink className="detail-icon" />
                  <span>Meeting Link</span>
                </div>
                <div className="detail-value">
                  <a href={task.meetingLink} target="_blank" rel="noopener noreferrer">
                    {task.meetingLink}
                  </a>
                </div>
              </div>
            )}

            {task.repeat && task.repeat !== 'None' && (
              <div className="detail-row">
                <div className="detail-label">
                  <FiRepeat className="detail-icon" />
                  <span>Repeat</span>
                </div>
                <div className="detail-value">{task.repeat}</div>
              </div>
            )}

            {task.tags && (
              <div className="detail-row">
                <div className="detail-label">
                  <FiTag className="detail-icon" />
                  <span>Tags</span>
                </div>
                <div className="detail-value">{task.tags}</div>
              </div>
            )}

            {task.reminder && (
              <div className="detail-row">
                <div className="detail-label">
                  <FiBell className="detail-icon" />
                  <span>Reminder</span>
                </div>
                <div className="detail-value">{task.reminder}</div>
              </div>
            )}

            <div className="detail-row">
              <div className="detail-label">
                <FiFileText className="detail-icon" />
                <span>Status</span>
              </div>
              <div className="detail-value">
                <span className={`status-badge-view ${task.status}`}>
                  {task.status ? task.status.charAt(0).toUpperCase() + task.status.slice(1) : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
