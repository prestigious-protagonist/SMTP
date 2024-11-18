import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Upload from './components/Upload'; // Adjust the import paths as needed
import Send from './components/Send';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<Upload />} />

        <Route path="/send" element={<Send />} />

        <Route path="*" element={<Navigate to="/upload" />} />
      </Routes>
    </Router>
  );
}

export default App;
