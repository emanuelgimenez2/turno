import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm';
import { AuthContext } from '../FirebaseAuthProvider';
import logo from '../../assets/logo.png';
import logoImage from "../../assets/pna.png";
import './Navbar.css';

const Navbar = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logoImage} alt="Logo" className="logo" />
        <Link to="/" className="navbar-brand">
          Turnos
        </Link>
      </div>
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
          
          {/* Mostrar "Mis Turnos" solo si el usuario está autenticado */}
          {user && (
            <li className="nav-item">
              <Link to="/mis-turnos" className="nav-link" onClick={() => setIsOpen(false)}>
                Mis Turnos
              </Link>
            </li>
          )}
          
          {/* Mostrar el enlace de administrador solo si el usuario es admin */}
          {user && isAdmin && (
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