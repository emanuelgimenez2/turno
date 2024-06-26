import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm';
import { useAuth0 } from '@auth0/auth0-react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const adminEmail = 'emanuelgimenez2@gmail.com';

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Turnos
      </Link>
      <div className="navbar-toggle" onClick={toggleNavbar}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`navbar-items ${isOpen ? 'active' : ''}`}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/turno" className="nav-link" onClick={() => setIsOpen(false)}>
              Agendar Turno
            </Link>
          </li>
          {isAuthenticated && user?.email === adminEmail && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link" onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            </li>
          )}
        </ul>
        <LoginForm />
      </div>
    </nav>
  );
};

export default Navbar;


