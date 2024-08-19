import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Render the Login component when the path is "/" */}
        <Route path="/" element={<Login />} />
        {/* Redirect from "/" to "/login" */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
