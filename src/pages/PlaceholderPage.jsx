import React from 'react';
import { Settings, ArrowRight } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="placeholder-page">
      <div className="page-header">
        <h1>{title}</h1>
        <p>This section is currently under development</p>
      </div>

      <div className="placeholder-content">
        <div className="placeholder-card">
          <div className="placeholder-icon">
            <Settings size={24} strokeWidth={2} />
          </div>
          
          <h2>Coming Soon</h2>
          <p>We're working on bringing you the best {title.toLowerCase()} management experience.</p>
          
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <span>Advanced Analytics</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <span>Real-time Updates</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔍</div>
              <span>Smart Search</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <span>Bulk Operations</span>
            </div>
          </div>

          <button className="notify-btn">
            <span>Get Notified</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .placeholder-page {
          font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
          max-width: 700px;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 6px 0;
          letter-spacing: -0.4px;
        }

        .page-header p {
          color: #64748b;
          font-size: 15px;
          margin: 0;
          font-weight: 400;
        }

        .placeholder-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
        }

        .placeholder-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 48px 40px;
          text-align: center;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .placeholder-icon {
          width: 64px;
          height: 64px;
          background: #6366f1;
          color: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .placeholder-card h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px 0;
          letter-spacing: -0.3px;
        }

        .placeholder-card > p {
          color: #64748b;
          font-size: 15px;
          line-height: 1.5;
          margin: 0 0 32px 0;
          font-weight: 400;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .feature-item:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
        }

        .feature-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .feature-item span {
          font-size: 13px;
          font-weight: 500;
          color: #475569;
        }

        .notify-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #6366f1;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notify-btn:hover {
          background: #5855eb;
        }
      `}</style>
    </div>
  );
};

export default PlaceholderPage;
