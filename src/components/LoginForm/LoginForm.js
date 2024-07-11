import React, { useContext, useEffect } from "react";
import { AuthContext } from '../FirebaseAuthProvider'; // Asegúrate de importar desde la ubicación correcta
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  getIdTokenResult
} from "firebase/auth";
import "./LoginForm.css"; // Archivo CSS local

const LoginForm = () => {
  const { user, auth } = useContext(AuthContext);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        if (user) {
          const idTokenResult = await getIdTokenResult(user);
          const token = await user.getIdToken();

          localStorage.setItem("accessToken", token);
          // Los roles deben ser manejados de manera diferente en Firebase
          // Por ejemplo, podrías usar custom claims
          const roles = idTokenResult.claims.roles;
          console.log('Roles:', roles);
        }
      } catch (error) {
        console.error("Error al obtener el token:", error.message);
      }
    };

    getProfileData();
  }, [user]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div className="login-form-container">
     {/* {user && (
        <div>
          <p>Usuario autenticado</p>
          <p>UID: {user.uid}</p> 
        </div>
      )}
      */}
      {user ? (
        <>
          <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
          <button  onClick={logout}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <button onClick={login}>
          Iniciar Sesión
        </button>
      )}
    </div>
  );
};

export default LoginForm;