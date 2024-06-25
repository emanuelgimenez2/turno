// /src/components/Navbar/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm';
import './Navbar.css'; // Archivo CSS local

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Turnos
      </Link>
      <div className="navbar-items">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/turno" className="nav-link">
              Agendar Turno
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin" className="nav-link">
              Admin
            </Link>
          </li>
        </ul>
        <LoginForm />
      </div>
    </nav>
  );
};

export default Navbar;


