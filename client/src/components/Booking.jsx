import React, { useMemo, useState } from 'react';
import { FiCalendar, FiChevronDown, FiRefreshCw, FiLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Booking.css';

const defaultSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00',
  '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00'
];

const Booking = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState('');
  const [guest, setGuest] = useState({ name: '', email: '', phone: '', comment: '' });
  const [step, setStep] = useState('select'); // select -> payment -> confirm
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  // Packages (services) the owner offers
  const [packages, setPackages] = useState([
    { id: 'consult-30', name: 'Consultation (30 min)', price: 29, duration: 30, description: 'Quick consult call' }
  ]);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', duration: '', description: '' });
  
  // Task details state
  const [selectedTaskType, setSelectedTaskType] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [connectedTask, setConnectedTask] = useState(null);
  
  // Sample tasks data (in real app, this would come from props or API)
  const tasks = [
    {
      id: 1,
      name: 'Complete Project Proposal',
      description: 'Draft and finalize the quarterly project proposal for client presentation',
      dateTime: '2024-01-15T10:00:00',
      priority: 'due-today',
      status: 'in-progress'
    },
    {
      id: 2,
      name: 'Team Meeting Preparation',
      description: 'Prepare agenda and materials for the weekly team standup meeting',
      dateTime: '2024-01-16T14:30:00',
      priority: 'upcoming',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Client Follow-up Call',
      description: 'Schedule and conduct follow-up call with potential client',
      dateTime: '2024-01-17T11:00:00',
      priority: 'follow-up',
      status: 'pending'
    },
    {
      id: 4,
      name: 'Code Review Session',
      description: 'Review pull requests and provide feedback to development team',
      dateTime: '2024-01-14T16:00:00',
      priority: 'late',
      status: 'overdue'
    },
    {
      id: 5,
      name: 'Database Migration',
      description: 'Execute critical database migration for production environment',
      dateTime: '2024-01-15T09:00:00',
      priority: 'high-priority',
      status: 'in-progress'
    }
  ];

  const meetingLink = useMemo(() => {
    if (!selectedSlot) return '';
    const token = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `https://dontforget.app/meet/${date}-${selectedSlot}-${token}`;
  }, [date, selectedSlot]);

  const isGuestValid = guest.name.trim() && guest.email.trim() && guest.phone.trim();

  // Task filtering logic (similar to FollowUp component)
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
      .filter(t => selectedTaskType === 'all' || t.priority === selectedTaskType)
      .sort((a, b) => {
        const aKey = priorityOrder[a.priority] || priorityOrder.other;
        const bKey = priorityOrder[b.priority] || priorityOrder.other;
        if (aKey !== bKey) return aKey - bKey;
        return (a.dateTime || '').localeCompare(b.dateTime || '');
      });
  }, [tasks, selectedTaskType]);

  const taskTypes = useMemo(() => {
    const set = new Set(tasks.map(t => t.priority).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [tasks]);

  const selectedTask = useMemo(() => {
    return tasks.find(t => String(t.id) === String(selectedTaskId));
  }, [tasks, selectedTaskId]);

  const handleConnectToBooking = () => {
    if (selectedTask) {
      setConnectedTask(selectedTask);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!isGuestValid || !selectedSlot) return;
    if (step === 'select') {
      setStep('payment');
      return;
    }
    if (step === 'payment') {
      // Simulate payment success
      setTimeout(() => setStep('confirm'), 400);
    }
  };

  const resetBooking = () => {
    setSelectedSlot('');
    setGuest({ name: '', email: '', phone: '', comment: '' });
    setPaymentMethod('stripe');
    setStep('select');
  };

  const publicBookingLink = useMemo(() => {
    const paymentParam = 'optional';
    const minimalPkgs = packages.map(p => ({ id: p.id, n: p.name, pr: Number(p.price) || 0, du: Number(p.duration) || 0, d: p.description || '' }));
    const pkgsParam = btoa(unescape(encodeURIComponent(JSON.stringify(minimalPkgs))));
    return `/book?owner=true&payment=${paymentParam}&pkgs=${pkgsParam}`;
  }, [packages]);

  const fullPublicBookingUrl = useMemo(() => {
    try {
      return (window?.location?.origin || '') + publicBookingLink;
    } catch {
      return publicBookingLink;
    }
  }, [publicBookingLink]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + publicBookingLink);
      alert('Public booking link copied!');
    } catch (e) {
      console.error(e);
      alert('Could not copy link.');
    }
  };

  const copyMeetingLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Meeting link copied!');
    } catch (e) {
      console.error(e);
    }
  };

  const addPackage = (e) => {
    e.preventDefault();
    if (!newPackage.name || !newPackage.duration) return;
    const pkg = {
      id: `${newPackage.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now().toString(36)}`,
      name: newPackage.name.trim(),
      price: Number(newPackage.price) || 0,
      duration: Number(newPackage.duration) || 0,
      description: newPackage.description?.trim() || ''
    };
    setPackages(prev => [...prev, pkg]);
    setNewPackage({ name: '', price: '', duration: '', description: '' });
  };

  const removePackage = (id) => setPackages(prev => prev.filter(p => p.id !== id));

  return (
    <div className="booking-page">
      <div className="content-header">
        <div className="section-title">
          <span className="title-icon"><FiCalendar /></span>
          <h2>Booking Setup</h2>
        </div>
        <p className="section-desc">Copy and share your booking link so clients can view your availability, choose a date and time, and book their appointment — all updates appear automatically on your dashboard.</p>
      </div>

      {/* Owner Controls */}
      <div className="owner-controls">
        <div className="link-preview">
          <code className="mono link-url">{fullPublicBookingUrl}</code>
          <div className="link-actions">
            <button className="secondary-btn" onClick={handleCopyLink}><FiLink style={{ marginRight: 6 }} />Copy Link</button>
            <Link to={publicBookingLink} target="_blank" className="primary-btn">Preview</Link>
          </div>
        </div>
        {/* Payment required control removed: public link defaults to optional payment */}
      </div>

      {/* Packages Builder */}
      <div className="packages-builder">
        <h3>Create Packages</h3>
        <form onSubmit={addPackage} className="packages-form">
          <div className="form-row">
            <input placeholder="Package name" value={newPackage.name} onChange={(e)=>setNewPackage({ ...newPackage, name: e.target.value })} required className="form-input" />
            <input type="number" min="0" step="0.01" placeholder="Price ($)" value={newPackage.price} onChange={(e)=>setNewPackage({ ...newPackage, price: e.target.value })} className="form-input" />
          </div>
          <div className="form-row">
            <input type="number" min="0" step="5" placeholder="Duration (min)" value={newPackage.duration} onChange={(e)=>setNewPackage({ ...newPackage, duration: e.target.value })} required className="form-input" />
            <input placeholder="Description (optional)" value={newPackage.description} onChange={(e)=>setNewPackage({ ...newPackage, description: e.target.value })} className="form-input" />
          </div>
          <div className="form-row">
            <button className="primary-btn" type="submit">Add Package</button>
          </div>
        </form>
        {packages.length > 0 && (
          <div className="packages-list">
            {packages.map(p => (
              <div key={p.id} className="package-item">
                <div className="package-info">
                  <div className="package-name"><strong>{p.name}</strong></div>
                  <div className="package-details">
                    <span className="package-price">${p.price.toFixed(2)}</span>
                    <span className="package-duration">{p.duration}m</span>
                  </div>
                  {p.description && (
                    <div className="package-description">{p.description}</div>
                  )}
                </div>
                <button className="secondary-btn remove-btn" onClick={()=>removePackage(p.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="content-subhead">
        <h3>Your Booking Flow (example)</h3>
        <p className="section-desc">Pick a time slot, enter details, complete payment if required, and get your confirmation instantly.</p>
      </div>

      {step !== 'confirm' && (
        <div className="booking-container">
          <div className="booking-main">
            <div className="booking-grid">
              <div className="calendar-card">
                <div className="card-title">Select Date</div>
                <input
                  type="date"
                  className="date-input"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setSelectedSlot(''); }}
                />
                <div className="card-title" style={{ marginTop: 12 }}>Available Slots</div>
                <div className="slots-grid">
                  {defaultSlots.map(t => (
                    <button
                      key={t}
                      className={`slot-btn ${selectedSlot === t ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(t)}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <form className="details-card" onSubmit={handleConfirm}>
                <div className="card-title">Guest Details</div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Name</label>
                    <input value={guest.name} onChange={(e)=>setGuest({ ...guest, name: e.target.value })} placeholder="Your full name" required />
                  </div>
                  <div className="form-field">
                    <label>Email</label>
                    <input type="email" value={guest.email} onChange={(e)=>setGuest({ ...guest, email: e.target.value })} placeholder="Your email address" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Phone</label>
                    <input value={guest.phone} onChange={(e)=>setGuest({ ...guest, phone: e.target.value })} placeholder="Your phone number" required />
                  </div>
                </div>
            <div className="form-row">
              <div className="form-field full">
                <label>Comment</label>
                <textarea value={guest.comment} onChange={(e)=>setGuest({ ...guest, comment: e.target.value })} placeholder="Anything we should know?" rows={4} />
              </div>
            </div>

            {connectedTask && (
              <div className="connected-task-info">
                <div className="connected-task-header">
                  <span className="connected-task-label">Connected Task:</span>
                </div>
                <div className="connected-task-details">
                  <div className="connected-task-title">{connectedTask.name}</div>
                  {connectedTask.dateTime && (
                    <div className="connected-task-date">
                      {new Date(connectedTask.dateTime).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 'select' && (
              <div className="actions-row">
                <button type="button" className="primary-btn" disabled={!isGuestValid || !selectedSlot}>Confirm</button>
              </div>
            )}

                {step === 'payment' && (
                  <div className="payment-panel">
                    <div className="card-title">Payment</div>
                    <div className="pay-methods">
                      <label className="radio"><input type="radio" name="pay" checked={paymentMethod==='stripe'} onChange={()=>setPaymentMethod('stripe')} /> Stripe</label>
                      <label className="radio"><input type="radio" name="pay" checked={paymentMethod==='paypal'} onChange={()=>setPaymentMethod('paypal')} /> PayPal</label>
                    </div>
                    <div className="actions-row">
                      <button type="submit" className="primary-btn">Pay and Confirm</button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="task-details-section">
            <div className="task-picker">
              <label className="picker-label">Connect this booking to a task</label>
              <div className="picker-row">
                <select
                  className="filter-select"
                  value={selectedTaskType}
                  onChange={(e) => { setSelectedTaskType(e.target.value); setSelectedTaskId(''); }}
                >
                  {taskTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Task Types' : type.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="picker-row">
                <select
                  className="filter-select"
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                >
                  <option value="">{selectedTaskType === 'all' ? 'Select a task...' : 'Select a task in this type...'}</option>
                  {tasksByRelevance.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.name} {task.dateTime ? `— ${new Date(task.dateTime).toLocaleString()}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedTask && (
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
                <div className="connect-booking-actions">
                  <button className="connect-booking-btn" onClick={handleConnectToBooking}>
                    <FiLink className="btn-icon" />
                    Connect to Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="confirmation-card">
          <div className="card-title">Booking Confirmed</div>
          <ul className="confirm-list">
            <li><strong>Service:</strong> Consultation</li>
            <li><strong>Date/Time:</strong> {date} at {selectedSlot}</li>
            <li><strong>Meeting link:</strong> <span className="mono">{meetingLink}</span> <button className="secondary-btn" onClick={()=>copyMeetingLink(meetingLink)} style={{ marginLeft: 8 }}>Copy</button></li>
            {guest.comment && (<li><strong>Notes:</strong> {guest.comment}</li>)}
          </ul>
          <div className="actions-row">
            <button className="secondary-btn" onClick={resetBooking}>Book Another</button>
            <a className="primary-btn" href="#" onClick={(e)=>e.preventDefault()}>Go to Custom URL</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;



