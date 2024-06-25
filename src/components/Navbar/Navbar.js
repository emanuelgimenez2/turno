// /src/components/Navbar/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm';
import { useAuth0 } from '@auth0/auth0-react';
import './Navbar.css'; // Archivo CSS local

const Navbar = () => {
  const { user, isAuthenticated } = useAuth0();
  console.log(user)
  const adminEmail = 'emanuelgimenez2@gmail.com';
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
           {user.email === adminEmail && ( // Mostrar solo si el correo coincide con el correo de administrador
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
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


