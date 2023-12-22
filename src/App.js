
import './App.css';
// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import VisitPage from './components/VisitPage';
import FeedbackPage from './components/FeedbackPage';
import ViewVisit from './components/ViewVisit';
import AddVisit from './components/AddVisit';
import ClientPage from './components/ClientPage'

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/admin" /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/admin"
          element={isLoggedIn ? <AdminPage /> : <Navigate to="/login" />}
        />
        <Route path="/visit" element={isLoggedIn ? <VisitPage /> : <Navigate to="/login" />} />
        <Route
          path="/feedback"
          element={isLoggedIn ? <FeedbackPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/view-visit"
          element={isLoggedIn ? <ViewVisit /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-visit"
          element={isLoggedIn ? <AddVisit /> : <Navigate to="/login" />}
        />
        <Route
          path="/feedback/client/:name/:date"
          element={isLoggedIn ? <ClientPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
