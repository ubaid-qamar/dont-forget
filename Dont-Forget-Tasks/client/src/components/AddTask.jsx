import React, { useState } from 'react';
import { FiPlus, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './AddTask.css';

// Simple Yearly Options Component
const YearlyOptions = ({ selectedDates, onDateSelect }) => {
  const [newDate, setNewDate] = useState('');
  
  const handleAddDate = () => {
    if (newDate && !selectedDates.includes(newDate)) {
      onDateSelect(newDate);
      setNewDate('');
    }
  };
  
  const handleRemoveDate = (dateToRemove) => {
    onDateSelect(dateToRemove);
  };
  
  return (
    <div className="yearly-options">
      <div className="form-group">
        <label className="form-label">Select Specific Dates</label>
        <div className="date-input-section">
          <div className="button-row">
            <button
              type="button"
              onClick={handleAddDate}
              className="add-date-btn"
              disabled={!newDate}
            >
              Add Date
            </button>
          </div>
          
          <div className="date-input-row">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="form-input"
              placeholder="Select a date"
            />
          </div>
          
          {selectedDates.length > 0 && (
            <div className="selected-dates">
              <h4>Selected Dates:</h4>
              <div className="date-tags">
                {selectedDates.map((date, index) => (
                  <span key={index} className="date-tag">
                    {new Date(date).toLocaleDateString()}
                    <button
                      type="button"
                      onClick={() => handleRemoveDate(date)}
                      className="remove-date-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddTask = () => {
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
    reminder: '15 minutes'
  });

  const generateMeetingLink = (platform) => {
    const token = Math.random().toString(36).slice(2, 10);
    const meetingId = Math.floor(Math.random() * 900000000) + 100000000;
    
    if (platform === 'Zoom') {
      // Generate Zoom-style meeting link
      return `https://zoom.us/j/${meetingId}?pwd=${token}`;
    } else if (platform === 'Google Meet') {
      // Generate Google Meet-style meeting link
      return `https://meet.google.com/${token.slice(0, 3)}-${token.slice(3, 6)}-${token.slice(6, 9)}`;
    }
    
    // Fallback
    return `https://meet.dontforget.app/${token}`;
  };

  const [showKeyPointsPanel, setShowKeyPointsPanel] = useState(false);
  const [showKeyPointsPopup, setShowKeyPointsPopup] = useState(false);
  const [keyPointsList, setKeyPointsList] = useState([]);
  const [currentKeyPoint, setCurrentKeyPoint] = useState('');


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      
      // Handle task type change
      if (name === 'taskType') {
        if (value === 'Video') {
          // Generate meeting link when switching to Video type
          next.meetingLink = generateMeetingLink(prev.platform);
        } else {
          // Clear meeting link and platform when switching away from Video
          next.meetingLink = '';
        }
      }
      
      // Handle platform change - regenerate link with new platform
      if (name === 'platform' && prev.taskType === 'Video') {
        next.meetingLink = generateMeetingLink(value);
      }
      
      // Handle date/time change - regenerate link to ensure it's fresh
      if (name === 'dateTime' && prev.taskType === 'Video' && prev.platform) {
        next.meetingLink = generateMeetingLink(prev.platform);
      }
      
      // Handle repeat change - reset repeat options when changing repeat type
      if (name === 'repeat') {
        next.repeatDays = [];
        next.repeatMonths = [];
        next.yearlyDates = [];
      }
      
      return next;
    });
  };
  
  // Handle repeat day selection
  const handleRepeatDayChange = (dayValue, checked) => {
    setFormData(prev => {
      const newDays = checked 
        ? [...prev.repeatDays, dayValue]
        : prev.repeatDays.filter(day => day !== dayValue);
      return { ...prev, repeatDays: newDays };
    });
  };
  
  // Handle repeat month selection
  const handleRepeatMonthChange = (monthValue, checked) => {
    setFormData(prev => {
      const newMonths = checked 
        ? [...prev.repeatMonths, monthValue]
        : prev.repeatMonths.filter(month => month !== monthValue);
      return { ...prev, repeatMonths: newMonths };
    });
  };

  // Handle yearly date selection (toggle behavior for calendar)
  const handleYearlyDateChange = (dateValue) => {
    setFormData(prev => {
      const isSelected = prev.yearlyDates.includes(dateValue);
      const newDates = isSelected 
        ? prev.yearlyDates.filter(date => date !== dateValue)
        : [...prev.yearlyDates, dateValue];
      return { ...prev, yearlyDates: newDates };
    });
  };

  const handleAddKeyPoint = () => {
    if (currentKeyPoint.trim()) {
      setKeyPointsList(prev => [...prev, currentKeyPoint.trim()]);
      setCurrentKeyPoint('');
    }
  };

  const handleKeyPointInputChange = (e) => {
    setCurrentKeyPoint(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyPoint();
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      name: formData.title,
      description: formData.keyPoints || 'No description provided',
      dateTime: formData.dateTime,
      priority: formData.priority.toLowerCase().replace(' ', '-'),
      status: 'pending',
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
    
    console.log('Task data:', newTask);
    // Handle form submission - you can pass this to parent component
    alert('Task saved successfully!');
    
    // Reset form
    setFormData({
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
      reminder: '15 minutes'
    });
    setKeyPointsList([]);
  };

  const taskTypes = ['Regular', 'Video', 'Phone', 'Note'];
  const repeatOptions = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
  const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];
  const reminderOptions = ['5 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours', '1 day'];
  
  // Days of the week for weekly repeat
  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];
  
  // Months for monthly/yearly repeat
  const months = [
    { value: 'january', label: 'January' },
    { value: 'february', label: 'February' },
    { value: 'march', label: 'March' },
    { value: 'april', label: 'April' },
    { value: 'may', label: 'May' },
    { value: 'june', label: 'June' },
    { value: 'july', label: 'July' },
    { value: 'august', label: 'August' },
    { value: 'september', label: 'September' },
    { value: 'october', label: 'October' },
    { value: 'november', label: 'November' },
    { value: 'december', label: 'December' }
  ];


  return (
    <div className="add-task-container">
      <div className="add-task-header">
        <div className="header-left">
          <div className="add-icon"><FiPlus /></div>
          <h1>Don't Forget To Create a Task</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="add-task-form">
        {/* Title (required) */}
        <div className="form-group full">
          <label className="form-label required">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Task Title"
            required
          />
        </div>

        {/* Invitee (optional) */}
        <div className="form-group">
          <label className="form-label">Invitee</label>
          <input
            type="text"
            name="invitee"
            value={formData.invitee}
            onChange={handleChange}
            className="form-input"
            placeholder="Invitee Name or Email"
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

        {/* Video Platform Selection - only show when Video is selected */}
        {formData.taskType === 'Video' && (
          <div className="form-group">
            <label className="form-label">Video Platform</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Zoom">Zoom</option>
              <option value="Google Meet">Google Meet</option>
            </select>
          </div>
        )}

        {/* Auto-generated meeting link for Video */}
        {formData.taskType === 'Video' && (
          <div className="form-group">
            <label className="form-label">Meeting Link (auto-generated)</label>
            <input
              type="text"
              name="meetingLink"
              value={formData.meetingLink || ''}
              readOnly
              className="form-input"
              placeholder="Select platform and date/time to generate link..."
            />
          </div>
        )}

        {/* Date/Time picker */}
        <div className="form-group">
          <label className="form-label">Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Key Points (bullets) */}
        <div className="form-group">
          <label className="form-label">Key Points</label>
          <div className="key-points-container">
            <div className="key-points-input-container">
              <input
                type="text"
                value={currentKeyPoint}
                onChange={handleKeyPointInputChange}
                onKeyPress={handleKeyPress}
                className="form-input"
                placeholder="Enter a key point"
              />
              <button
                type="button"
                className="add-key-point-btn"
                onClick={handleAddKeyPoint}
              >
                Add Key Point
              </button>
            </div>
            <div className="key-points-actions">
              <button
                type="button"
                className="key-points-btn"
                onClick={() => setShowKeyPointsPanel(!showKeyPointsPanel)}
              >
                Show Key Points
              </button>
              <button
                type="button"
                className="key-points-btn popup"
                onClick={() => setShowKeyPointsPopup(!showKeyPointsPopup)}
              >
                Pop Out Key Points
              </button>
            </div>
          </div>
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

        {/* Weekly Repeat Options */}
        {formData.repeat === 'Weekly' && (
          <div className="form-group">
            <label className="form-label">Select Days</label>
            <div className="repeat-options-grid">
              {daysOfWeek.map(day => (
                <label key={day.value} className="repeat-option">
                  <input
                    type="checkbox"
                    checked={formData.repeatDays.includes(day.value)}
                    onChange={(e) => handleRepeatDayChange(day.value, e.target.checked)}
                  />
                  <span>{day.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Repeat Options */}
        {formData.repeat === 'Monthly' && (
          <div className="form-group">
            <label className="form-label">Select Months</label>
            <div className="repeat-options-grid">
              {months.map(month => (
                <label key={month.value} className="repeat-option">
                  <input
                    type="checkbox"
                    checked={formData.repeatMonths.includes(month.value)}
                    onChange={(e) => handleRepeatMonthChange(month.value, e.target.checked)}
                  />
                  <span>{month.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Yearly Repeat Options */}
        {formData.repeat === 'Yearly' && (
          <div className="yearly-options-container">
            <YearlyOptions 
              selectedDates={formData.yearlyDates}
              onDateSelect={handleYearlyDateChange}
            />
          </div>
        )}

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

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter tags separated by commas"
          />
        </div>

        {/* Follow-Up link (optional) */}
        <div className="form-group">
          <label className="form-label">Follow-Up Link</label>
          <input
            type="url"
            name="followUpLink"
            value={formData.followUpLink}
            onChange={handleChange}
            className="form-input"
            placeholder="Optional follow-up link"
          />
        </div>

        {/* Guest Access removed */}

        {/* Redirect URL (optional) */}
        <div className="form-group">
          <label className="form-label">Redirect URL</label>
          <input
            type="url"
            name="redirectUrl"
            value={formData.redirectUrl}
            onChange={handleChange}
            className="form-input"
            placeholder="Optional redirect URL"
          />
        </div>

        {/* Booking Limit (optional) */}
        <div className="form-group">
          <label className="form-label">Booking Limit</label>
          <input
            type="number"
            name="bookingLimit"
            value={formData.bookingLimit}
            onChange={handleChange}
            className="form-input"
            placeholder="Maximum number of bookings"
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

        {/* Save Task button */}
        <div className="form-actions">
          <button type="submit" className="save-btn">Save Task</button>
          <button type="button" className="cancel-btn">Cancel</button>
        </div>
      </form>

      {/* Key Points Side Panel */}
      {showKeyPointsPanel && (
        <div className="key-points-side-panel">
          <div className="panel-header">
            <h3>Key Points</h3>
            <button 
              className="close-panel"
              onClick={() => setShowKeyPointsPanel(false)}
            >
              <FiX />
            </button>
          </div>
          <div className="panel-content">
            {keyPointsList.length > 0 ? (
              <ul className="key-points-list">
                {keyPointsList.map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
            ) : (
              <p className="no-points">No key points added yet</p>
            )}
          </div>
        </div>
      )}

      {/* Key Points Floating Window */}
      {showKeyPointsPopup && (
        <div className="popup-overlay" onClick={() => setShowKeyPointsPopup(false)}>
          <div className="key-points-popup" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-popup-top-right"
              onClick={() => setShowKeyPointsPopup(false)}
            >
              <FiX />
            </button>
            <div className="popup-header">
              <h3>Key Points</h3>
            </div>
            <div className="popup-content">
              {keyPointsList.length > 0 ? (
                <ul className="key-points-list">
                  {keyPointsList.map((point, index) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-points">No key points added yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTask;