// /src/components/LoginForm/LoginForm.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './LoginForm.css'; // Archivo CSS local

const LoginForm = () => {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  return (
    <div className="login-form-container">
      {isAuthenticated ? (
        <>
          <img src={user.picture} alt={user.name} className="user-avatar" />
          {/* <span className="user-info">{user.name}</span> */}
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <button onClick={() => loginWithRedirect()}>Iniciar Sesión</button>
      )}
    </div>
  );
};

export default LoginForm;



