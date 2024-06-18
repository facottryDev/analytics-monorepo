import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Filters from './Pages/Filter';
import LogManager from './Pages/LogManager';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logmanager" element= {<LogManager/>} />
        <Route path="/filters" element={<Filters />} />
      </Routes>
    </Router>
  );
};

export default App;
