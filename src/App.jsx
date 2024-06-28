import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import LoginForm from './components/LoginForm/LoginForm';
import TurnoForm from './components/TurnoForm/TurnoForm';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

import './App.css'; // Asegúrate de crear este archivo si no existe

function App() {

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/turno" element={<TurnoForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
