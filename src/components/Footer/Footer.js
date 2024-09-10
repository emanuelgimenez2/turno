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
            <li><a href="/about">Acerca de nosotros</a></li>
            <li><a href="/faq">Preguntas frecuentes</a></li>
            <li><a href="/support">Soporte</a></li>
          </ul>
        </div>
       
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Empresa. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
