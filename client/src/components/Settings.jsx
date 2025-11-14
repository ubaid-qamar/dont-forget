import React, { useMemo, useState } from 'react';
import { FiSettings } from 'react-icons/fi';
import './Settings.css';

const SETTINGS_SECTIONS = [
  { id: 'integrations', label: 'Integrations' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'branding', label: 'Branding' },
  { id: 'booking-caps', label: 'Booking Caps' },
  { id: 'guest-access', label: 'Guest Access' },
  { id: 'account', label: 'Account' }
];

const availableIntegrations = [
  { id: 'zoom', name: 'Zoom' },
  { id: 'gmeet', name: 'Google Meet' },
  { id: 'stripe', name: 'Stripe' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'canva', name: 'Canva' },
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'zapier', name: 'Zapier' }
];

const Settings = () => {
  const [active, setActive] = useState('integrations');
  const [connections, setConnections] = useState({});
  const [notify, setNotify] = useState({ reminders: true, payments: true, overdue: true });
  const [branding, setBranding] = useState({ color: '#0e7a92', logo: '' });
  const [caps, setCaps] = useState({ daily: 3, weekly: 10, monthly: 40 });
  const [guest, setGuest] = useState({ link: '', username: '', passcode: '' });

  const handleConnect = (id) => {
    const isConnected = !!connections[id];
    if (isConnected) {
      setConnections({ ...connections, [id]: null });
    } else {
      // Simulate OAuth/API key success
      setConnections({ ...connections, [id]: { connectedAt: new Date().toISOString() } });
    }
  };

  const handleGenerateGuestAccess = () => {
    const uname = `guest_${Math.random().toString(36).slice(2, 7)}`;
    const pass = Math.random().toString(36).slice(2, 8).toUpperCase();
    const url = `https://dontforget.app/guest/${uname}`;
    setGuest({ username: uname, passcode: pass, link: url });
  };

  const sectionTitle = useMemo(() => SETTINGS_SECTIONS.find(s => s.id === active)?.label || '', [active]);

  return (
    <div className="settings-page">
      <aside className="settings-side">
        <div className="settings-side-header">Settings</div>
        <ul className="settings-nav">
          {SETTINGS_SECTIONS.map(s => (
            <li key={s.id}>
              <button className={`settings-link ${active === s.id ? 'active' : ''}`} onClick={() => setActive(s.id)}>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="settings-content">
        <div className="settings-header">
          <div className="section-title">
            <span className="title-icon"><FiSettings /></span>
            <h2>{sectionTitle}</h2>
          </div>
          <p className="section-desc">
            Configure your workspace. Changes save instantly on this device.
          </p>
        </div>

        {active === 'integrations' && (
          <div className="card-grid">
            {availableIntegrations.map(item => {
              const connected = !!connections[item.id];
              return (
                <div key={item.id} className="setting-card">
                  <div className="card-head">
                    <div className="card-title">{item.name}</div>
                    <span className={`status-badge ${connected ? 'connected' : ''}`}>{connected ? 'Connected' : 'Not connected'}</span>
                  </div>
                  <p className="card-desc">Connect your own {item.name} account. We do not provide this service.</p>
                  <div className="card-actions">
                    <button className={`primary-btn`} onClick={() => handleConnect(item.id)}>
                      {connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {active === 'notifications' && (
          <div className="setting-card">
            <div className="card-title">Platform Notifications</div>
            <p className="card-desc">In-app notifications only. No SMS or email.</p>
            <div className="toggle-list">
              <label className="toggle-item"><input type="checkbox" checked={notify.reminders} onChange={(e)=>setNotify({ ...notify, reminders: e.target.checked })}/> Show reminders</label>
              <label className="toggle-item"><input type="checkbox" checked={notify.payments} onChange={(e)=>setNotify({ ...notify, payments: e.target.checked })}/> Show payment alerts</label>
              <label className="toggle-item"><input type="checkbox" checked={notify.overdue} onChange={(e)=>setNotify({ ...notify, overdue: e.target.checked })}/> Show task overdue warning</label>
            </div>
          </div>
        )}

        {active === 'analytics' && (
          <div className="setting-card">
            <div className="card-title">Reports</div>
            <p className="card-desc">On-demand only: generate snapshots when you need them.</p>
            <div className="report-buttons">
              <button className="secondary-btn">Daily Snapshot</button>
              <button className="secondary-btn">Weekly Summary</button>
              <button className="secondary-btn">Monthly Overview</button>
              <button className="primary-btn">Generate Report</button>
            </div>
          </div>
        )}

        {active === 'branding' && (
          <div className="setting-card">
            <div className="card-title">Workspace Branding</div>
            <p className="card-desc">Upload a logo and choose a color to personalize booking pages and dashboards.</p>
            <div className="form-row">
              <div className="form-field">
                <label>Logo</label>
                <input type="file" accept="image/*" onChange={(e)=>setBranding({ ...branding, logo: e.target.files?.[0]?.name || '' })} />
                {branding.logo && <div className="hint">Selected: {branding.logo}</div>}
              </div>
              <div className="form-field">
                <label>Primary Color</label>
                <input type="color" value={branding.color} onChange={(e)=>setBranding({ ...branding, color: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {active === 'booking-caps' && (
          <div className="setting-card">
            <div className="card-title">Booking Limits</div>
            <p className="card-desc">Prevent overbooking and manage workload with caps.</p>
            <div className="form-row">
              <div className="form-field">
                <label>Daily limit</label>
                <input type="number" min="0" value={caps.daily} onChange={(e)=>setCaps({ ...caps, daily: Number(e.target.value) })} />
              </div>
              <div className="form-field">
                <label>Weekly limit</label>
                <input type="number" min="0" value={caps.weekly} onChange={(e)=>setCaps({ ...caps, weekly: Number(e.target.value) })} />
              </div>
              <div className="form-field">
                <label>Monthly limit</label>
                <input type="number" min="0" value={caps.monthly} onChange={(e)=>setCaps({ ...caps, monthly: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        )}

        {active === 'guest-access' && (
          <div className="setting-card">
            <div className="card-title">Guest Access</div>
            <p className="card-desc">Generate a temporary username, passcode, and link for meetings. No email invites.</p>
            <div className="guest-grid">
              <button className="primary-btn" onClick={handleGenerateGuestAccess}>Generate Guest Access</button>
              {guest.link && (
                <div className="guest-info">
                  <div><strong>Username:</strong> {guest.username}</div>
                  <div><strong>Passcode:</strong> {guest.passcode}</div>
                  <div><strong>Link:</strong> <span className="mono">{guest.link}</span></div>
                </div>
              )}
            </div>
          </div>
        )}

        {active === 'account' && (
          <div className="setting-card">
            <div className="card-title">Account</div>
            <p className="card-desc">View payment history via Stripe/PayPal links, export data, or manage your account.</p>
            <div className="account-actions">
              <button className="secondary-btn">View Stripe/PayPal Transactions</button>
              <button className="secondary-btn">Export Data</button>
              <button className="danger-btn">Delete Account</button>
              <button className="secondary-btn">Cancel Subscription</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Settings;



