import React, { useMemo, useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import './FollowUp.css';

const FollowUp = ({ tasks, setTasks, onNavigate }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [newNote, setNewNote] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [taskQuery, setTaskQuery] = useState('');

  const tasksByRelevance = useMemo(() => {
    const priorityOrder = {
      'due-today': 1,
      'late': 2,
      'upcoming': 3,
      'follow-up': 4,
      'high-priority': 5,
      'other': 6
    };
    return [...tasks]
      .filter(t => selectedType === 'all' || t.priority === selectedType)
      .filter(t =>
        !taskQuery.trim() ||
        t.name.toLowerCase().includes(taskQuery.toLowerCase()) ||
        (t.description || '').toLowerCase().includes(taskQuery.toLowerCase())
      )
      .sort((a, b) => {
      const aKey = priorityOrder[a.priority] || priorityOrder.other;
      const bKey = priorityOrder[b.priority] || priorityOrder.other;
      if (aKey !== bKey) return aKey - bKey;
      return (a.dateTime || '').localeCompare(b.dateTime || '');
      });
  }, [tasks, selectedType, taskQuery]);

  const taskTypes = useMemo(() => {
    const set = new Set(tasks.map(t => t.priority).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [tasks]);

  const selectedTask = useMemo(() => {
    return tasks.find(t => String(t.id) === String(selectedTaskId));
  }, [tasks, selectedTaskId]);

  const handleAddNote = () => {
    if (!selectedTask || !newNote.trim()) return;
    const timestamp = new Date().toISOString();
    const updatedTasks = tasks.map(t => {
      if (t.id === selectedTask.id) {
        const existingNotes = Array.isArray(t.followUps) ? t.followUps : [];
        return { ...t, followUps: [...existingNotes, { id: timestamp, text: newNote.trim(), date: timestamp }] };
      }
      return t;
    });
    setTasks(updatedTasks);
    setNewNote('');
  };

  const handleUpdateNote = (noteId, newText) => {
    if (!selectedTask) return;
    const updatedTasks = tasks.map(t => {
      if (t.id === selectedTask.id) {
        const existingNotes = Array.isArray(t.followUps) ? t.followUps : [];
        return { ...t, followUps: existingNotes.map(n => n.id === noteId ? { ...n, text: newText } : n) };
      }
      return t;
    });
    setTasks(updatedTasks);
  };

  const handleMarkComplete = () => {
    if (!selectedTask) return;
    const updatedTasks = tasks.map(t => t.id === selectedTask.id ? { ...t, status: 'completed' } : t);
    setTasks(updatedTasks);
    if (onNavigate) onNavigate('dashboard');
  };

  return (
    <div className="followup-page">
      <div className="content-header">
        <div className="section-title">
          <span className="title-icon"><FiRefreshCw /></span>
          <h2>Follow-Up</h2>
        </div>
      </div>

      <div className="followup-picker">
        <label className="picker-label">Which task do you want to follow up on?</label>
        <div className="picker-row">
          <div className="picker-field">
            <label className="field-label">Category</label>
            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setSelectedTaskId(''); }}
              title="Filter tasks by priority type (All, Due Today, Late, Upcoming, Follow-up, High Priority)"
            >
              {taskTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Task Types' : type.replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="picker-field">
            <label className="field-label">Search</label>
            <input
              type="text"
              className="search-input"
              placeholder={selectedType === 'all' ? 'Search all tasks...' : `Search ${selectedType.replace('-', ' ')} tasks...`}
              value={taskQuery}
              onChange={(e) => setTaskQuery(e.target.value)}
              title="Search tasks by name or description. Type to filter the task list below."
            />
          </div>
          <div className="picker-field">
            <label className="field-label">Task</label>
            <select
              id="taskSelect"
              className="filter-select"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              title="Select a specific task from the filtered list to add follow-up notes or mark as complete"
            >
              <option value="">{selectedType === 'all' ? 'Select a task...' : 'Select a task in this type...'}</option>
              {tasksByRelevance.map(task => (
                <option key={task.id} value={task.id}>
                  {task.name} {task.dateTime ? `— ${new Date(task.dateTime).toLocaleString()}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedTask && (
        <div className="followup-content">
          <div className="task-summary">
            <div className="task-card-header">
              <div className="task-title-row">
                <h3 className="task-title">{selectedTask.name}</h3>
                <span className={`status-badge ${selectedTask.status}`}>{selectedTask.status}</span>
              </div>
              {selectedTask.dateTime && (
                <div className="task-datetime">{new Date(selectedTask.dateTime).toLocaleString()}</div>
              )}
            </div>
            {selectedTask.description && (
              <p className="task-description">{selectedTask.description}</p>
            )}
          </div>

          <div className="followup-panel">
            <div className="notes-timeline">
              <h4 className="panel-title">Follow-Up Timeline</h4>
              <ul className="notes-list">
                {(selectedTask.followUps || []).length === 0 && (
                  <li className="note-item empty">No follow-up notes yet.</li>
                )}
                {(selectedTask.followUps || []).map(note => (
                  <li key={note.id} className="note-item">
                    <div className="note-meta">
                      <span className="note-date">{note.date ? new Date(note.date).toLocaleString() : ''}</span>
                    </div>
                    <textarea
                      className="note-text editable"
                      value={note.text}
                      onChange={(e) => handleUpdateNote(note.id, e.target.value)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="add-note">
              <h4 className="panel-title">Add New Follow-Up</h4>
              <textarea
                className="note-input"
                placeholder="Write your follow-up note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                title="Enter your follow-up note here. This will be saved with a timestamp to track your progress."
              />
              <div className="actions-row">
                <button 
                  className="primary-btn" 
                  onClick={handleAddNote} 
                  disabled={!newNote.trim()}
                  title={newNote.trim() ? "Save this follow-up note to the selected task" : "Enter a note first to save"}
                >
                  Save Note
                </button>
                <button 
                  className="secondary-btn" 
                  onClick={handleMarkComplete}
                  title="Mark the selected task as completed and return to dashboard"
                >
                  Mark Task Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUp;


