import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (error) {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">
            <Shield size={20} strokeWidth={2} />
          </div>
          <h1>Via Kashmir</h1>
          <p>Admin Panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error">{error}</div>}
          
          <div className="field">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email Address</label>
            <div className="field-line"></div>
          </div>

          <div className="field">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="password">Password</label>
            <div className="field-line"></div>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
      
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
          padding: 24px;
        }

        .login-card {
          background: #ffffff;
          width: 100%;
          max-width: 380px;
          padding: 40px 32px;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid #e2e8f0;
        }

        .brand {
          text-align: center;
          margin-bottom: 40px;
        }

        .brand-icon {
          width: 56px;
          height: 56px;
          background: #6366f1;
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .brand h1 {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 6px 0;
          letter-spacing: -0.3px;
        }

        .brand p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .field {
          position: relative;
        }

        .field input {
          width: 100%;
          padding: 16px 0 6px 0;
          border: none;
          background: transparent;
          font-size: 15px;
          font-weight: 400;
          color: #1e293b;
          outline: none;
          transition: all 0.2s ease;
        }

        .field input:focus + label,
        .field input:not(:placeholder-shown) + label {
          top: 0;
          font-size: 12px;
          color: #6366f1;
          font-weight: 500;
        }

        .field input:focus ~ .field-line {
          background: #6366f1;
        }

        .field label {
          position: absolute;
          top: 16px;
          left: 0;
          font-size: 15px;
          color: #64748b;
          font-weight: 400;
          transition: all 0.2s ease;
          pointer-events: none;
        }

        .field-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: #e2e8f0;
          transition: background 0.2s ease;
        }

        .password-toggle {
          position: absolute;
          right: 0;
          top: 12px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .password-toggle:hover {
          color: #6366f1;
          background: #f1f5f9;
        }

        .submit-btn {
          background: #6366f1;
          color: white;
          border: none;
          padding: 14px 24px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #5855eb;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          font-size: 13px;
          text-align: center;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
};

export default Login;
