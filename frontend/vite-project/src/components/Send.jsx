import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Send = () => {
  const [uuid, setuuid] = useState(''); // uuid value, starts as an empty string
  const [emailTo, setEmailTo] = useState(''); // Email To value, starts as an empty string
  const [emailFrom, setEmailFrom] = useState(''); // Email From value, starts as an empty string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation(); // To access the passed uuid

  useEffect(() => {
    // Fetch the emailTo value from the /uploads endpoint
    const fetchEmailTo = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/uploads');
        setEmailTo(response.data.email || ''); // Ensure emailTo is never undefined
      } catch (err) {
        setError('Failed to fetch email');
      }
    };

    // Set the uuid passed from the Upload component
    if (location.state?.uuid) {
      setuuid(location.state.uuid);
    }

    fetchEmailTo(); // Fetch the emailTo
  }, [location.state]);

  const handleSendEmail = async () => {
    if (!emailFrom) {
      setError('Please provide your email.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Send the email with the uuid and emailFrom, emailTo
      const response = await axios.post(`${import.meta.env.BASE_APP_URL}/api/v1/send`, {
        uuid,
        emailTo,
        emailFrom,
      });

      if (response.status === 200) {
        alert('Email sent successfully!');
      }
    } catch (err) {
      setError('Failed to send email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', textAlign: 'center' }}>
      <h2>Send uuid via Email</h2>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="uuid">uuid</label>
        <input
          type="text"
          id="uuid"
          value={uuid}
          readOnly // Make the uuid input non-editable
          style={{
            width: '100%',
            padding: '8px',
            margin: '5px 0',
            borderRadius: '4px',
            backgroundColor: '#f0f0f0', // Grey background to indicate it's non-editable
          }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="emailTo">Email To</label>
        <input
          type="email"
          id="emailTo"
          value={emailTo}
          onChange={(e) => setEmailTo(e.target.value)} // Email To is now editable
          style={{
            width: '100%',
            padding: '8px',
            margin: '5px 0',
            borderRadius: '4px',
            backgroundColor: '#ffffff', // Editable input will have white background
          }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="emailFrom">Email From</label>
        <input
          type="email"
          id="emailFrom"
          value={emailFrom}
          onChange={(e) => setEmailFrom(e.target.value)}
          style={{ width: '100%', padding: '8px', margin: '5px 0', borderRadius: '4px' }}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleSendEmail}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {loading ? 'Sending...' : 'Send Email'}
      </button>
    </div>
  );
};

export default Send;
