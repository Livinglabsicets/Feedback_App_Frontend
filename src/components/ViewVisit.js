import React, { useEffect, useState } from 'react';
import './ViewVisit.css'; // Import your CSS file for styles

const ViewVisit = () => {
  const [visitData, setVisitData] = useState([]);

  // Assume you have a function to fetch the data from the API
  const fetchData = async () => {
    try {
      // Make API call and set the data to the state
      const response = await fetch('https://feedback-app-v1-0.onrender.com/api/visit/visitList');
      const data = await response.json();
      
      // Sort the visitData based on visit_date in descending order
      const sortedData = data.sort((a, b) => new Date(a.visit_date) - new Date(b.visit_date));

      setVisitData(sortedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);

  // Function to format date as DD/MM/YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getTime=(visit_date)=>{
  // Extract time from visit_date
  const time = new Date(visit_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return time;
}

  return (
    <div className="visit-container">
      {visitData.map((visit, index) => (
        <div key={visit._id} className="visit-table">
          <h1>Visit {index + 1}</h1>
          <table>
            <thead>
              <tr>
                <th>Visit Date</th>
                <th>Client Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatDate(visit.visit_date)} - {getTime(visit.visit_date)}</td>
                <td>{visit.client_name}</td>
              </tr>
            </tbody>
          </table>

          <h2>Visitor Details</h2>
          <table>
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Visitor Designation</th>
              </tr>
            </thead>
            <tbody>
              {visit.visitors_details.map((visitor) => (
                <tr key={visitor._id}>
                  <td>{visitor.visitor_name}</td>
                  <td>{visitor.visitor_designation}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Demo Details</h2>
          <table>
            <thead>
              <tr>
                <th>Demo Name</th>
                <th>Demo Description</th>
                <th>Demo Questions</th>
              </tr>
            </thead>
            <tbody>
              {visit.demo_details.map((demo, i) => (
                <tr key={i}>
                  <td>{demo.demo_name}</td>
                  <td>{demo.demo_description}</td>
                  <td>
                    <ul>
                      {demo.demo_questions.map((question, j) => (
                        <li key={j}>{question.questionText}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ViewVisit;
