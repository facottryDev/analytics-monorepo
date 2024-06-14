import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Registration from './Pages/Registration';
import Filters from './Pages/Filter';
import ProtectedRoute from './ProtectedRoute';
import LogManager from './Pages/LogManager';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/registration" element={<Registration setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/logmanager" element= <LogManager/> />
        <Route 
          path="/filters" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Filters />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
