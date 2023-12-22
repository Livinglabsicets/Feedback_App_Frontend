import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css'; // Import the CSS for this component

const AdminPage = () => {
  return (
    <div className="admin-container">
      <h2>Admin Page</h2>
      <div className="button-group">
        <Link to="/visit" className="custom-link">
          <button className="custom-button">Visit</button>
        </Link>
        <Link to="/feedback" className="custom-link">
          <button className="custom-button">Feedback</button>
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
