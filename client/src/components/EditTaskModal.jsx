import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import './EditTaskModal.css';

const EditTaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    invitee: '',
    taskType: 'Regular',
    platform: 'Zoom',
    meetingLink: '',
    dateTime: '',
    keyPoints: '',
    repeat: 'None',
    repeatDays: [],
    repeatMonths: [],
    yearlyDates: [],
    priority: 'Medium',
    tags: '',
    followUpLink: '',
    redirectUrl: '',
    bookingLimit: '',
    reminder: '15 minutes',
    status: 'pending'
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.name || '',
        invitee: task.invitee || '',
        taskType: task.taskType || 'Regular',
        platform: task.platform || 'Zoom',
        meetingLink: task.meetingLink || '',
        dateTime: task.dateTime || '',
        keyPoints: task.description || '',
        repeat: task.repeat || 'None',
        repeatDays: task.repeatDays || [],
        repeatMonths: task.repeatMonths || [],
        yearlyDates: task.yearlyDates || [],
        priority: task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium',
        tags: task.tags || '',
        followUpLink: task.followUpLink || '',
        redirectUrl: task.redirectUrl || '',
        bookingLimit: task.bookingLimit || '',
        reminder: task.reminder || '15 minutes',
        status: task.status || 'pending'
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedTask = {
      ...task,
      name: formData.title,
      description: formData.keyPoints || 'No description provided',
      dateTime: formData.dateTime,
      priority: formData.priority.toLowerCase().replace(' ', '-'),
      status: formData.status,
      repeat: formData.repeat,
      repeatDays: formData.repeatDays,
      repeatMonths: formData.repeatMonths,
      yearlyDates: formData.yearlyDates,
      invitee: formData.invitee,
      taskType: formData.taskType,
      platform: formData.platform,
      meetingLink: formData.meetingLink,
      tags: formData.tags,
      followUpLink: formData.followUpLink,
      redirectUrl: formData.redirectUrl,
      bookingLimit: formData.bookingLimit,
      reminder: formData.reminder
    };
    
    onSave(updatedTask);
  };

  if (!task) return null;

  const taskTypes = ['Regular', 'Video', 'Phone', 'Note'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];
  const statusOptions = ['pending', 'in-progress', 'completed', 'overdue'];
  const repeatOptions = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
  const reminderOptions = ['5 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours', '1 day'];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Task</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="edit-form-grid">
            {/* Title */}
            <div className="form-group full-width">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Invitee */}
            <div className="form-group">
              <label className="form-label">Invitee</label>
              <input
                type="text"
                name="invitee"
                value={formData.invitee}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Task Type */}
            <div className="form-group">
              <label className="form-label">Task Type</label>
              <select
                name="taskType"
                value={formData.taskType}
                onChange={handleChange}
                className="form-select"
              >
                {taskTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Date/Time */}
            <div className="form-group">
              <label className="form-label">Date & Time *</label>
              <input
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                {priorityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Repeat */}
            <div className="form-group">
              <label className="form-label">Repeat</label>
              <select
                name="repeat"
                value={formData.repeat}
                onChange={handleChange}
                className="form-select"
              >
                {repeatOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="Comma separated"
              />
            </div>

            {/* Reminder */}
            <div className="form-group">
              <label className="form-label">Reminder</label>
              <select
                name="reminder"
                value={formData.reminder}
                onChange={handleChange}
                className="form-select"
              >
                {reminderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Description/Key Points */}
            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="keyPoints"
                value={formData.keyPoints}
                onChange={handleChange}
                className="form-textarea"
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <FiSave /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
