import React from "react";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>Teléfono: 3442-304053</p>
          <p>Email: curupolinave@gmail.com</p>
        </div>
        <div className="footer-section">
          <h4>Enlaces útiles</h4>
          <ul>
           
            <li><a href="https://servi-tec-six.vercel.app/">Soporte</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Polinave. Todos los derechos reservados.</p>
        
        {/* Línea de créditos de desarrollo */}
        <div className="developer-credits">
          <p>Desarrollado por {' '}
            <a 
              href="https://servi-tec-six.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="developer-link"
            >
              ServiTec
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;