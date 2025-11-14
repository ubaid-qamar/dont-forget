import React, { useState, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AddTask from './AddTask';
import FollowUp from './FollowUp';
import Settings from './Settings';
import MeetingTasksManager from './MeetingTasksManager';
import MeetingTemplates from './MeetingTemplates';
import Booking from './Booking';
import Meetings from './Meetings';
import './Layout.css';
import FAQ from './FAQ';
import Contact from './Contact';
import Blog from './Blog';
import PrivacyPolicy from './PrivacyPolicy';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 500);
  
  // Load tasks from localStorage on initial render
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('dontForgetTasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        return getDefaultTasks();
      }
    }
    return getDefaultTasks();
  });
  
  // Save tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('dontForgetTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Default tasks function
  function getDefaultTasks() {
    return [
    {
      id: 1,
      name: 'Complete Project Proposal',
      description: 'Draft and finalize the quarterly project proposal for client presentation',
      dateTime: '2024-01-15T10:00:00',
      priority: 'medium',
      status: 'in-progress',
      repeat: 'None',
      repeatDays: [],
      repeatMonths: []
    },
    {
      id: 2,
      name: 'Weekly Team Standup',
      description: 'Prepare agenda and materials for the weekly team standup meeting',
      dateTime: '2024-01-16T14:30:00',
      priority: 'low',
      status: 'pending',
      repeat: 'Weekly',
      repeatDays: ['monday', 'wednesday', 'friday'],
      repeatMonths: []
    },
    {
      id: 3,
      name: 'Code Review Session',
      description: 'Review pull requests and provide feedback to development team',
      dateTime: '2024-01-14T16:00:00',
      priority: 'high',
      status: 'overdue',
      repeat: 'None',
      repeatDays: [],
      repeatMonths: []
    },
    {
      id: 4,
      name: 'Monthly Client Check-in',
      description: 'Schedule and conduct follow-up call with potential client',
      dateTime: '2024-01-17T11:00:00',
      priority: 'urgent',
      status: 'pending',
      repeat: 'Monthly',
      repeatDays: [],
      repeatMonths: ['january', 'march', 'may', 'july', 'september', 'november'],
      followUps: [
        { id: '2024-03-01T10:00:00Z', text: 'Zoom call completed. Need to send proposal.', date: '2024-03-01T10:00:00Z' }
      ]
    },
    {
      id: 5,
      name: 'Database Migration',
      description: 'Execute critical database migration for production environment',
      dateTime: '2024-01-15T09:00:00',
      priority: 'medium',
      status: 'in-progress',
      repeat: 'None',
      repeatDays: [],
      repeatMonths: []
    },
    {
      id: 6,
      name: 'Annual Review Meeting',
      description: 'Conduct yearly performance review with team members',
      dateTime: '2024-01-18T15:00:00',
      priority: 'low',
      status: 'pending',
      repeat: 'Yearly',
      repeatDays: ['monday', 'tuesday', 'wednesday'],
      repeatMonths: ['january', 'june', 'december']
    }
    ];
  }

  const sectionFromPath = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    // path: /dashboard/:section?
    return parts[1] || 'dashboard';
  }, [location.pathname]);

  // Keep state in sync with URL
  React.useEffect(() => {
    if (activeSection !== sectionFromPath) {
      setActiveSection(sectionFromPath);
    }
  }, [sectionFromPath]);

  // Handle window resize to manage sidebar state
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    navigate(`/dashboard/${section === 'dashboard' ? '' : section}`);
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 500) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className={`layout${sidebarOpen ? '' : ' sidebar-closed'}`}>
      {/* Mobile Top Bar with Burger - visible at 500px and below */}
      <div className="mobile-topbar">
        <button 
          className="mobile-menu-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>
      
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(prev => !prev)}
      />
      <div className="main-content">
        <Routes>
          <Route index element={<Dashboard tasks={tasks} setTasks={setTasks} onNavigate={handleSectionChange} />} />
          <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="add-task" element={<AddTask tasks={tasks} setTasks={setTasks} />} />
          <Route path="follow-up" element={<FollowUp tasks={tasks} setTasks={setTasks} onNavigate={handleSectionChange} />} />
          <Route path="meetings" element={<Meetings tasks={tasks} setTasks={setTasks} />} />
          <Route path="meeting-tasks" element={<MeetingTasksManager />} />
          <Route path="meeting-templates" element={<MeetingTemplates />} />
          <Route path="settings" element={<Settings />} />
          <Route path="booking" element={<Booking />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          {/* Temporarily route Privacy & Terms to PrivacyPolicy until separate Terms page exists */}
          <Route path="privacy-terms" element={<PrivacyPolicy />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      {sidebarOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
