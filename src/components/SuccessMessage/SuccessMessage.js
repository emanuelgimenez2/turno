import React from 'react';
import './SuccessMessage.css'; // Archivo CSS local

const SuccessMessage = ({ onClose }) => {
  return (
    <div className="success-message-overlay">
      <div className="success-message">
        <h2>¡Turno generado con éxito!</h2>
        <p>El turno ha sido registrado correctamente.</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default SuccessMessage;
