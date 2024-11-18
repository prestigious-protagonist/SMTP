import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router for navigation
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uuid, setuuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For navigation

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateuuid = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('myfile', file); // Key is "myfile" as required

      // Make an Axios POST request (replace URL with your endpoint)
      const response = await axios.post(`${import.meta.env.BASE_APP_URL}/api/v1/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Assuming the API responds with a uuid (adjust according to your API structure)
      setuuid(response.data.file); // Access the appropriate field
    } catch (err) {
      setError('Failed to generate the uuid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareClick = () => {
    // Navigate to the Send component
    navigate('/send', { state: { uuid } });
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: dragActive ? '2px dashed #4a90e2' : '2px dashed #cccccc',
        padding: '20px',
        borderRadius: '5px',
        textAlign: 'center',
        margin: '20px',
      }}
    >
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <label htmlFor="file-upload">
        {file ? (
          <p>Selected File: {file.name}</p>
        ) : (
          <p>Drag & Drop your files here or click to upload</p>
        )}
      </label>
      <button
        onClick={() => document.getElementById('file-upload').click()}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          cursor: 'pointer',
          background: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Choose File
      </button>

      {file && (
        <button
          onClick={handleGenerateuuid}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            cursor: 'pointer',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          {loading ? 'Generating...' : 'Generate uuid'}
        </button>
      )}

      {uuid && typeof uuid === 'string' && (
        <div style={{ marginTop: '15px' }}>
          <p style={{ color: '#4a90e2' }}>
            Generated uuid: <a href={uuid} target="_blank" rel="noopener noreferrer">{uuid}</a>
          </p>
          <button
            onClick={handleShareClick}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              cursor: 'pointer',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            Share
          </button>
        </div>
      )}

      {error && (
        <p style={{ marginTop: '15px', color: 'red' }}>{error}</p>
      )}
    </div>
  );
};

export default Upload;
