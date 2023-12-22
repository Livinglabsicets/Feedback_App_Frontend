// src/components/AdminPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div>
      <h2>Admin Page</h2>
      <Link to="/visit">
        <button>Visit</button>
      </Link>
      <Link to="/feedback">
        <button>Feedback</button>
      </Link>
    </div>
  );
};

export default AdminPage;
