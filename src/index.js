



import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';


 const domain = process.env.REACT_APP_AUTH0_DOMAIN;
 const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID; 
 const audience = process.env.REACT_APP_AUTH0_AUDIENCE; // Si necesitas un audience específico

 //Verificación de las variables de entorno
 if (!domain || !clientId) {
   throw new Error('Missing Auth0 domain or clientId');
 }

 console.log('Auth0 Domain:', domain);
 console.log('Auth0 Client ID:', clientId);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
       domain={domain}
       clientId={clientId}
       
      authorizationParams={{
         redirect_uri: window.location.origin,
         audience: audience, // Incluye esto solo si necesitas un audience específico
       }}
      // useRefreshTokens={true}
       cacheLocation="localstorage"
       role={(authResult) => {
        
    const roles = authResult.idTokenClaims['https://dev-590pjfz6.us.auth0.com/userinfo'];
    return roles.includes('admin') ? 'admin' : 'user';
  }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);