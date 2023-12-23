import React, { useState, useEffect } from 'react';
import './AddVisit.css'; // Import your CSS file for styles

const AddVisit = () => {
  const [visitDate, setVisitDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [visitorDetails, setVisitorDetails] = useState([{ visitor_name: '', visitor_designation: '' }]);
  const [selectedDemos, setSelectedDemos] = useState([]);
  const [demoDetails, setDemoDetails] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);


  useEffect(() => {
    const fetchDemoData = async () => {
      try {
        const response = await fetch('https://feedback-app-v1-0.onrender.com/api/demo/demoList');
        const data = await response.json();
        setDemoDetails(data.map(demo => ({ ...demo, selected: false })));
      } catch (error) {
        console.error('Error fetching demo data:', error);
      }
    };

    fetchDemoData();
  }, []);

  const handleAddVisitor = () => {
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
    } catch (error) {
      console.error(`Error fetching demo details for ${demoName}:`, error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const selectedDemosData = demoDetails.filter((demo) => demo.selected).map((demo) => {
      const questionArray = demo.questions.map(question => ({ questionText: question.questionText }));
      return {
        demo_name: demo.demoname,
        demo_description: demo.description,
        demo_questions: questionArray
      };
    });

    const postData = {
      visit_date: new Date(visitDate),
      client_name: clientName,
      visitors_details: visitorDetails,
      demo_details: selectedDemosData
    };

    try {
      const response = await fetch('https://feedback-app-v1-0.onrender.com/api/visit/createVisit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        // Clear form on successful submission
        setVisitDate('');
        setClientName('');
        setVisitorDetails([{ visitor_name: '', visitor_designation: '' }]);
        setSelectedDemos([]);
        //setDemoDetails([]);
        alert("Visit Added successfully!");
        // Set the state to true to trigger a component refresh
        setShouldRefresh(true);
        
      } else {
        const data = await response.json();
        throw new Error(data.message || 'An error occurred while submitting.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Visit not added. Please check you have filled required details or not?');
      setSubmissionError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-visit-container" key={shouldRefresh.toString()}>
      <h1>Add Visit</h1>
      {isSubmitting && <p>Submitting...</p>}
      {submissionError && <p style={{ color: 'red' }}>{submissionError}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Visit Date:
          <input type="datetime-local" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required='true'/>
        </label>

        <label>
          Client Name:
          <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required='true'/>
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
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddVisit;
