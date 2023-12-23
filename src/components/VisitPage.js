import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate } from 'react-router-dom';
import ViewVisit from './ViewVisit.js';
import AddVisit from './AddVisit.js';
import FeedbackPage from './FeedbackPage';
import './VisitPage.css'; // Import the CSS for this component

const VisitPage = () => {
  const [currentPage, setCurrentPage] = useState('viewVisit');

  const renderPage = () => {
    switch (currentPage) {
      case 'viewVisit':
        return <ViewVisit />;
      case 'addVisit':
        return <AddVisit />;
      case 'feedbackPage':
        return <FeedbackPage />;
      default:
        return null;
    }
  };

  if (currentPage === 'feedbackPage') {
    // Redirect to the selected page
    return <Navigate to="/feedback" />;
  }

  return (
    <div className="visit-page-container">
      {/* Header with navigation links */}
      <nav className="navigation-bar">
        <button className={currentPage === 'viewVisit' ? 'active' : ''} onClick={() => setCurrentPage('viewVisit')}>View Visit</button>
        <button className={currentPage === 'addVisit' ? 'active' : ''} onClick={() => setCurrentPage('addVisit')}>Add Visit</button>
        <button className={currentPage === 'feedbackPage' ? 'active' : ''} onClick={() => setCurrentPage('feedbackPage')}>Feedback Page</button>
      </nav>

      <hr />

      {/* Content area */}
      {renderPage()}
    </div>
  );
};

export default VisitPage;
