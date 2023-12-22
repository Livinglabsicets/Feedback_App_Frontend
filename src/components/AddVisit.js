import React, { useState, useEffect } from 'react';
import './AddVisit.css'; // Import your CSS file for styles

const AddVisit = () => {
  const [visitDate, setVisitDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [visitorDetails, setVisitorDetails] = useState([
    { visitor_name: '', visitor_designation: '' },
  ]);
  const [selectedDemos, setSelectedDemos] = useState([]);
  const [demoDetails, setDemoDetails] = useState([]);

  // Fetch demo names and details from the server
  const fetchDemoData = async () => {
    try {
      const response = await fetch('https://feedback-app-v1-0.onrender.com/api/demo/demoList');
      const data = await response.json();
      // Store the demo details in state
      setDemoDetails(data.map(demo => ({ ...demo, selected: false })));
    } catch (error) {
      console.error('Error fetching demo data:', error);
    }
  };

  useEffect(() => {
    // Fetch demo details when the component mounts
    fetchDemoData();
  }, []);

  const handleAddVisitor = () => {
    // Include selected demos in the new visitor's state
    const newVisitor = { visitor_name: '', visitor_designation: '', selectedDemos: [...selectedDemos] };
    setVisitorDetails([...visitorDetails, newVisitor]);
  };

  const handleVisitorChange = (index, key, value) => {
    const updatedVisitors = [...visitorDetails];
    updatedVisitors[index][key] = value;
    setVisitorDetails(updatedVisitors);
  };

  const fetchDemoDetails = async (demoName) => {
    try {
      const response = await fetch(`https://feedback-app-v1-0.onrender.com/api/demo/${demoName}`);
      const data = await response.json();
      return { demoname: demoName, ...data };
    } catch (error) {
      console.error(`Error fetching demo details for ${demoName}:`, error);
      return { demoname: demoName, description: '', questions: [] };
    }
  };

  const handleDemoChange = async (demoName) => {
    setSelectedDemos((prevSelected) =>
      prevSelected.includes(demoName)
        ? prevSelected.filter((selected) => selected !== demoName)
        : [...prevSelected, demoName]
    );
  
    try {
      const demoDetailsData = await fetchDemoDetails(demoName);
      setDemoDetails((prevDetails) =>
        prevDetails.map((demo) =>
          demo.demoname === demoName
            ? { ...demo, selected: !demo.selected, ...demoDetailsData }
            : demo
        )
      );
      console.log("demo details data", demoDetails);
    } catch (error) {
      console.error(`Error fetching demo details for ${demoName}:`, error);
    }
  };
  
  
  
  // Add this useEffect to log the updated demoDetails
  useEffect(() => {
    console.log('Updated demoDetails:', demoDetails);
  }, [demoDetails]);
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log("demoDetailsData data before calling post req",demoDetailsData);
    console.log("demoDetails data before calling post req:",demoDetails.filter((demo)=>demo.selected));
    // Extract selected demos
  const selectedDemos = demoDetails.filter((demo) => demo.selected);
  const customDemo=[];
  // Log names and descriptions of selected demos
  console.log("Selected Demos:");
  selectedDemos.forEach((demo) => {
    console.log(`Name: ${demo.demoname}, Description: ${demo.description}`);
    const questionArray1=demo.questions;
    const questionArray=[];
    //traverse questionArray1 to extract question except id
    for(let i=0;i<questionArray1.length;i++)
    {
      let currentItem=questionArray1[i];
      let questionJson={
        "questionText": currentItem.questionText
      }
      questionArray.push(questionJson);

    }
   
    const jsonData={
      "demo_name": `${demo.demoname}`,
      "demo_description": `${demo.description}`,
      "demo_questions": questionArray
  }
  console.log("demo json data:",jsonData);
  customDemo.push(jsonData);

  });
    
    // customVisitorDetails=[]
    // Prepare data for the POST request
    const postData = {
      "visit_date": new Date(visitDate),
      "client_name": clientName,
      "visitors_details": visitorDetails,
      // demo_details: demoDetails
      //   .filter((demo) => demo.selected)
      //   .map(({ demoname, description, questions }) => ({
      //     demo_name: demoname,
      //     description: "this is description",
      //     questions: [{questionText: "question1"},{questionText: "question2"}],
      //   })),
      "demo_details": customDemo
    };
    
    try {
      console.log("Request data:",postData);
     

      // Make the POST request
      const response = await fetch('https://feedback-app-v1-0.onrender.com/api/visit/createVisit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      // Handle the response as needed
      const result = await response.json();
      console.log('Post request result:', result);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className="add-visit-container">
      <h1>Add Visit</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Visit Date:
          <input type="datetime-local" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
        </label>

        <label>
          Client Name:
          <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </label>

        <h2>Visitor Details</h2>
        {visitorDetails.map((visitor, index) => (
          <div key={index}>
            <label>
              
              <input
                type="text"
                value={visitor.visitor_name}
                onChange={(e) => handleVisitorChange(index, 'visitor_name', e.target.value)}
                placeholder='Visitor Name'
              />
            </label>
            <br></br>
            <label>
             
              <input
                type="text"
                value={visitor.visitor_designation}
                onChange={(e) => handleVisitorChange(index, 'visitor_designation', e.target.value)}
                placeholder=' Visitor Designation'
              />
            </label>
          </div>
        ))}
        <button type="button" onClick={handleAddVisitor}>
          Add Visitor
        </button>

        <h2>Select Demo(s):</h2>
        {demoDetails.map((demo) => (
          <div key={demo.demoname}>
            <label>
              <input
                type="checkbox"
                checked={selectedDemos.includes(demo.demoname)}
                onChange={() => handleDemoChange(demo.demoname)}
              />
              {demo.demoname}
            </label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddVisit;
