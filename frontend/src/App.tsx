import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import SkillProfile from './components/SkillProfile';
import SkillEvolutionDashboard from './pages/SkillEvolutionDashboard';
import './index.css';
import './App.css';

const App: React.FC = () => {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/auth" element={!token ? <Auth /> : <Navigate to="/profile" />} />
          <Route path="/profile" element={token ? <SkillProfile /> : <Navigate to="/auth" />} />
          <Route path="/dashboard" element={token ? <SkillEvolutionDashboard /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to={token ? "/profile" : "/auth"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;