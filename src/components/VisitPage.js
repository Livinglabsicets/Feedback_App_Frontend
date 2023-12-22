import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Navigate } from 'react-router-dom';
import ViewVisit from './ViewVisit.js';
import AddVisit from './AddVisit.js';
import FeedbackPage from './FeedbackPage';

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
    <div>
      {/* Header with navigation links */}
      <nav>
        <ul>
          
            <button onClick={() => setCurrentPage('viewVisit')}>View Visit</button>
         
          
            <button onClick={() => setCurrentPage('addVisit')}>Add Visit</button>
          
          
            <button onClick={() => setCurrentPage('feedbackPage')}>Feedback Page</button>
          
        </ul>
      </nav>

      <hr />

      {/* Content area */}
      {renderPage()}
    </div>
  );
};

export default VisitPage;
