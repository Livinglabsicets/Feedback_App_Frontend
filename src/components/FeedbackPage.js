import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FeedbackPage.css';

const FeedbackPage = () => {
  //state to store fetched data
  const [feedbackData, setFeedbackData] = useState([]);
  
  
  var currentVisitStatus="We are checking today visits.";
  
  //fetch data from the api
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://feedback-app-v1-0.onrender.com/api/visit/visitList');
        const data = await response.json();
        setFeedbackData(data);
      } catch (error) {
        console.error("Error Fetching Data:", error);
      }
    };

    fetchData();
  }, []);

  // Utility function to format date as DD-MM-YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  //Get current date in DD-MM-YYYY format
  const currentDate = formatDate(new Date().toISOString().split('T')[0]);

  //filter data based on current date
  const filteredData = feedbackData.filter(item => formatDate(item.visit_date) === currentDate);
  if(filteredData.length === 0)
  {
    currentVisitStatus="No Visit Today."
   
  }

  return (
    <div className="feedback-container">
      <h2>Feedback Page</h2>

      <div className="button-container">
        
      {filteredData.length === 0 ? (
        <p>{currentVisitStatus}</p>
      ) : (
        filteredData.map((item, index) => {
          // Extract time from visit_date
          const time = new Date(item.visit_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          return (
            <Link key={index} to={`/feedback/client/${item.client_name}/${item.visit_date}`} className="button-link">
              <button className="custom-button">
                {item.client_name} - {time}
              </button>
            </Link>
          );
        })
      )}
        
      
      </div>
    </div>
  );
};

export default FeedbackPage;
