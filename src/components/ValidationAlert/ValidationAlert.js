// src/components/ValidationAlert/ValidationAlert.js
import React from "react";
import PropTypes from "prop-types";
import "./ValidationAlert.css"; // Asegúrate de crear un archivo CSS para los estilos

const ValidationAlert = ({ message,onClose }) => {
  if (!message) return null;

  return (
    <div className="success-message-overlay">
      <div className="success-message">
        <p>{message}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

ValidationAlert.propTypes = {
  message: PropTypes.string,
};

export default ValidationAlert;
