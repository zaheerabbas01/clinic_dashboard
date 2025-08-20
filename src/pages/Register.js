import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerClinic } from '../api/clinicApi';
import '../styles/Register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    services: ['General Consultation'], // Default service
    operatingHours: {
      opening: '09:00',
      closing: '17:00'
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Available service options
  const serviceOptions = [
    'General Consultation',
    'Dental Care',
    'Pediatrics',
    'Dermatology',
    'Cardiology',
    'Orthopedics',
    'Ophthalmology',
    'Gynecology',
    'Neurology',
    'Emergency Care'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceChange = (service) => {
    const currentServices = formData.services;
    
    if (currentServices.includes(service)) {
      // Remove service if already selected
      setFormData({
        ...formData,
        services: currentServices.filter(s => s !== service)
      });
    } else {
      // Add service if not selected
      setFormData({
        ...formData,
        services: [...currentServices, service]
      });
    }
  };

  const handleTimeChange = (field, value) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const response = await registerClinic({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        services: formData.services,
        operatingHours: formData.operatingHours
      });

      if (response.data && response.data.token) {
        // Auto-login after successful registration
        localStorage.setItem('clinicUser', JSON.stringify({
          token: response.data.token,
          clinic: response.data.clinic
        }));
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="logo">
          <h1>Clinic Queue System</h1>
        </div>
        <h2>Register Your Clinic</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Clinic Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter clinic name"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter clinic email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter clinic phone number"
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter clinic address"
            />
          </div>

          <div className="form-group">
            <label>Services Offered *</label>
            <div className="services-checkbox-group">
              {serviceOptions.map(service => (
                <label key={service} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service)}
                    onChange={() => handleServiceChange(service)}
                  />
                  <span className="checkmark"></span>
                  {service}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group operating-hours">
            <label>Operating Hours *</label>
            <div className="time-inputs">
              <div className="time-input">
                <label>Opening Time</label>
                <input
                  type="time"
                  value={formData.operatingHours.opening}
                  onChange={(e) => handleTimeChange('opening', e.target.value)}
                  required
                />
              </div>
              <div className="time-input">
                <label>Closing Time</label>
                <input
                  type="time"
                  value={formData.operatingHours.closing}
                  onChange={(e) => handleTimeChange('closing', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="register-button"
          >
            {loading ? 'Creating Account...' : 'Register Clinic'}
          </button>
        </form>

        <div className="login-link">
          <p>Already have an account?</p>
          <Link to="/login" className="login-button">
            Login to Existing Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;