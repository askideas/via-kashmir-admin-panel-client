import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <h1>{title}</h1>
        <p>This page is under development.</p>
      </div>

      <style jsx>{`
        .placeholder-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .placeholder-content {
          text-align: center;
          background: white;
          padding: 48px;
          border-radius: 12px;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .placeholder-content h1 {
          font-size: 32px;
          color: #315149;
          margin-bottom: 16px;
        }

        .placeholder-content p {
          color: #6b7280;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default PlaceholderPage;
