// /src/components/LoginForm/LoginForm.js
import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./LoginForm.css"; // Archivo CSS local

const LoginForm = () => {
  const {
    loginWithRedirect,
    isAuthenticated,
    user,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0();

  useEffect(() => {
    const getProfileData = async () => {
      try {
        if (isAuthenticated) {
          const idTokenClaims = await getIdTokenClaims();
          const token = await getAccessTokenSilently();

          localStorage.setItem("accessToken", token);
          // eslint-disable-next-line no-unused-vars
          const roles = idTokenClaims["https://turno.com/roles"]; // Reemplaza con el namespace de tus roles
        }
      } catch (error) {
        console.error("Error al obtener el token:", error.message);
      }
    };

    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div className="login-form-container">
      {isAuthenticated ? (
        <>
          <img src={user.picture} alt={user.name} className="user-avatar" />
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <button
          onClick={() =>
            loginWithRedirect({ callbackUrl: window.location.href })
          }
        >
          Iniciar Sesión
        </button>
      )}
    </div>
  );
};

export default LoginForm;
