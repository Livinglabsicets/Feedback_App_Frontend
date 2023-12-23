import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientPage.css';


const ClientPage = () => {
  const { name, date } = useParams();

  const [data, setData] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [visitComment, setVisitComment] = useState("");  // State for visit comment
  const [demoFeedback, setDemoFeedback] = useState([]);
  const [overallRating, setOverallRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://feedback-app-v1-0.onrender.com/api/visit/visitList');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item => item.visit_date === date && item.client_name === name);
    setMatchedData(filtered);
  }, [data, date, name]);

  // Log the matched data when it changes
  useEffect(() => {
    console.log("matchedData :",matchedData);
  }, [matchedData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      "visit_date": matchedData[0]?.visit_date,
      "client_name": matchedData[0]?.client_name,
      "overall_rating": overallRating,
      "demo_feedback": demoFeedback,
      "visit_comment": visitComment // Dynamic value from the input field
    };

    try {
      console.log("request data:", feedbackData);
      const response = await fetch('https://feedback-app-v1-0.onrender.com/api/feedback/createFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });

      const responseData = await response.json();
      console.log('Feedback saved:', responseData);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  return (
    <div className="container">
    <div className="form-container">
      <h2>Hello {name}, Please give your valuable feedback!</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Overall Rating:
          <input 
            type="number" 
            min="1" 
            max="5" 
            value={overallRating} 
            onChange={(e) => setOverallRating(e.target.value)} 
          />
        </label>
        
        {matchedData[0]?.demo_details?.map((demo, demoIndex) => (
          <div key={demo.demo_name}>
            <h3>{demo.demo_name}</h3>

            <label>
              {demo.demo_name} Demo Rating:
              <input 
                type="number" 
                min="1" 
                max="5" 
                value={demoFeedback[demoIndex]?.demo_rating || 0} 
                onChange={(e) => {
                  const updatedFeedback = [...demoFeedback];
                  updatedFeedback[demoIndex] = { 
                    ...updatedFeedback[demoIndex],
                    demo_name: demo.demo_name, 
                    demo_rating: e.target.value 
                  };
                  setDemoFeedback(updatedFeedback);
                }} 
              />
            </label>
            
            {demo.demo_questions?.map((question, questionIndex) => (
              <div key={question.questionText}>
                <h4>{question.questionText}</h4>
                <label>
                  Question Rating:
                  <input 
                    type="number" 
                    min="1" 
                    max="5" 
                    value={demoFeedback[demoIndex]?.question_feedback?.[questionIndex]?.question_rating || 0} 
                    onChange={(e) => {
                      const updatedFeedback = [...demoFeedback];
                      if (!updatedFeedback[demoIndex]?.question_feedback) {
                        updatedFeedback[demoIndex].question_feedback = [];
                      }
                      updatedFeedback[demoIndex].question_feedback[questionIndex] = { 
                        ...updatedFeedback[demoIndex]?.question_feedback?.[questionIndex],
                        question: question.questionText, 
                        question_rating: e.target.value 
                      };
                      setDemoFeedback(updatedFeedback);
                    }} 
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
        
        {/* Input field for visit comment */}
        <label>
          Visit Comment:
          <input 
            type="text" 
            value={visitComment} 
            onChange={(e) => setVisitComment(e.target.value)} 
          />
        </label>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
    </div>
  );
};

export default ClientPage;
