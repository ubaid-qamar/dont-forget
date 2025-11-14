import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import Header from '../Header';
import SiteFooter from '../SiteFooter';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement actual authentication logic
    // For now, just redirect to dashboard
    console.log('Form submitted:', formData);
    navigate('/dashboard');
  };

  return (
    <>
    <div className="login-container">
      <Header />
      <div className="login-card">
        <div className="login-header">
          <h1>Don't Forget</h1>
          <p>Welcome back!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {/* Forgot password link removed per request */}
          
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
        
        <div className="toggle-mode">
          <p>
            Don't have an account?
            <Link to="/signup" className="toggle-button">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
      <SiteFooter />
      </>
  );
};

export default Login;
