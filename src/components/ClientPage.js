import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ClientPage.css';


const ClientPage = () => {
  const { name, date } = useParams();

  const [data, setData] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [visitComment, setVisitComment] = useState("");  
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

  useEffect(() => {
    //console.log("matchedData :", matchedData);
    console.log("Data Matched.");
  }, [matchedData]);

//req data 
  const feedbackData = {
    "visit_date": matchedData[0]?.visit_date,
    "client_name": matchedData[0]?.client_name,
    "overall_rating": overallRating,
    "demo_feedback": demoFeedback,
    "visit_comment": visitComment
  };

  
  //json for mail
  // const eBody = "";
  // for (const jsonObject of feedbackData.demo_feedback) {
  //   eBody += `${jsonObject.demo_name} = ${jsonObject.demo_rating} \n`;
  // }
const response = {
  "visit_date": feedbackData.visit_date,
  "client_name": feedbackData.client_name,
  "overall_rating": feedbackData.overall_rating,
  "visit_comment": feedbackData.visit_comment,
  "demo_feedback": feedbackData.demo_feedback
};
var eBody = "";
  for (const jsonObject of response.demo_feedback) {
    eBody += `${jsonObject.demo_name}: ${jsonObject.demo_rating} \n`;
  }
  // send mail function define here

  async function sendEmail() {
    var data = {
        service_id: 'service_7q3tl9p',
        template_id: 'template_xe43dpq',
        user_id: 'CegoZl-kwZuIrb_43',
        template_params: {
            'visit_date': response.visit_date,
            'client_name': response.client_name,
            'overall_rating': response.overall_rating,
            'visit_comment': response.visit_comment,
            'demo_feedback': eBody, 
            'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...'
        }
    };
  
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
  
        if (response.ok) {
            console.log('Your mail is sent!');
        } else {
            const errorData = await response.json();
            console.log('Oops... ' + JSON.stringify(errorData));
        }
    } catch (error) {
        console.log('Oops... ' + error.message);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

   

    try {
      //console.log("request data:", feedbackData);
      const response = await fetch('https://feedback-app-v1-0.onrender.com/api/feedback/createFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedbackData)
      });

      const responseData = await response.json();
      //setResponseData(responseData);
    //  console.log('Feedback saved:', responseData);
      alert("ThankYou for your lovely Feedback");
      //console.log("resData:",resData);
      //send mail function
      sendEmail();
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  // Helper function to display star ratings
  const renderStarRating = (ratingValue, setRatingFunction) => {
    const stars = Array.from({ length: 5 }, (_, index) => {
      const rating = index + 1;
      return (
        <span 
          key={rating}
          style={{ cursor: 'pointer', color: rating <= ratingValue ? 'gold' : 'gray', fontSize: '30px', marginLeft: '20px'  }}
          onClick={() => setRatingFunction(rating)}
        >
          ★
        </span>
      );
    });
    return stars;
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Hello {name}, Please give your valuable feedback!</h2>

        <form onSubmit={handleSubmit}>
          <label >
            Overall Rating:
            {renderStarRating(overallRating, setOverallRating)}
          </label>
          
          {matchedData[0]?.demo_details?.map((demo, demoIndex) => (
            <div key={demo.demo_name}>
              <h3>{demo.demo_name}</h3>

              <label>
                 {demo.demo_name} Demo Rating: 
                {renderStarRating(demoFeedback[demoIndex]?.demo_rating || 0, (rating) => {
                  const updatedFeedback = [...demoFeedback];
                  updatedFeedback[demoIndex] = {
                    ...updatedFeedback[demoIndex],
                    demo_name: demo.demo_name,
                    demo_rating: rating
                  };
                  setDemoFeedback(updatedFeedback);
                })}
              </label>
              
              {demo.demo_questions?.map((question, questionIndex) => (
                <div key={question.questionText}>
                  <h4>{question.questionText}</h4>
                  <label>
                    
                    {renderStarRating(demoFeedback[demoIndex]?.question_feedback?.[questionIndex]?.question_rating || 0, (rating) => {
                      const updatedFeedback = [...demoFeedback];
                      if (!updatedFeedback[demoIndex]?.question_feedback) {
                        updatedFeedback[demoIndex].question_feedback = [];
                      }
                      updatedFeedback[demoIndex].question_feedback[questionIndex] = {
                        ...updatedFeedback[demoIndex]?.question_feedback?.[questionIndex],
                        question: question.questionText,
                        question_rating: rating
                      };
                      setDemoFeedback(updatedFeedback);
                    }, `question-${questionIndex}`)}
                  </label>
                </div>
              ))}
              
            </div>
          ))}
          
          <label>
            Visit Comment:
            <input 
              type="text" 
              name='comment'
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
